const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware solo admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

// GET todos los usuarios
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, plan: true,
        role: true, verified: true, goal: true, createdAt: true,
        _count: { select: { conversations: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// PATCH cambiar plan de usuario
router.patch('/users/:id/plan', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { plan },
      select: { id: true, name: true, email: true, plan: true }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// PATCH cambiar rol de usuario
router.patch('/users/:id/role', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// DELETE usuario
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET estadísticas generales
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalConversations, planCounts] = await Promise.all([
      prisma.user.count(),
      prisma.conversation.count(),
      prisma.user.groupBy({ by: ['plan'], _count: true }),
    ]);
    res.json({ totalUsers, totalConversations, planCounts });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// PATCH editar datos de usuario
router.patch('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, plan, role, verified, billingName, billingNif, billingAddress, billingCity, billingZip, billingCountry, billingState } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email, plan, role, verified, billingName, billingNif, billingAddress, billingCity, billingZip, billingCountry, billingState },
      select: { id: true, name: true, email: true, plan: true, role: true, verified: true, billingName: true, billingNif: true, billingAddress: true, billingCity: true, billingZip: true, billingCountry: true }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
