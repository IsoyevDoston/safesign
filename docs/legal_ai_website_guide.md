# AI Legal Platform - Complete Development Guide

## Project Overview
A comprehensive AI-powered legal platform for contract review, legal advice, and law search functionality, specifically designed for Uzbekistan and Central Asia markets.

## Technology Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **File Storage**: Local file system (development)
- **AI Integration**: OpenAI API (GPT-4)
- **Document Processing**: PDF parsing libraries
- **Authentication**: JWT tokens

## Project Structure
```
legal-ai-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── database/
│   └── legal-documents/
└── README.md
```

## Prerequisites
Before starting, ensure you have:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key
- Git

## Step 1: Project Setup

### 1.1 Create Project Directory
```bash
mkdir legal-ai-platform
cd legal-ai-platform
```

### 1.2 Initialize Git Repository
```bash
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "uploads/" >> .gitignore
```

## Step 2: Backend Development

### 2.1 Create Backend Structure
```bash
mkdir backend
cd backend
npm init -y
```

### 2.2 Install Backend Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer pdf-parse docx-parser openai helmet express-rate-limit
npm install -D nodemon
```

### 2.3 Create Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legal-ai-platform
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
```

### 2.4 Server Configuration (server.js)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/legal-advice', require('./routes/legalAdvice'));
app.use('/api/laws', require('./routes/laws'));
app.use('/api/blog', require('./routes/blog'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2.5 Database Models

#### User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'professional', 'enterprise'],
    default: 'free'
  },
  documentsAnalyzed: {
    type: Number,
    default: 0
  },
  monthlyLimit: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Document Model (models/Document.js)
```javascript
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
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
      location: String
    }],
    summary: String,
    recommendations: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
```

#### Law Model (models/Law.js)
```javascript
const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['civil', 'criminal', 'commercial', 'labor', 'tax', 'administrative']
  },
  articleNumber: {
    type: String,
    required: true
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
    default: 'Uzbekistan'
  },
  language: {
    type: String,
    enum: ['uzbek', 'russian', 'english'],
    default: 'uzbek'
  },
  keywords: [String],
  relatedLaws: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Law'
  }]
}, {
  timestamps: true
});

lawSchema.index({ title: 'text', content: 'text', keywords: 'text' });

module.exports = mongoose.model('Law', lawSchema);
```

#### Blog Model (models/Blog.js)
```javascript
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  category: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
```

### 2.6 API Routes

#### Authentication Routes (routes/auth.js)
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Document Analysis Routes (routes/documents.js)
```javascript
const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const Document = require('../models/Document');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upload and analyze document
router.post('/analyze', auth, upload.single('document'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check subscription limits
    if (user.subscriptionPlan === 'free' && user.documentsAnalyzed >= user.monthlyLimit) {
      return res.status(403).json({ 
        message: 'Monthly limit exceeded. Please upgrade your subscription.' 
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from document
    let content = '';
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      content = data.text;
    } else if (file.mimetype === 'text/plain') {
      content = fs.readFileSync(file.path, 'utf8');
    }

    // Create document record
    const document = new Document({
      userId: req.user.userId,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      content: content,
      status: 'processing'
    });

    await document.save();

    // Analyze with AI
    const analysisPrompt = `
    Please analyze this legal document and provide:
    1. Risk assessment score (0-100)
    2. Identify potential risks and issues
    3. Suggest improvements
    4. Provide a summary
    
    Document content:
    ${content}
    
    Please respond in JSON format with the following structure:
    {
      "riskScore": number,
      "risks": [{"type": "high|medium|low", "description": "string", "suggestion": "string", "location": "string"}],
      "summary": "string",
      "recommendations": ["string"]
    }
    `;

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 2000,
        temperature: 0.3
      });

      const analysis = JSON.parse(aiResponse.choices[0].message.content);
      
      // Update document with analysis
      document.analysis = analysis;
      document.status = 'completed';
      await document.save();

      // Update user's document count
      user.documentsAnalyzed += 1;
      await user.save();

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      res.json({
        message: 'Document analyzed successfully',
        document: {
          id: document._id,
          fileName: document.fileName,
          analysis: document.analysis,
          status: document.status
        }
      });

    } catch (aiError) {
      document.status = 'failed';
      await document.save();
      fs.unlinkSync(file.path);
      
      res.status(500).json({ 
        message: 'AI analysis failed', 
        error: aiError.message 
      });
    }

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's documents
router.get('/history', auth, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId })
      .select('-content')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific document
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Legal Advice Routes (routes/legalAdvice.js)
```javascript
const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get legal advice
router.post('/ask', auth, async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const systemPrompt = `You are a legal advisor specializing in Uzbekistan and Central Asian law. 
    Provide helpful, accurate legal guidance while always recommending consultation with a qualified lawyer for specific cases.
    Focus on:
    - Uzbekistan legal framework
    - Central Asian business law
    - Contract law
    - Commercial regulations
    
    Always include disclaimers about seeking professional legal advice.`;

    const userPrompt = `Question: ${question}
    ${context ? `Context: ${context}` : ''}
    
    Please provide legal guidance in a clear, structured format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const advice = response.choices[0].message.content;

    res.json({
      question,
      advice,
      disclaimer: "This is general legal information and should not replace professional legal advice. Please consult with a qualified lawyer for specific legal matters."
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Laws Search Routes (routes/laws.js)
```javascript
const express = require('express');
const Law = require('../models/Law');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Search laws
router.get('/search', async (req, res) => {
  try {
    const { query, category, country = 'Uzbekistan' } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let searchCriteria = {
      country,
      $text: { $search: query }
    };

    if (category) {
      searchCriteria.category = category;
    }

    const laws = await Law.find(searchCriteria)
      .populate('relatedLaws', 'title articleNumber')
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    res.json(laws);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get law explanation
router.post('/explain/:id', async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);
    
    if (!law) {
      return res.status(404).json({ message: 'Law not found' });
    }

    const explanationPrompt = `
    Please provide a clear, simple explanation of this law:
    
    Title: ${law.title}
    Article: ${law.articleNumber}
    Content: ${law.content}
    
    Explain in simple terms:
    1. What this law means
    2. Who it applies to
    3. Key requirements or restrictions
    4. Practical implications
    5. Common scenarios where it applies
    
    Make it understandable for business owners and general public.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: explanationPrompt }],
      max_tokens: 1000,
      temperature: 0.3
    });

    const explanation = response.choices[0].message.content;

    res.json({
      law,
      explanation,
      disclaimer: "This explanation is for informational purposes only. Please consult with a legal professional for specific legal advice."
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Law.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Blog Routes (routes/blog.js)
```javascript
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    
    let query = { published: true };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single blog post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      published: true 
    }).populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const featuredPosts = await Blog.find({ 
      published: true, 
      featured: true 
    })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(3);

    res.json(featuredPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

### 2.7 Middleware

#### Authentication Middleware (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
```

### 2.8 Package.json Scripts
Update your backend package.json scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedDatabase.js"
  }
}
```

## Step 3: Frontend Development

### 3.1 Create React App
```bash
# Go back to root directory
cd ..
npx create-react-app frontend
cd frontend
```

### 3.2 Install Frontend Dependencies
```bash
npm install axios react-router-dom tailwindcss postcss autoprefixer @heroicons/react react-hot-toast
npx tailwindcss init -p
```

### 3.3 Configure Tailwind CSS
Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

### 3.4 Frontend Structure
```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Layout.js
│   │   └── LoadingSpinner.js
│   ├── auth/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── ProtectedRoute.js
│   ├── documents/
│   │   ├── DocumentUpload.js
│   │   ├── DocumentAnalysis.js
│   │   └── DocumentHistory.js
│   ├── legal/
│   │   ├── LegalAdviser.js
│   │   └── LawSearch.js
│   └── blog/
│       ├── BlogList.js
│       └── BlogPost.js
├── pages/
│   ├── Home.js
│   ├── Dashboard.js
│   ├── DocumentReview.js
│   ├── LegalAdvice.js
│   ├── LawSearch.js
│   ├── Blog.js
│   └── About.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── documents.js
├── context/
│   └── AuthContext.js
├── utils/
│   └── constants.js
└── App.js
```

## Step 4: Database Seeding

### 4.1 Create Seed Script (backend/utils/seedDatabase.js)
```javascript
const mongoose = require('mongoose');
const Law = require('../models/Law');
const Blog = require('../models/Blog');
const User = require('../models/User');
require('dotenv').config();

const seedLaws = [
  {
    title: "Гражданский кодекс Республики Узбекистан - Статья 1",
    category: "civil",
    articleNumber: "ГК-1",
    content: "Гражданское законодательство основывается на признании равенства участников регулируемых им отношений, неприкосновенности собственности, свободы договора, недопустимости произвольного вмешательства кого-либо в частные дела.",
    summary: "Основные принципы гражданского права в Узбекистане",
    keywords: ["гражданское право", "равенство", "собственность", "договор"],
    language: "russian"
  },
  {
    title: "Трудовой кодекс - Трудовой договор",
    category: "labor",
    articleNumber: "ТК-77",
    content: "Трудовой договор - соглашение между работодателем и работником, в соответствии с которым работодатель обязуется предоставить работнику работу по обусловленной трудовой функции.",
    summary: "Определение и основы трудового договора",
    keywords: ["трудовой договор", "работодатель", "работник", "трудовая функция"],
    language: "russian"
  },
  {
    title: "Закон о предпринимательстве - Регистрация бизнеса",
    category: "commercial",
    articleNumber: "ЗП-15",
    content: "Государственная регистрация субъектов предпринимательства осуществляется в порядке, установленном законодательством, и является обязательным условием для осуществления предпринимательской деятельности.",
    summary: "Требования к регистрации предпринимательской деятельности",
    keywords: ["предпринимательство", "регистрация", "бизнес", "лицензия"],
    language: "russian"
  }
];

const seedBlogs = [
  {
    title: "Основы договорного права в Узбекистане",
    slug: "osnovy-dogovornogo-prava-uzbekistan",
    content: "Подробное руководство по заключению и исполнению договоров в Узбекистане...",
    excerpt: "Узнайте