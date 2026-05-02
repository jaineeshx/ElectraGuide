const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simple in-memory lock for idempotency
const activeSyncs = new Set();

// Mock Calendar Sync endpoint
router.post('/sync', auth, async (req, res) => {
  const { eventTitle, eventDate } = req.body;
  const userId = req.user.uid;

  if (activeSyncs.has(userId)) {
    return res.status(409).json({ message: 'Sync already in progress' });
  }

  activeSyncs.add(userId);
  
  try {
    console.log(`Faking Calendar Sync for user ${userId}: ${eventTitle} on ${eventDate}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.json({ 
      success: true, 
      message: 'Successfully synced with Google Calendar',
      calendarLink: 'https://calendar.google.com/calendar/u/0/r/eventedit',
      eventId: Math.random().toString(36).substring(7)
    });
  } catch (error) {
    res.status(500).json({ message: 'Calendar sync failed' });
  } finally {
    activeSyncs.delete(userId);
  }
});

module.exports = router;
