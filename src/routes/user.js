const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET perfil del usuario autenticado
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        goal: true,
        plan: true,
        verified: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GUARDAR conversación
router.post('/conversations', authMiddleware, async (req, res) => {
  try {
    const { agentId, messages } = req.body;

    const conversation = await prisma.conversation.upsert({
      where: {
        id: req.body.conversationId || 0,
      },
      update: { messages },
      create: {
        userId: req.user.id,
        agentId,
        messages,
      }
    });

    res.json({ conversation });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET conversaciones del usuario
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ conversations });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET conversación por agente
router.get('/conversations/:agentId', authMiddleware, async (req, res) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        userId: req.user.id,
        agentId: req.params.agentId,
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ conversation });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE cuenta
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.user.id }
    });

    res.json({ message: 'Cuenta eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
