const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const prisma = require('../lib/prisma');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, goal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, goal, verifyToken }
    });

    try {
      await transporter.sendMail({
        from: `"Senerva" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirma tu cuenta en Senerva',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
            <h2 style="color:#1E8A4A">Bienvenido a Senerva, ${name} 🌿</h2>
            <p>Haz clic en el botón para confirmar tu cuenta:</p>
            <a href="https://senerva.com/verify?token=${verifyToken}"
               style="display:inline-block;padding:12px 28px;background:#1E8A4A;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0">
              Confirmar mi cuenta
            </a>
            <p style="color:#888;font-size:12px;margin-top:24px">Si no creaste esta cuenta ignora este email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError.message);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Cuenta creada correctamente',
      token,
      user: { id: user.id, name: user.name, email: user.email, goal: user.goal, plan: user.plan, role: user.role, verified: user.verified }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Debes verificar tu email antes de acceder. Revisa tu bandeja de entrada.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login correcto',
      token,
      user: { id: user.id, name: user.name, email: user.email, goal: user.goal, plan: user.plan, role: user.role, verified: user.verified }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// VERIFICAR EMAIL
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verifyToken: null }
    });

    res.json({ message: 'Email verificado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// RECUPERAR CONTRASEÑA
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'Si el email existe recibirás un correo' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires }
    });

    try {
      await transporter.sendMail({
        from: `"Senerva" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recupera tu contraseña de Senerva',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
            <h2 style="color:#1E8A4A">Recupera tu contraseña 🔐</h2>
            <p>El enlace expira en 1 hora.</p>
            <a href="https://senerva.com/reset-password?token=${resetToken}"
               style="display:inline-block;padding:12px 28px;background:#1E8A4A;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0">
              Cambiar contraseña
            </a>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError.message);
    }

    res.json({ message: 'Si el email existe recibirás un correo' });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'El enlace ha expirado o no es válido' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetExpires: null }
    });

    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
