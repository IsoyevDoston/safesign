const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

console.log('🔐 Loading Authentication Routes...');

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

/**
 * Validates email format using comprehensive regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (max 128 characters)' };
  }
  
  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one letter and one number' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validates name format
 * @param {string} name - Name to validate
 * @returns {object} - Validation result
 */
const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Name is required' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, message: 'Name cannot exceed 50 characters' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-ZА-Яа-я\s\-']+$/.test(trimmedName)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, message: 'Name is valid' };
};

/**
 * Generates a secure JWT token for user
 * @param {string} userId - User ID to encode in token
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(
    { 
      userId,
      iat: Math.floor(Date.now() / 1000),
      type: 'access'
    }, 
    process.env.JWT_SECRET,
    { 
      expiresIn: '7d',
      issuer: 'safesign-api',
      audience: 'safesign-app'
    }
  );
};

/**
 * Sanitizes user data for API responses (removes sensitive fields)
 * @param {object} user - User object from database
 * @returns {object} - Sanitized user object
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  
  delete userObj.password;
  delete userObj.__v;
  delete userObj.emailVerificationToken;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  
  return {
    id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    role: userObj.role,
    subscriptionPlan: userObj.subscriptionPlan,
    documentsAnalyzed: userObj.documentsAnalyzed,
    monthlyLimit: userObj.monthlyLimit,
    isEmailVerified: userObj.isEmailVerified,
    isActive: userObj.isActive,
    createdAt: userObj.createdAt,
    lastLogin: userObj.lastLogin
  };
};

// ===========================================
// USER REGISTRATION ENDPOINT
// ===========================================

/**
 * POST /api/auth/register
 * Registers a new user with complete validation
 */
router.post('/register', async (req, res) => {
  console.log('📝 Registration attempt:', { 
    email: req.body?.email,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  try {
    const { name, email, password } = req.body;

    // ===========================================
    // INPUT VALIDATION
    // ===========================================

    // Check if all required fields are provided
    if (!name || !email || !password) {
      console.log('❌ Registration failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        code: 'MISSING_FIELDS',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      console.log('❌ Registration failed: Invalid name:', nameValidation.message);
      return res.status(400).json({
        success: false,
        message: nameValidation.message,
        code: 'INVALID_NAME'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.log('❌ Registration failed: Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.log('❌ Registration failed: Invalid password:', passwordValidation.message);
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
        code: 'INVALID_PASSWORD'
      });
    }

    // ===========================================
    // DATABASE OPERATIONS
    // ===========================================

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingUser) {
      console.log('❌ Registration failed: User already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password with high security
    console.log('🔐 Hashing password...');
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    console.log('👤 Creating new user...');
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      subscriptionPlan: 'free',
      monthlyLimit: 3,
      documentsAnalyzed: 0,
      isEmailVerified: false, // In production, you'd send verification email
      isActive: true
    });

    // Save user to database
    const savedUser = await newUser.save();
    console.log('✅ User created successfully:', savedUser.email);

    // Generate JWT token
    const token = generateToken(savedUser._id);

    // Prepare response
    const responseData = {
      success: true,
      message: 'Account created successfully! Welcome to SafeSign.',
      token,
      user: sanitizeUser(savedUser)
    };

    console.log('🎉 Registration successful:', savedUser.email);
    res.status(201).json(responseData);

  } catch (error) {
    console.error('💥 Registration error:', error);

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        code: 'DUPLICATE_EMAIL'
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// ===========================================
// USER LOGIN ENDPOINT
// ===========================================

/**
 * POST /api/auth/login
 * Authenticates user with email and password
 */
router.post('/login', async (req, res) => {
  console.log('🔑 Login attempt:', { 
    email: req.body?.email,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  try {
    const { email, password } = req.body;

    // ===========================================
    // INPUT VALIDATION
    // ===========================================

    if (!email || !password) {
      console.log('❌ Login failed: Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    if (!isValidEmail(email)) {
      console.log('❌ Login failed: Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    // ===========================================
    // USER AUTHENTICATION
    // ===========================================

    // Find user by email (include password for verification)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');

    if (!user) {
      console.log('❌ Login failed: User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('❌ Login failed: Account deactivated:', email);
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // ===========================================
    // SUCCESSFUL LOGIN
    // ===========================================

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Prepare response
    const responseData = {
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitizeUser(user)
    };

    console.log('✅ Login successful:', user.email);
    res.json(responseData);

  } catch (error) {
    console.error('💥 Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
      code: 'LOGIN_ERROR'
    });
  }
});

// ===========================================
// GET USER PROFILE ENDPOINT
// ===========================================

/**
 * GET /api/auth/profile
 * Gets current user's profile (requires authentication)
 */
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('👤 Profile request from user:', req.user._id);

    // Get fresh user data from database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('💥 Profile fetch error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// ===========================================
// UPDATE USER PROFILE ENDPOINT
// ===========================================

/**
 * PUT /api/auth/profile
 * Updates user profile information
 */
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('✏️  Profile update request from user:', req.user._id);

    const { name } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Validate and update name if provided
    if (name !== undefined) {
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: nameValidation.message,
          code: 'INVALID_NAME'
        });
      }
      user.name = name.trim();
    }

    await user.save();
    console.log('✅ Profile updated successfully:', user.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('💥 Profile update error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      code: 'UPDATE_ERROR'
    });
  }
});

// ===========================================
// TOKEN VERIFICATION ENDPOINT
// ===========================================

/**
 * GET /api/auth/verify
 * Verifies if the current token is valid
 */
router.get('/verify', auth, (req, res) => {
  console.log('🔍 Token verification for user:', req.user._id);

  res.json({
    success: true,
    message: 'Token is valid',
    user: sanitizeUser(req.user)
  });
});

// ===========================================
// LOGOUT ENDPOINT (Optional - for token blacklisting)
// ===========================================

/**
 * POST /api/auth/logout
 * Logs out user (client should delete token)
 */
router.post('/logout', auth, (req, res) => {
  console.log('👋 User logout:', req.user._id);

  // In a more advanced implementation, you would blacklist the token
  // For now, we rely on client-side token removal

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

console.log('✅ Authentication routes loaded successfully');

module.exports = router;
