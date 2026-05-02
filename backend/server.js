require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:8080'
];

app.use(cors({
  origin: (origin, callback) => {
    // Standardize origins to prevent mismatch
    const currentOrigin = origin ? origin.trim() : '';
    const cleanAllowed = allowedOrigins.map(o => o ? o.trim() : '').filter(o => o !== '');

    console.log('Incoming Origin:', `[${currentOrigin}]`);
    console.log('Clean Allowed Origins:', cleanAllowed);

    if (!origin || cleanAllowed.includes(currentOrigin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked origin:', `[${currentOrigin}]`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// CSRF Protection Middleware for state-changing requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Custom header check as a stateless CSRF protection
    if (!req.headers['x-requested-with'] && !req.headers['authorization']) {
      return res.status(403).json({ message: 'Potential CSRF attack blocked. Missing required headers.' });
    }
  }
  next();
});

// Per-User Rate Limiting (Authenticated users)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute per user
  keyGenerator: (req) => req.user?.uid || req.ip, // Use Firebase UID or fallback to IP
  message: 'AI quota exceeded. Please wait a minute.'
});
app.use('/api/ai', aiLimiter);

// General Rate Limiting (IP-based)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.'
});
app.use('/api', generalLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Database Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/journey', require('./routes/journey'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/calendar', require('./routes/calendar'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
