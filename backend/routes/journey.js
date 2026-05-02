const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user journey progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.journeyProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Master Answer Key (Server-Side Only)
const QUIZ_ANSWERS = {
  1: 'B', // Minimum age to vote: 18
  2: 'A', // Frequency of general elections: 5 years
  3: 'C', // Constitutional body: Election Commission of India
  4: 'D', // Identity proof: EPIC Card
};

// Submit Quiz (Server-Side Verification)
router.post('/quiz/submit', auth, async (req, res) => {
  const { answers } = req.body; // Array of { qId, answer }
  try {
    let score = 0;
    answers.forEach(item => {
      if (QUIZ_ANSWERS[item.qId] === item.answer) {
        score += 1;
      }
    });

    const user = await User.findOne({ firebaseId: req.user.uid });
    if (user) {
      user.quizResults.push({
        score,
        total: Object.keys(QUIZ_ANSWERS).length,
        completedAt: new Date()
      });
      await user.save();
    }

    res.json({ score, total: Object.keys(QUIZ_ANSWERS).length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update journey progress
router.post('/update', auth, async (req, res) => {
  const { stepId, completed } = req.body;
  try {
    let user = await User.findOne({ firebaseId: req.user.uid });
    if (!user) {
      // Create user if not exists (sync with firebase)
      user = new User({
        firebaseId: req.user.uid,
        email: req.user.email,
        displayName: req.user.name,
        photoURL: req.user.picture
      });
    }

    const stepIndex = user.journeyProgress.findIndex(s => s.stepId === stepId);
    if (stepIndex > -1) {
      user.journeyProgress[stepIndex].completed = completed;
      user.journeyProgress[stepIndex].completedAt = new Date();
    } else {
      user.journeyProgress.push({ stepId, completed, completedAt: new Date() });
    }

    await user.save();
    res.json(user.journeyProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
