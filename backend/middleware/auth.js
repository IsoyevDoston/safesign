const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('🛡️  Loading Authentication Middleware...');

/**
 * Authentication Middleware
 * Validates JWT tokens and loads user data
 * 
 * This middleware:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies the token signature and expiration
 * 3. Loads user data from database
 * 4. Checks if user account is active
 * 5. Attaches user data to request object
 */

const auth = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    console.log(`🔐 Authentication check for ${req.method} ${req.path}`);

    // ===========================================
    // EXTRACT TOKEN FROM HEADER
    // ===========================================
    
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('❌ No Authorization header provided');
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No authentication token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Invalid Authorization header format');
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Invalid token format. Use "Bearer <token>".',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7); // 'Bearer '.length = 7
    
    if (!token || token.length < 10) {
      console.log('❌ Empty or invalid token');
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Invalid token provided.',
        code: 'INVALID_TOKEN'
      });
    }

    // ===========================================
    // VERIFY JWT TOKEN
    // ===========================================

    let decoded;
    try {
      console.log('🔍 Verifying JWT token...');
      
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET environment variable not set');
        throw new Error('Server configuration error');
      }

      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'safesign-api',
        audience: 'safesign-app'
      });

      console.log('✅ JWT token verified successfully');

    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      
      let errorMessage = 'Invalid or expired token';
      let errorCode = 'TOKEN_INVALID';

      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired. Please login again.';
        errorCode = 'TOKEN_EXPIRED';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format';
        errorCode = 'TOKEN_MALFORMED';
      } else if (jwtError.name === 'NotBeforeError') {
        errorMessage = 'Token not active yet';
        errorCode = 'TOKEN_NOT_ACTIVE';
      }

      return res.status(401).json({ 
        success: false,
        message: errorMessage,
        code: errorCode
      });
    }

    // ===========================================
    // VALIDATE TOKEN PAYLOAD
    // ===========================================

    if (!decoded.userId) {
      console.log('❌ Token missing userId');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token payload',
        code: 'INVALID_PAYLOAD'
      });
    }

    // Check token type (if specified)
    if (decoded.type && decoded.type !== 'access') {
      console.log('❌ Invalid token type:', decoded.type);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // ===========================================
    // LOAD USER FROM DATABASE
    // ===========================================

    console.log('👤 Loading user from database:', decoded.userId);
    
    let user;
    try {
      user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('❌ User not found in database:', decoded.userId);
        return res.status(401).json({ 
          success: false,
          message: 'User not found. Token may be invalid.',
          code: 'USER_NOT_FOUND'
        });
      }

    } catch (dbError) {
      console.error('❌ Database error loading user:', dbError);
      return res.status(500).json({ 
        success: false,
        message: 'Database error during authentication',
        code: 'DATABASE_ERROR'
      });
    }

    // ===========================================
    // VALIDATE USER STATUS
    // ===========================================

    // Check if user account is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated:', user.email);
      return res.status(401).json({ 
        success: false,
        message: 'Account has been deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check if account is locked due to failed login attempts
    if (user.isAccountLocked && user.isAccountLocked()) {
      console.log('❌ User account is locked:', user.email);
      return res.status(401).json({ 
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts.',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // ===========================================
    // ATTACH USER TO REQUEST
    // ===========================================

    // Add user data to request object for use in route handlers
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    req.authToken = token;
    req.tokenData = decoded;

    // Add authentication timing for performance monitoring
    req.authTime = Date.now() - startTime;

    console.log(`✅ Authentication successful for ${user.email} (${req.authTime}ms)`);
    
    // Continue to next middleware/route handler
    next();

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`💥 Authentication middleware error (${processingTime}ms):`, error);

    return res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      code: 'AUTH_SERVER_ERROR'
    });
  }
};

/**
 * Admin Authentication Middleware
 * Checks if authenticated user has admin privileges
 * 
 * This middleware must be used AFTER the auth middleware
 * Usage: router.get('/admin-route', auth, adminAuth, handler)
 */
const adminAuth = async (req, res, next) => {
  try {
    console.log('👑 Admin access check for user:', req.user?.email);

    // Check if user data is available (auth middleware must run first)
    if (!req.user) {
      console.log('❌ Admin check failed: No user data found');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      console.log('❌ Admin access denied for:', req.user.email, 'Role:', req.user.role);
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Administrator privileges required.',
        code: 'INSUFFICIENT_PRIVILEGES'
      });
    }

    console.log('✅ Admin access granted for:', req.user.email);
    next();

  } catch (error) {
    console.error('💥 Admin auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error during admin authorization',
      code: 'ADMIN_AUTH_ERROR'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Loads user data if token is provided, but doesn't require authentication
 * 
 * This is useful for endpoints that can work with or without authentication
 * (e.g., public content that shows additional features for logged-in users)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user data
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;
        console.log('✅ Optional auth: User loaded:', user.email);
      } else {
        req.user = null;
        console.log('⚠️  Optional auth: Invalid user or inactive account');
      }
    } catch (error) {
      // Invalid token, continue without user data
      req.user = null;
      console.log('⚠️  Optional auth: Invalid token, continuing without user');
    }

    next();

  } catch (error) {
    console.error('💥 Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

/**
 * Subscription Check Middleware
 * Validates if user has required subscription plan for the feature
 * 
 * Usage: router.post('/premium-feature', auth, requirePlan('professional'), handler)
 */
const requirePlan = (requiredPlan) => {
  const planLevels = {
    'free': 0,
    'basic': 1,
    'professional': 2,
    'enterprise': 3
  };

  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED'
        });
      }

      const userPlanLevel = planLevels[req.user.subscriptionPlan] || 0;
      const requiredPlanLevel = planLevels[requiredPlan] || 0;

      if (userPlanLevel < requiredPlanLevel) {
        console.log(`❌ Subscription check failed: User has ${req.user.subscriptionPlan}, requires ${requiredPlan}`);
        return res.status(403).json({
          success: false,
          message: `This feature requires ${requiredPlan} subscription or higher`,
          code: 'INSUFFICIENT_SUBSCRIPTION',
          currentPlan: req.user.subscriptionPlan,
          requiredPlan: requiredPlan
        });
      }

      console.log(`✅ Subscription check passed: User has ${req.user.subscriptionPlan} plan`);
      next();

    } catch (error) {
      console.error('💥 Subscription check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during subscription validation',
        code: 'SUBSCRIPTION_CHECK_ERROR'
      });
    }
  };
};

console.log('✅ Authentication middleware loaded successfully');

module.exports = { 
  auth, 
  adminAuth, 
  optionalAuth, 
  requirePlan 
};
