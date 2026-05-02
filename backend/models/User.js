const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: String,
  photoURL: String,
  profile: {
    age: Number,
    location: {
      state: String,
      district: String,
      constituency: String,
    },
    isFirstTimeVoter: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'en',
    }
  },
  journeyProgress: [{
    stepId: String,
    completed: Boolean,
    completedAt: Date,
  }],
  quizScores: [{
    quizId: String,
    score: Number,
    totalQuestions: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
