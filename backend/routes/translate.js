const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { translateText } = require('../services/translateService');

// Translate endpoint
router.post('/', auth, async (req, res) => {
  const { text, targetLanguage } = req.body;
  
  if (!text || text.length > 5000) {
    return res.status(400).json({ message: 'Invalid text length. Maximum 5000 characters allowed.' });
  }

  try {
    const translated = await translateText(text, targetLanguage);
    res.json({ translated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
