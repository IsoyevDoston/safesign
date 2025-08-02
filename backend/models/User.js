const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('👤 Loading User Model...');

// ===========================================
// USER SCHEMA DEFINITION
// ===========================================

const userSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(name) {
        // Allow letters, spaces, hyphens, and apostrophes
        return /^[a-zA-ZА-Яа-я\s\-']+$/.test(name);
      },
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },

  // Email (Primary identifier)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // For faster queries
    validate: {
      validator: function(email) {
        // Comprehensive email validation regex
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },

  // Password (will be hashed)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [128, 'Password is too long'],
    select: false, // Don't include password in queries by default
    validate: {
      validator: function(password) {
        // Only validate if password is being set/modified
        if (!this.isModified('password')) return true;
        
        // Check for at least one letter and one number
        return /(?=.*[a-zA-Z])(?=.*\d)/.test(password);
      },
      message: 'Password must contain at least one letter and one number'
    }
  },

  // User Role
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: 'Role must be either user, admin, or moderator'
    },
    default: 'user',
    index: true
  },

  // Subscription Information
  subscriptionPlan: {
    type: String,
    enum: {
      values: ['free', 'basic', 'professional', 'enterprise'],
      message: 'Invalid subscription plan'
    },
    default: 'free',
    index: true
  },

  // Usage Tracking
  documentsAnalyzed: {
    type: Number,
    default: 0,
    min: [0, 'Documents analyzed cannot be negative']
  },

  monthlyLimit: {
    type: Number,
    default: 3,
    min: [1, 'Monthly limit must be at least 1']
  },

  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  // Security and Recovery
  emailVerificationToken: {
    type: String,
    select: false // Don't include in queries
  },

  passwordResetToken: {
    type: String,
    select: false
  },

  passwordResetExpires: {
    type: Date,
    select: false
  },

  // Activity Tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },

  loginAttempts: {
    type: Number,
    default: 0
  },

  lockUntil: {
    type: Date
  },

  // Preferences
  language: {
    type: String,
    enum: ['en', 'uz', 'ru'],
    default: 'ru'
  },

  timezone: {
    type: String,
    default: 'Asia/Tashkent'
  }

}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields when converting to JSON
      delete ret.password;
      delete ret.__v;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      
      // Convert _id to id
      ret.id = ret._id;
      delete ret._id;
      
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// ===========================================
// INDEXES FOR PERFORMANCE
// ===========================================

// Compound indexes for common queries
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ subscriptionPlan: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// ===========================================
// VIRTUAL PROPERTIES
// ===========================================

// Virtual for remaining document analyses
userSchema.virtual('remainingAnalyses').get(function() {
  return Math.max(0, this.monthlyLimit - this.documentsAnalyzed);
});

// Virtual for subscription status
userSchema.virtual('subscriptionStatus').get(function() {
  return {
    plan: this.subscriptionPlan,
    documentsUsed: this.documentsAnalyzed,
    monthlyLimit: this.monthlyLimit,
    remaining: this.remainingAnalyses,
    isLimitReached: this.documentsAnalyzed >= this.monthlyLimit
  };
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ===========================================
// PRE-SAVE MIDDLEWARE
// ===========================================

/**
 * Hash password before saving to database
 * Only hash if password is modified or new
 */
userSchema.pre('save', async function(next) {
  try {
    // Only hash password if it has been modified (or is new)
    if (!this.isModified('password')) {
      console.log('🔐 Password not modified, skipping hash');
      return next();
    }

    console.log('🔐 Hashing password for user:', this.email);

    // Hash password with high security (12 rounds)
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    
    // Replace plain password with hashed version
    this.password = hashedPassword;
    
    console.log('✅ Password hashed successfully');
    next();

  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});

/**
 * Update lastModified timestamp on any change
 */
userSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ===========================================
// INSTANCE METHODS
// ===========================================

/**
 * Compare provided password with hashed password
 * @param {string} candidatePassword - Plain text password to check
 * @returns {Promise<boolean>} - True if password matches
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!candidatePassword) {
      console.log('❌ No password provided for comparison');
      return false;
    }

    if (!this.password) {
      console.log('❌ No stored password hash found');
      return false;
    }

    console.log('🔐 Comparing password for user:', this.email);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    
    console.log('🔐 Password comparison result:', isMatch ? 'MATCH ✅' : 'NO MATCH ❌');
    return isMatch;

  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

/**
 * Check if user can analyze more documents this month
 * @returns {boolean} - True if user has remaining analyses
 */
userSchema.methods.canAnalyzeDocument = function() {
  return this.documentsAnalyzed < this.monthlyLimit;
};

/**
 * Increment document analysis count
 * @returns {Promise<User>} - Updated user document
 */
userSchema.methods.incrementDocumentCount = async function() {
  this.documentsAnalyzed += 1;
  return await this.save();
};

/**
 * Reset monthly document count (for subscription renewal)
 * @returns {Promise<User>} - Updated user document
 */
userSchema.methods.resetMonthlyCount = async function() {
  this.documentsAnalyzed = 0;
  return await this.save();
};

/**
 * Check if account is locked due to failed login attempts
 * @returns {boolean} - True if account is locked
 */
userSchema.methods.isAccountLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

/**
 * Increment failed login attempts and lock account if necessary
 * @returns {Promise<User>} - Updated user document
 */
userSchema.methods.incrementLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return await this.updateOne(updates);
};

/**
 * Reset login attempts after successful login
 * @returns {Promise} - Update result
 */
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

/**
 * Generate password reset token
 * @returns {string} - Password reset token
 */
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// ===========================================
// STATIC METHODS
// ===========================================

/**
 * Find user by email with password included
 * @param {string} email - User email
 * @returns {Promise<User>} - User document with password
 */
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ 
    email: email.toLowerCase().trim(),
    isActive: true 
  }).select('+password');
};

/**
 * Find active users by subscription plan
 * @param {string} plan - Subscription plan name
 * @returns {Promise<User[]>} - Array of users
 */
userSchema.statics.findBySubscriptionPlan = function(plan) {
  return this.find({ 
    subscriptionPlan: plan,
    isActive: true 
  });
};

/**
 * Get usage statistics
 * @returns {Promise<Object>} - Usage statistics
 */
userSchema.statics.getUsageStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$subscriptionPlan',
        count: { $sum: 1 },
        totalDocuments: { $sum: '$documentsAnalyzed' },
        avgDocuments: { $avg: '$documentsAnalyzed' }
      }
    }
  ]);
  
  return stats;
};

// ===========================================
// MODEL COMPILATION
// ===========================================

const User = mongoose.model('User', userSchema);

// Create indexes in the background
User.createIndexes().then(() => {
  console.log('✅ User model indexes created');
}).catch(err => {
  console.error('❌ Error creating User indexes:', err);
});

console.log('✅ User model loaded successfully');

module.exports = User;
