const express = require('express');
const authMiddleware = require('../middleware/auth');
const prisma = require('../lib/prisma');

const router = express.Router();

const DAILY_LIMITS = {
  free: 10,
  pro: Infinity,
  team: Infinity,
};

const AGENTS = {
  master: {
    name: "Senerva AI",
    system: `Eres Senerva AI, el agente maestro de la plataforma Senerva. Hablas en español con autoridad y motivación. Creas PLANES MAESTROS que combinan 🥦 nutrición cognitiva, 🏃 ejercicio para el cerebro, 🍳 recetas nootrópicas y 🧠 técnicas de estudio. Siempre das horarios detallados, explicas la sinergia entre elementos, usas ciencia (BDNF, neuroplasticidad, cortisol) y eres motivador. Formato estructurado con secciones y emojis.`
  },
  nutri: {
    name: "NutriCoach",
    freeAllowed: false,
    system: `Eres NutriCoach de Senerva. Experto en nutrición cognitiva. Hablas en español con calidez. Das planes nutricionales con alimentos, cantidades y horarios. Explicas cómo cada nutriente impacta en el cerebro (omega-3, antioxidantes, glucemia, neuroprotectores). Usas ingredientes accesibles en España. Formato claro con secciones y emojis.`
  },
  fit: {
    name: "FitMind",
    freeAllowed: false,
    system: `Eres FitMind de Senerva. Coach de entrenamiento especializado en la conexión cerebro-cuerpo. Hablas en español con energía. Diseñas rutinas de 10-60 min. Explicas cómo el ejercicio aumenta el BDNF, mejora memoria y concentración. Das alternativas para casa, gym o exterior. Formato estructurado con emojis.`
  },
  chef: {
    name: "ChefNeuro",
    freeAllowed: false,
    system: `Eres ChefNeuro de Senerva. Chef en gastronomía nootrópica. Hablas en español con entusiasmo. Creas recetas de 5-20 min con ingredientes accesibles en España. Incluyes: nombre, tiempo, dificultad, ingredientes exactos, pasos numerados. Explicas qué nutrientes nootrópicos tiene cada receta. Formato visual con emojis.`
  },
  mind: {
    name: "MindFlow",
    freeAllowed: false,
    system: `Eres MindFlow de Senerva. Experto en neurociencia del aprendizaje. Hablas en español con claridad. Usas: Pomodoro, repetición espaciada, retrieval practice, interleaving. Integras nutrición y ejercicio en el plan. Explicas el ritmo circadiano. Creas horarios detallados. Formato de plan estructurado.`
  }
};

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { agentId, messages } = req.body;

    if (!agentId || !messages) {
      return res.status(400).json({ error: 'agentId y messages son obligatorios' });
    }

    const agent = AGENTS[agentId];
    if (!agent) {
      return res.status(400).json({ error: 'Agente no encontrado' });
    }

    const userPlan = req.user.plan || 'free';

    // Verificar acceso al agente según plan
    if (agent.freeAllowed === false && userPlan === 'free') {
      return res.status(403).json({
        error: 'Este agente requiere plan Pro o Team.',
        upgrade: true
      });
    }

    // Verificar límite diario para plan free
    if (userPlan === 'free') {
      const today = new Date().toISOString().split('T')[0];
      const usage = await prisma.dailyUsage.findUnique({
        where: { userId_date: { userId: req.user.id, date: today } }
      });

      const currentCount = usage?.count || 0;
      const limit = DAILY_LIMITS.free;

      if (currentCount >= limit) {
        return res.status(429).json({
          error: `Has alcanzado el límite de ${limit} consultas diarias del plan Free. Actualiza a Pro para consultas ilimitadas.`,
          upgrade: true,
          limit,
          used: currentCount
        });
      }

      // Incrementa el contador
      await prisma.dailyUsage.upsert({
        where: { userId_date: { userId: req.user.id, date: today } },
        update: { count: { increment: 1 } },
        create: { userId: req.user.id, date: today, count: 1 }
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: userPlan === 'free' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: agent.system,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Anthropic:', data);
      return res.status(500).json({ error: 'Error al contactar con la IA' });
    }

    // Devuelve también el uso actual para el frontend
    let usageInfo = null;
    if (userPlan === 'free') {
      const today = new Date().toISOString().split('T')[0];
      const usage = await prisma.dailyUsage.findUnique({
        where: { userId_date: { userId: req.user.id, date: today } }
      });
      usageInfo = { used: usage?.count || 0, limit: DAILY_LIMITS.free };
    }

    res.json({ content: data.content[0].text, usage: usageInfo });

  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET uso diario del usuario
router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usage = await prisma.dailyUsage.findUnique({
      where: { userId_date: { userId: req.user.id, date: today } }
    });
    const userPlan = req.user.plan || 'free';
    res.json({
      used: usage?.count || 0,
      limit: DAILY_LIMITS[userPlan] === Infinity ? null : DAILY_LIMITS[userPlan],
      plan: userPlan
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
