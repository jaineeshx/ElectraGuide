const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    unique: true,
    trim: true,
    immutable: true, // Prevent ID from being changed after creation
    match: [/^[a-zA-Z0-9]{28}$/, 'Invalid Firebase ID format'], // Exact 28-char UID validation
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    immutable: true, // Prevent email from being changed after creation
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  displayName: { type: String, trim: true },
  photoURL: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profile: {
    age: { type: Number, min: 18, max: 120 },
    location: {
      state: String,
      district: String,
      constituency: String,
    },
    isFirstTimeVoter: { type: Boolean, default: false },
    language: { type: String, default: 'en' }
  },
  journeyProgress: [{
    stepId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: Date.now },
  }],
  quizResults: [{
    score: Number,
    total: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  isSyncingCalendar: { type: Boolean, default: false }, // For distributed lock
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
