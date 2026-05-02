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
