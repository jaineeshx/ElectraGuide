const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock Calendar Sync endpoint
router.post('/sync', auth, async (req, res) => {
  const { eventTitle, eventDate } = req.body;
  
  // Simulate logic
  try {
    console.log(`Faking Calendar Sync for: ${eventTitle} on ${eventDate}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.json({ 
      success: true, 
      message: 'Successfully synced with Google Calendar',
      calendarLink: 'https://calendar.google.com/calendar/u/0/r/eventedit',
      eventId: Math.random().toString(36).substring(7)
    });
  } catch (error) {
    res.status(500).json({ message: 'Calendar sync failed' });
  }
});

module.exports = router;
