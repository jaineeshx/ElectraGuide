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

    // Use an atomic update to prevent race conditions (multiple submissions)
    const result = await User.updateOne(
      { 
        firebaseId: req.user.uid,
        'quizResults.0': { $exists: false } // Only if quizResults array is empty
      },
      {
        $push: {
          quizResults: {
            score,
            total: Object.keys(QUIZ_ANSWERS).length,
            completedAt: new Date()
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      // Check if it failed because the user doesn't exist or already has a result
      const userExists = await User.exists({ firebaseId: req.user.uid });
      if (!userExists) return res.status(404).json({ message: 'User not found' });
      return res.status(400).json({ message: 'Quiz already submitted.' });
    }

    res.json({ score, total: Object.keys(QUIZ_ANSWERS).length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logical Step Order
const STEP_ORDER = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];

// Update journey progress
router.post('/update', auth, async (req, res) => {
  const { stepId, completed } = req.body;
  
  // 1. Validate stepId exists in sequence
  const currentStepIndex = STEP_ORDER.indexOf(stepId);
  if (currentStepIndex === -1) {
    return res.status(400).json({ message: 'Invalid step ID' });
  }

  try {
    // 2. Atomic Find and Update with Logical Validation
    const user = await User.findOne({ firebaseId: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User profile not initialized' });
    }

    // 3. Check Prerequisites (Can't skip steps)
    if (currentStepIndex > 0) {
      const prevStepId = STEP_ORDER[currentStepIndex - 1];
      const prevStepCompleted = user.journeyProgress.some(s => s.stepId === prevStepId && s.completed);
      if (!prevStepCompleted) {
        return res.status(400).json({ message: `Prerequisite failed: Complete ${prevStepId} first.` });
      }
    }

    // 4. Atomic Update using $set for specific array element or $push if new
    const stepExists = user.journeyProgress.some(s => s.stepId === stepId);
    
    if (stepExists) {
      await User.updateOne(
        { firebaseId: req.user.uid, 'journeyProgress.stepId': stepId },
        { 
          $set: { 
            'journeyProgress.$.completed': completed,
            'journeyProgress.$.completedAt': new Date()
          } 
        }
      );
    } else {
      await User.updateOne(
        { firebaseId: req.user.uid },
        { 
          $push: { 
            journeyProgress: { stepId, completed, completedAt: new Date() } 
          } 
        }
      );
    }

    const updatedUser = await User.findOne({ firebaseId: req.user.uid });
    res.json(updatedUser.journeyProgress);
  } catch (error) {
    console.error('Journey Update Error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

module.exports = router;
