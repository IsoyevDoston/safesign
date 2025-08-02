const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['civil', 'criminal', 'commercial', 'labor', 'tax', 'administrative', 'constitutional'],
    index: true
  },
  articleNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Uzbekistan',
    index: true
  },
  language: {
    type: String,
    enum: ['uzbek', 'russian', 'english'],
    default: 'russian',
    index: true
  },
  keywords: [{
    type: String,
    index: true
  }],
  relatedLaws: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Law'
  }],
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  searchCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text index for search functionality
lawSchema.index({ 
  title: 'text', 
  content: 'text', 
  keywords: 'text',
  summary: 'text'
}, {
  weights: {
    title: 10,
    summary: 5,
    keywords: 3,
    content: 1
  }
});

// Compound indexes for better query performance
lawSchema.index({ category: 1, country: 1, isActive: 1 });
lawSchema.index({ country: 1, language: 1, isActive: 1 });

// Pre-save middleware to update lastUpdated
lawSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

// Instance method to increment view count
lawSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to increment search count
lawSchema.methods.incrementSearch = function() {
  this.searchCount += 1;
  return this.save();
};

// Static method to find popular laws
lawSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ viewCount: -1, searchCount: -1 })
    .limit(limit);
};

// Static method to search laws
lawSchema.statics.searchLaws = function(query, filters = {}) {
  const searchQuery = { 
    isActive: true,
    $text: { $search: query }
  };
  
  // Add category filter
  if (filters.category) {
    searchQuery.category = filters.category;
  }
  
  // Add country filter
  if (filters.country) {
    searchQuery.country = filters.country;
  }
  
  // Add language filter
  if (filters.language) {
    searchQuery.language = filters.language;
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);
};

module.exports = mongoose.model('Law', lawSchema);
