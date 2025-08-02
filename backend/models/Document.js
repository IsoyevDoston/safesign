const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'txt']
  },
  fileSize: {
    type: Number,
    required: true,
    max: [10 * 1024 * 1024, 'File size cannot exceed 10MB']
  },
  filePath: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  analysis: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100
    },
    risks: [{
      type: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      description: String,
      suggestion: String,
      location: String,
      confidence: {
        type: Number,
        min: 0,
        max: 1
      }
    }],
    summary: String,
    recommendations: [String],
    processedAt: {
      type: Date,
      default: Date.now
    },
    processingTime: Number, // in milliseconds
    aiModel: {
      type: String,
      default: 'gpt-4'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  errorMessage: String,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ status: 1 });

module.exports = mongoose.model('Document', documentSchema);
