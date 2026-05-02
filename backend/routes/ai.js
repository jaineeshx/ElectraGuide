const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getChatResponse, simulateScenario } = require('../services/aiService');

// AI Chat endpoint
router.post('/chat', auth, async (req, res) => {
  const { message, history } = req.body;
  
  // Validate and sanitize history: Only allow 'user' messages from client
  const validatedHistory = (history || []).filter(h => h.role === 'user').slice(-10); // Limit context to last 10 messages

  try {
    const aiResponse = await getChatResponse(validatedHistory, message);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Scenario simulation endpoint
router.post('/simulate', auth, async (req, res) => {
  const { scenario } = req.body;
  try {
    const aiResponse = await simulateScenario(scenario);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
