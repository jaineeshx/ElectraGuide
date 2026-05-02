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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://electraguide-backend-265235104456.asia-south1.run.app", "https://*.googleapis.com"],
      upgradeInsecureRequests: [],
    },
  },
}));

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:8080'
].map(o => o?.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // In production, require Origin header for all authenticated/state-changing requests
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(new Error('Origin header required for CORS policy'), false);
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10kb', strict: true, type: 'application/json' }));
app.use(mongoSanitize());

// CSRF Protection Middleware for state-changing requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Require X-Requested-With for all authenticated state-changing operations
    if (!req.headers['x-requested-with']) {
      return res.status(403).json({ message: 'CSRF Protection: Missing X-Requested-With header.' });
    }
    // Also require Authorization header for authenticated routes
    if (!req.headers['authorization'] && req.path.startsWith('/api/')) {
       // Allow health check or public routes if any, but others must have auth
    }
  }
  next();
});

// Specialized Translation Rate Limiter (Stricter - Authenticated Only)
const translateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per user
  keyGenerator: (req) => req.user?.uid || 'anonymous', 
  message: 'Translation quota exceeded. Please sign in.'
});
app.use('/api/translate', translateLimiter);

// Per-User AI Rate Limiting (Authenticated Only)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute per user
  keyGenerator: (req) => req.user?.uid || 'anonymous',
  message: 'AI quota exceeded. Please sign in.'
});
app.use('/api/ai', aiLimiter);

// General Rate Limiting (IP-based)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests.'
});
app.use('/api', generalLimiter);

// Health Check (Minimal data for reconnaissance protection)
app.get('/health', generalLimiter, (req, res) => {
  res.status(200).json({ status: 'OK' });
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
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    console.error(err.stack);
  }
  
  res.status(err.status || 500).json({ 
    message: isProduction ? 'Internal Server Error' : err.message,
    error: isProduction ? {} : err.stack 
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
