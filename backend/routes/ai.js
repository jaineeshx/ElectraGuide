const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getChatResponse, simulateScenario } = require('../services/aiService');

// AI Chat endpoint
router.post('/chat', auth, async (req, res) => {
  const { message, history } = req.body;
  
  // 1. Validate message length
  if (!message || message.length > 1000) {
    return res.status(400).json({ message: 'Message too long. Maximum 1000 characters allowed.' });
  }

  // 2. Validate and sanitize history: Only allow 'user' messages from client
  const validatedHistory = (history || []).filter(h => h.role === 'user').slice(-10); 

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
