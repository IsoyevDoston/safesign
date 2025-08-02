const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const OpenAI = require('openai');
const { auth, requirePlan } = require('../middleware/auth');
const Document = require('../models/Document');
const User = require('../models/User');

const router = express.Router();

console.log('📄 Loading Document Processing Routes...');

// ===========================================
// OPENAI CONFIGURATION
// ===========================================

let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000, // 60 seconds timeout
      maxRetries: 3
    });
    console.log('✅ OpenAI client initialized successfully');
  } catch (error) {
    console.error('❌ OpenAI initialization failed:', error.message);
  }
} else {
  console.log('⚠️  OpenAI API key not configured - using mock responses');
}

// ===========================================
// FILE UPLOAD CONFIGURATION
// ===========================================

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Configure multer for secure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create secure filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    
    const filename = `${timestamp}-${randomString}-${sanitizedName}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Allowed file extensions
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      console.log('❌ File rejected: Invalid extension:', fileExtension);
      return cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`));
    }

    // Allowed MIME types
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/octet-stream' // Sometimes files come as octet-stream
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.log('❌ File rejected: Invalid MIME type:', file.mimetype);
      return cb(new Error(`Invalid file format. Detected: ${file.mimetype}`));
    }

    console.log('✅ File accepted for upload');
    cb(null, true);
  }
});

// ===========================================
// TEXT EXTRACTION FUNCTIONS
// ===========================================

/**
 * Extract text from different file types
 * @param {string} filePath - Path to the uploaded file
 * @param {string} originalName - Original filename
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromFile(filePath, originalName) {
  const fileExtension = path.extname(originalName).toLowerCase();
  
  console.log(`📄 Extracting text from ${fileExtension} file: ${originalName}`);

  try {
    if (fileExtension === '.pdf') {
      // Extract text from PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains only images');
      }
      
      console.log(`✅ PDF text extracted: ${data.text.length} characters`);
      return data.text;
      
    } else if (fileExtension === '.txt') {
      // Read plain text file
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (!content || content.trim().length === 0) {
        throw new Error('Text file is empty');
      }
      
      console.log(`✅ Text file read: ${content.length} characters`);
      return content;
      
    } else if (fileExtension === '.doc' || fileExtension === '.docx') {
      // For DOC/DOCX files, we'll use a simple approach for now
      // In production, you might want to use mammoth.js or similar
      console.log('⚠️  DOC/DOCX processing limited - returning placeholder');
      return `Document content from ${originalName}. Full DOC/DOCX support will be available in a future update. Please convert to PDF for full analysis.`;
      
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
    
  } catch (error) {
    console.error('❌ Text extraction failed:', error.message);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}

// ===========================================
// AI ANALYSIS FUNCTIONS
// ===========================================

/**
 * Analyze document content using OpenAI GPT-4
 * @param {string} content - Document text content
 * @param {string} fileName - Original filename
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeDocumentWithAI(content, fileName) {
  console.log('🤖 Starting AI analysis...');

  if (!openai) {
    console.log('⚠️  OpenAI not available, generating mock analysis');
    return generateMockAnalysis(content, fileName);
  }

  try {
    const analysisPrompt = `You are a professional legal AI assistant specializing in contract and document analysis for Uzbekistan and Central Asian legal systems.

Please analyze the following document and provide a comprehensive risk assessment:

DOCUMENT: "${fileName}"
CONTENT: ${content.substring(0, 8000)} ${content.length > 8000 ? '...(truncated)' : ''}

Provide analysis in the following JSON format:
{
  "riskScore": [0-100 integer],
  "risks": [
    {
      "type": "high|medium|low",
      "description": "Brief description of the risk",
      "suggestion": "Specific recommendation to address this risk",
      "location": "Section or clause reference",
      "confidence": [0-1 decimal]
    }
  ],
  "summary": "2-3 sentence summary of the document and overall risk assessment",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "etc."
  ],
  "keyFindings": [
    "Important finding 1",
    "Important finding 2"
  ]
}

Focus on:
- Contract terms and obligations
- Payment and delivery terms
- Liability and risk allocation
- Termination clauses
- Dispute resolution mechanisms
- Compliance with Uzbekistan legal requirements
- Missing or unclear provisions

Provide practical, actionable advice suitable for business users in Uzbekistan.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal AI assistant specializing in contract analysis for Uzbekistan. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const analysisText = completion.choices[0].message.content;
    console.log('🤖 Raw AI response received:', analysisText.substring(0, 200) + '...');

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response JSON:', parseError.message);
      throw new Error('AI response parsing failed');
    }

    // Validate and enhance the response
    const enhancedAnalysis = {
      riskScore: Math.max(0, Math.min(100, analysis.riskScore || 50)),
      risks: Array.isArray(analysis.risks) ? analysis.risks.map(risk => ({
        type: ['high', 'medium', 'low'].includes(risk.type) ? risk.type : 'medium',
        description: risk.description || 'Risk identified',
        suggestion: risk.suggestion || 'Review with legal counsel',
        location: risk.location || 'General',
        confidence: Math.max(0, Math.min(1, risk.confidence || 0.7))
      })) : [],
      summary: analysis.summary || 'Document analysis completed',
      recommendations: Array.isArray(analysis.recommendations) ? 
        analysis.recommendations.slice(0, 6) : 
        ['Review document with legal counsel'],
      keyFindings: Array.isArray(analysis.keyFindings) ? 
        analysis.keyFindings.slice(0, 5) : 
        [],
      processedAt: new Date(),
      processingTime: null, // Will be set by caller
      aiModel: 'gpt-4o-mini',
      metadata: {
        contentLength: content.length,
        wordCount: content.split(/\s+/).length,
        analysisVersion: '1.0'
      }
    };

    console.log('✅ AI analysis completed successfully');
    return enhancedAnalysis;

  } catch (error) {
    console.error('❌ OpenAI analysis failed:', error.message);
    
    // Fall back to mock analysis if AI fails
    console.log('🔄 Falling back to mock analysis');
    return generateMockAnalysis(content, fileName);
  }
}

/**
 * Generate mock analysis for testing or when OpenAI is unavailable
 * @param {string} content - Document content
 * @param {string} fileName - Original filename
 * @returns {Object} - Mock analysis results
 */
function generateMockAnalysis(content, fileName) {
  console.log('🎭 Generating mock analysis for:', fileName);

  const contentLength = content.length;
  const wordCount = content.split(/\s+/).length;
  
  // Generate risk score based on content characteristics
  let riskScore = Math.floor(Math.random() * 60) + 20; // Base risk 20-80
  
  // Risk keywords that increase score
  const riskKeywords = ['штраф', 'ответственность', 'нарушение', 'санкции', 'пеня', 'возмещение', 'penalty', 'liability'];
  const protectiveKeywords = ['гарантия', 'обеспечение', 'страхование', 'защита', 'warranty', 'insurance'];
  
  const riskCount = riskKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  ).length;
  
  const protectiveCount = protectiveKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  ).length;
  
  riskScore += riskCount * 8 - protectiveCount * 5;
  riskScore = Math.min(95, Math.max(15, riskScore));
  
  // Generate risks based on analysis
  const risks = [];
  
  if (riskScore > 70) {
    risks.push({
      type: 'high',
      description: 'Документ содержит потенциально проблемные условия',
      suggestion: 'Обязательная консультация с юристом перед подписанием',
      location: 'Общий анализ',
      confidence: 0.85
    });
  }
  
  if (contentLength < 500) {
    risks.push({
      type: 'medium',
      description: 'Документ содержит недостаточно детальной информации',
      suggestion: 'Добавьте более подробные условия и спецификации',
      location: 'Структура документа',
      confidence: 0.75
    });
  }
  
  if (!content.toLowerCase().includes('дата') && !content.toLowerCase().includes('срок')) {
    risks.push({
      type: 'medium',
      description: 'Отсутствуют четкие временные рамки',
      suggestion: 'Укажите конкретные даты и сроки выполнения',
      location: 'Временные условия',
      confidence: 0.70
    });
  }
  
  if (risks.length === 0) {
    risks.push({
      type: 'low',
      description: 'Документ соответствует базовым требованиям',
      suggestion: 'Проведите финальную проверку юридических аспектов',
      location: 'Общая оценка',
      confidence: 0.80
    });
  }
  
  return {
    riskScore,
    risks,
    summary: `Анализ документа "${fileName}" выявил ${risks.length} области для внимания. Общий уровень риска: ${getRiskLevel(riskScore)}. ${riskScore > 70 ? 'Требуется консультация юриста.' : 'Документ имеет приемлемый уровень риска.'}`,
    recommendations: [
      'Проверьте актуальность ссылок на законодательство Узбекистана',
      'Убедитесь в корректности реквизитов всех сторон',
      'Рассмотрите добавление механизма разрешения споров',
      'Уточните процедуры изменения условий договора'
    ],
    keyFindings: [
      `Документ содержит ${wordCount} слов`,
      `Уровень риска: ${getRiskLevel(riskScore)}`,
      `Обнаружено ${riskCount} потенциальных рисков`
    ],
    processedAt: new Date(),
    processingTime: null,
    aiModel: 'mock-analysis-v1',
    metadata: {
      contentLength,
      wordCount,
      riskKeywordsFound: riskCount,
      protectiveKeywordsFound: protectiveCount,
      analysisVersion: '1.0'
    }
  };
}

function getRiskLevel(score) {
  if (score >= 70) return 'высокий';
  if (score >= 40) return 'средний';
  return 'низкий';
}

// ===========================================
// ROUTES
// ===========================================

/**
 * POST /api/documents/analyze
 * Upload and analyze a document
 */
router.post('/analyze', auth, upload.single('document'), async (req, res) => {
  const startTime = Date.now();
  let filePath = null;
  
  try {
    console.log(`📤 Document analysis request from user: ${req.user.email}`);

    // ===========================================
    // SUBSCRIPTION AND LIMITS CHECK
    // ===========================================
    
    const user = await User.findById(req.user._id);
    
    if (!user.canAnalyzeDocument()) {
      console.log(`❌ Monthly limit exceeded for user: ${user.email}`);
      return res.status(403).json({ 
        success: false,
        message: `Monthly analysis limit exceeded (${user.monthlyLimit} documents). Please upgrade your subscription.`,
        code: 'MONTHLY_LIMIT_EXCEEDED',
        userLimits: {
          plan: user.subscriptionPlan,
          used: user.documentsAnalyzed,
          limit: user.monthlyLimit,
          remaining: user.remainingAnalyses
        }
      });
    }

    // ===========================================
    // FILE VALIDATION
    // ===========================================
    
    const file = req.file;
    if (!file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded. Please select a document to analyze.',
        code: 'NO_FILE_UPLOADED'
      });
    }

    filePath = file.path;
    console.log(`📁 File uploaded: ${file.originalname} (${(file.size / 1024).toFixed(1)}KB)`);

    // ===========================================
    // TEXT EXTRACTION
    // ===========================================
    
    let content;
    try {
      content = await extractTextFromFile(file.path, file.originalname);
    } catch (extractionError) {
      console.error('❌ Text extraction failed:', extractionError.message);
      
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(400).json({
        success: false,
        message: `Could not extract text from file: ${extractionError.message}`,
        code: 'TEXT_EXTRACTION_FAILED'
      });
    }

    if (!content || content.trim().length < 10) {
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Document appears to be empty or contains insufficient text for analysis.',
        code: 'INSUFFICIENT_CONTENT'
      });
    }

    // ===========================================
    // CREATE DOCUMENT RECORD
    // ===========================================
    
    const document = new Document({
      userId: req.user._id,
      fileName: file.filename,
      originalName: file.originalname,
      fileType: path.extname(file.originalname).substring(1).toLowerCase(),
      fileSize: file.size,
      filePath: file.path,
      content: content.substring(0, 50000), // Store first 50k characters
      status: 'processing'
    });

    await document.save();
    console.log(`💾 Document record created: ${document._id}`);

    // ===========================================
    // AI ANALYSIS
    // ===========================================
    
    const analysisStartTime = Date.now();
    
    try {
      const analysis = await analyzeDocumentWithAI(content, file.originalname);
      analysis.processingTime = Date.now() - analysisStartTime;
      
      // Update document with analysis results
      document.analysis = analysis;
      document.status = 'completed';
      await document.save();
      
      // Update user's document count
      await user.incrementDocumentCount();
      
      console.log(`✅ Document analysis completed: ${document._id}`);
      
    } catch (analysisError) {
      console.error('❌ Analysis failed:', analysisError.message);
      
      document.status = 'failed';
      document.errorMessage = analysisError.message;
      await document.save();
      
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(500).json({
        success: false,
        message: 'Document analysis failed. Please try again.',
        code: 'ANALYSIS_FAILED',
        error: analysisError.message
      });
    }

    // ===========================================
    // RESPONSE
    // ===========================================
    
    const totalProcessingTime = Date.now() - startTime;
    const updatedUser = await User.findById(req.user._id);
    
    res.json({
      success: true,
      message: 'Document analyzed successfully!',
      document: {
        id: document._id,
        fileName: document.originalName,
        fileSize: document.fileSize,
        fileType: document.fileType,
        analysis: document.analysis,
        status: document.status,
        createdAt: document.createdAt,
        processingTime: totalProcessingTime
      },
      userLimits: {
        plan: updatedUser.subscriptionPlan,
        used: updatedUser.documentsAnalyzed,
        limit: updatedUser.monthlyLimit,
        remaining: updatedUser.remainingAnalyses
      }
    });

    console.log(`🎉 Analysis completed successfully in ${totalProcessingTime}ms`);

  } catch (error) {
    console.error('💥 Document analysis error:', error);
    
    // Clean up uploaded file on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('🧹 Cleaned up uploaded file after error');
      } catch (cleanupError) {
        console.error('❌ Failed to cleanup file:', cleanupError.message);
      }
    }
    
    res.status(500).json({ 
      success: false,
      message: 'An error occurred during document analysis. Please try again.',
      code: 'ANALYSIS_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/documents/history
 * Get user's document analysis history
 */
router.get('/history', auth, async (req, res) => {
  try {
    console.log(`📋 Document history request from: ${req.user.email}`);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    
    const documents = await Document.find({ 
      userId: req.user._id,
      isDeleted: false
    })
    .select('-content -filePath') // Exclude large/sensitive fields
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Document.countDocuments({
      userId: req.user._id,
      isDeleted: false
    });
    
    res.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc._id,
        fileName: doc.originalName,
        fileSize: doc.fileSize,
        fileType: doc.fileType,
        status: doc.status,
        riskScore: doc.analysis?.riskScore,
        summary: doc.analysis?.summary,
        createdAt: doc.createdAt,
        processingTime: doc.analysis?.processingTime
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('💥 Document history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving document history',
      code: 'HISTORY_ERROR'
    });
  }
});

/**
 * GET /api/documents/:id
 * Get specific document analysis
 */
router.get('/:id', auth, async (req, res) => {
  try {
    console.log(`📄 Document details request: ${req.params.id}`);

    const document = await Document.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isDeleted: false
    }).select('-filePath'); // Exclude file path for security
    
    if (!document) {
      return res.status(404).json({ 
        success: false,
        message: 'Document not found or access denied',
        code: 'DOCUMENT_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      document: {
        id: document._id,
        fileName: document.originalName,
        fileSize: document.fileSize,
        fileType: document.fileType,
        status: document.status,
        analysis: document.analysis,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        errorMessage: document.errorMessage
      }
    });

  } catch (error) {
    console.error('💥 Document retrieval error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving document',
      code: 'DOCUMENT_ERROR'
    });
  }
});

console.log('✅ Document processing routes loaded successfully');

module.exports = router;
