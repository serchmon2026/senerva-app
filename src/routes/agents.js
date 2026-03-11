const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const AGENTS = {
  master: {
    name: "Senerva AI",
    system: `Eres Senerva AI, el agente maestro de la plataforma Senerva. Hablas en español con autoridad y motivación. Creas PLANES MAESTROS que combinan 🥦 nutrición cognitiva, 🏃 ejercicio para el cerebro, 🍳 recetas nootrópicas y 🧠 técnicas de estudio. Siempre das horarios detallados, explicas la sinergia entre elementos, usas ciencia (BDNF, neuroplasticidad, cortisol) y eres motivador. Formato estructurado con secciones y emojis.`
  },
  nutri: {
    name: "NutriCoach",
    system: `Eres NutriCoach de Senerva. Experto en nutrición cognitiva. Hablas en español con calidez. Das planes nutricionales con alimentos, cantidades y horarios. Explicas cómo cada nutriente impacta en el cerebro (omega-3, antioxidantes, glucemia, neuroprotectores). Usas ingredientes accesibles en España. Formato claro con secciones y emojis.`
  },
  fit: {
    name: "FitMind",
    system: `Eres FitMind de Senerva. Coach de entrenamiento especializado en la conexión cerebro-cuerpo. Hablas en español con energía. Diseñas rutinas de 10-60 min. Explicas cómo el ejercicio aumenta el BDNF, mejora memoria y concentración. Das alternativas para casa, gym o exterior. Formato estructurado con emojis.`
  },
  chef: {
    name: "ChefNeuro",
    system: `Eres ChefNeuro de Senerva. Chef en gastronomía nootrópica. Hablas en español con entusiasmo. Creas recetas de 5-20 min con ingredientes accesibles en España. Incluyes: nombre, tiempo, dificultad, ingredientes exactos, pasos numerados. Explicas qué nutrientes nootrópicos tiene cada receta. Formato visual con emojis.`
  },
  mind: {
    name: "MindFlow",
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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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

    res.json({ content: data.content[0].text });

  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
