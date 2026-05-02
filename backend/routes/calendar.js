const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Mock Calendar Sync endpoint
router.post('/sync', auth, async (req, res) => {
  const { eventTitle, eventDate } = req.body;
  const userId = req.user.uid;

  try {
    // Sanitize log input
    const cleanTitle = eventTitle ? eventTitle.substring(0, 100).replace(/[^a-zA-Z0-9\s]/g, '') : 'Election Event';

    // 1. Attempt to acquire distributed lock in DB
    const user = await User.findOneAndUpdate(
      { firebaseId: userId, isSyncingCalendar: false },
      { isSyncingCalendar: true },
      { new: true }
    );

    if (!user) {
      return res.status(409).json({ message: 'Sync already in progress or user not found' });
    }

    console.log(`Calendar Sync: ${cleanTitle} for ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating work
    
    res.json({ 
      success: true, 
      message: 'Successfully synced with Google Calendar',
      calendarLink: 'https://calendar.google.com/calendar/u/0/r/eventedit',
      eventId: Math.random().toString(36).substring(7)
    });
  } catch (error) {
    res.status(500).json({ message: 'Calendar sync failed' });
  } finally {
    // 2. Release lock
    await User.updateOne({ firebaseId: userId }, { isSyncingCalendar: false });
  }
});

module.exports = router;
