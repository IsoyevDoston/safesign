const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

console.log('🚀 Starting SafeSign Backend Server...');

// ===========================================
// SECURITY MIDDLEWARE CONFIGURATION
// ===========================================

// Helmet - Security headers protection
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  }
}));

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
}));

// Rate Limiting - Protect against brute force attacks
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { success: false, message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`⚠️  Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
});

// Different rate limits for different endpoints
const authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts');
const apiLimiter = createRateLimit(15 * 60 * 1000, 100, 'Too many API requests');
const uploadLimiter = createRateLimit(60 * 60 * 1000, 10, 'Too many file uploads');

// ===========================================
// BODY PARSING & STATIC FILES
// ===========================================

app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.log('❌ Invalid JSON received:', e.message);
      throw new Error('Invalid JSON format');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: false
}));

// ===========================================
// REQUEST LOGGING (Development)
// ===========================================

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`📝 ${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
  });
}

// ===========================================
// DATABASE CONNECTION
// ===========================================

const connectDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Connected to database: ${mongoose.connection.name}`);
    
    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Please check your MongoDB Atlas connection string and network access');
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDatabase();

// ===========================================
// HEALTH CHECK ROUTE (Before rate limiting)
// ===========================================

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };

  const healthStatus = {
    success: true,
    status: 'OK', 
    message: 'SafeSign Legal AI API is running perfectly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    database: {
      status: dbStates[dbState],
      name: mongoose.connection.name || 'not connected'
    },
    server: {
      uptime: `${Math.floor(process.uptime())} seconds`,
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
      },
      nodeVersion: process.version
    },
    features: {
      authentication: 'enabled',
      documentProcessing: 'enabled',
      aiIntegration: 'enabled',
      legalDatabase: 'enabled'
    }
  };

  res.json(healthStatus);
});

// ===========================================
// API ROUTES WITH RATE LIMITING
// ===========================================

// Apply rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Apply general rate limiting to other API routes
app.use('/api/documents', uploadLimiter);
app.use('/api', apiLimiter);

// Load route modules with error handling
const loadRoutes = () => {
  try {
    app.use('/api/auth', require('./routes/auth'));
    console.log('✅ Authentication routes loaded');
  } catch (error) {
    console.error('❌ Failed to load auth routes:', error.message);
  }

  try {
    app.use('/api/documents', require('./routes/documents'));
    console.log('✅ Document processing routes loaded');
  } catch (error) {
    console.error('❌ Failed to load document routes:', error.message);
  }

  try {
    app.use('/api/legal-advice', require('./routes/legalAdvice'));
    console.log('✅ Legal advice routes loaded');
  } catch (error) {
    console.error('❌ Failed to load legal advice routes:', error.message);
  }

  try {
    app.use('/api/laws', require('./routes/laws'));
    console.log('✅ Legal database routes loaded');
  } catch (error) {
    console.error('❌ Failed to load laws routes:', error.message);
  }
};

loadRoutes();

// ===========================================
// ROOT ENDPOINT
// ===========================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SafeSign Legal AI Platform API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requires auth)',
        verify: 'GET /api/auth/verify (requires auth)'
      },
      documents: {
        analyze: 'POST /api/documents/analyze (requires auth)',
        history: 'GET /api/documents/history (requires auth)',
        getDocument: 'GET /api/documents/:id (requires auth)'
      },
      legalAdvice: {
        ask: 'POST /api/legal-advice/ask (requires auth)',
        history: 'GET /api/legal-advice/history (requires auth)'
      },
      laws: {
        search: 'GET /api/laws/search',
        explain: 'POST /api/laws/explain/:id',
        categories: 'GET /api/laws/categories',
        popular: 'GET /api/laws/popular'
      }
    },
    status: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured'
    }
  });
});

// ===========================================
// ERROR HANDLING MIDDLEWARE
// ===========================================

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Global Error Handler:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.ip
  });

  // Handle specific error types
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size allowed: 10MB',
      code: 'FILE_TOO_LARGE'
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body',
      code: 'INVALID_JSON'
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      code: 'CORS_ERROR'
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({ 
    success: false,
    message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

// ===========================================
// SERVER STARTUP
// ===========================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ============================================');
  console.log('🚀 SafeSign Legal AI Server Started Successfully!');
  console.log('🎉 ============================================');
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`🤖 OpenAI Integration: ${process.env.OPENAI_API_KEY ? 'ENABLED ✅' : 'DISABLED ❌'}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'CONNECTED ✅' : 'DISCONNECTED ❌'}`);
  console.log('');
  console.log('🎯 Ready for SafeSign Legal AI Platform!');
  console.log('');
});

// ===========================================
// GRACEFUL SHUTDOWN HANDLING
// ===========================================

const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      return process.exit(1);
    }
    
    console.log('✅ HTTP server closed.');
    
    mongoose.connection.close(false, (err) => {
      if (err) {
        console.error('❌ Error during database shutdown:', err);
        return process.exit(1);
      }
      
      console.log('✅ MongoDB connection closed.');
      console.log('👋 SafeSign server shutdown complete.');
      process.exit(0);
    });
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

module.exports = app;
