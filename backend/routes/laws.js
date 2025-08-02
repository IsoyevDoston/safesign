const express = require('express');
const Law = require('../models/Law');
const OpenAI = require('openai');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

console.log('📚 Loading Legal Database Routes...');

// ===========================================
// OPENAI CONFIGURATION
// ===========================================

let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here') {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000,
      maxRetries: 3
    });
    console.log('✅ OpenAI client initialized for legal database');
  } catch (error) {
    console.error('❌ OpenAI initialization failed:', error.message);
  }
} else {
  console.log('⚠️  OpenAI API key not configured - using mock explanations');
}

// ===========================================
// SEARCH VALIDATION FUNCTIONS
// ===========================================

/**
 * Validate search query
 * @param {string} query - Search query to validate
 * @returns {object} - Validation result
 */
function validateSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return { isValid: false, message: 'Search query is required' };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length < 2) {
    return { isValid: false, message: 'Search query too short (minimum 2 characters)' };
  }
  
  if (trimmedQuery.length > 200) {
    return { isValid: false, message: 'Search query too long (maximum 200 characters)' };
  }
  
  // Check for valid characters (letters, numbers, spaces, basic punctuation)
  if (!/^[a-zA-ZА-Яа-я0-9\s\-.,!?()]+$/.test(trimmedQuery)) {
    return { isValid: false, message: 'Search query contains invalid characters' };
  }
  
  return { isValid: true, message: 'Query is valid' };
}

/**
 * Build search filters from query parameters
 * @param {object} queryParams - Request query parameters
 * @returns {object} - Processed filters
 */
function buildSearchFilters(queryParams) {
  const filters = {};
  
  // Country filter (default to Uzbekistan)
  filters.country = queryParams.country || 'Uzbekistan';
  
  // Category filter
  if (queryParams.category) {
    const validCategories = ['civil', 'criminal', 'commercial', 'labor', 'tax', 'administrative', 'constitutional'];
    if (validCategories.includes(queryParams.category)) {
      filters.category = queryParams.category;
    }
  }
  
  // Language filter
  if (queryParams.language) {
    const validLanguages = ['uzbek', 'russian', 'english'];
    if (validLanguages.includes(queryParams.language)) {
      filters.language = queryParams.language;
    }
  }
  
  // Active laws only
  filters.isActive = true;
  
  return filters;
}

// ===========================================
// AI EXPLANATION FUNCTIONS
// ===========================================

/**
 * Generate AI explanation for a law using OpenAI
 * @param {object} law - Law document from database
 * @returns {Promise<string>} - AI-generated explanation
 */
async function generateAILawExplanation(law) {
  console.log('🤖 Generating AI explanation for law:', law.articleNumber);

  if (!openai) {
    console.log('⚠️  OpenAI not available, using mock explanation');
    return generateMockExplanation(law);
  }

  try {
    const explanationPrompt = `Как эксперт по праву Узбекистана, объясните следующий закон простым и понятным языком:

Название: ${law.title}
Статья: ${law.articleNumber}
Категория: ${law.category}
Содержание: ${law.content}

Пожалуйста, предоставьте объяснение в следующем формате:

## Простое объяснение

**Что означает этот закон:**
[Краткое объяснение сути закона]

**Кому это применяется:**
[Кто должен соблюдать этот закон]

**Ключевые требования:**
- [Основное требование 1]
- [Основное требование 2]
- [Основное требование 3]

**Практические примеры:**
[1-2 конкретных примера применения]

**Что будет при нарушении:**
[Возможные последствия нарушения]

**Связанные законы:**
[Упомянуть связанные нормы, если есть]

Используйте простой русский язык, избегайте сложной юридической терминологии.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Вы - эксперт по праву Узбекистана. Объясняйте законы простым, понятным языком для обычных граждан и предпринимателей."
        },
        {
          role: "user",
          content: explanationPrompt
        }
      ],
      max_tokens: 1200,
      temperature: 0.4
    });

    const explanation = completion.choices[0].message.content;
    console.log('✅ AI law explanation generated');
    return explanation;

  } catch (error) {
    console.error('❌ OpenAI law explanation failed:', error.message);
    console.log('🔄 Falling back to mock explanation');
    return generateMockExplanation(law);
  }
}

/**
 * Generate mock explanation for testing
 * @param {object} law - Law document
 * @returns {string} - Mock explanation
 */
function generateMockExplanation(law) {
  console.log('🎭 Generating mock explanation for:', law.articleNumber);

  const categoryNames = {
    'civil': 'гражданском праве',
    'criminal': 'уголовном праве',
    'commercial': 'коммерческом праве',
    'labor': 'трудовом праве',
    'tax': 'налоговом праве',
    'administrative': 'административном праве',
    'constitutional': 'конституционном праве'
  };

  const explanation = `## Простое объяснение закона "${law.title}"

**Что означает этот закон:**
${law.summary}

**Основное содержание:**
${law.content}

**Кому это применяется:**
Данный закон относится к ${categoryNames[law.category] || 'правовым отношениям'} и распространяется на всех граждан и организации Республики Узбекистан.

**Ключевые требования:**
- Соблюдение установленных законом норм и процедур
- Выполнение обязательств в соответствии с требованиями закона
- Ответственность за нарушения согласно действующему законодательству

**Практические примеры:**
Этот закон применяется в ситуациях, связанных с: ${law.keywords.slice(0, 3).join(', ')}.

**Что будет при нарушении:**
Нарушение данного закона может повлечь административную, гражданскую или иную ответственность в соответствии с законодательством Республики Узбекистан.

**Важно помнить:**
Данное объяснение носит информационный характер. Для решения конкретных правовых вопросов обратитесь к квалифицированному юристу.

**Дата вступления в силу:** ${law.effectiveDate ? new Date(law.effectiveDate).toLocaleDateString('ru-RU') : 'Информация не указана'}`;

  return explanation;
}

// ===========================================
// ROUTES
// ===========================================

/**
 * GET /api/laws/search
 * Search laws in the database
 */
router.get('/search', optionalAuth, async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log(`🔍 Law search request: "${req.query.query}"`);

    const { query } = req.query;
    
    // ===========================================
    // INPUT VALIDATION
    // ===========================================
    
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      console.log('❌ Invalid search query:', validation.message);
      return res.status(400).json({
        success: false,
        message: validation.message,
        code: 'INVALID_QUERY'
      });
    }

    // ===========================================
    // BUILD SEARCH FILTERS
    // ===========================================
    
    const filters = buildSearchFilters(req.query);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    console.log('🔍 Search filters:', filters);

    // ===========================================
    // PERFORM SEARCH
    // ===========================================
    
    let searchResults;
    let total = 0;

    try {
      // Build MongoDB search query
      const searchQuery = {
        ...filters,
        $text: { $search: query.trim() }
      };

      // Execute search with text scoring
      searchResults = await Law.find(
        searchQuery,
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit);

      // Get total count for pagination
      total = await Law.countDocuments(searchQuery);

      console.log(`✅ Found ${total} laws matching "${query}"`);

    } catch (searchError) {
      console.error('❌ Database search error:', searchError.message);
      
      // Fallback to partial text search if full-text search fails
      const fallbackQuery = {
        ...filters,
        $or: [
          { title: { $regex: query.trim(), $options: 'i' } },
          { content: { $regex: query.trim(), $options: 'i' } },
          { keywords: { $in: [new RegExp(query.trim(), 'i')] } }
        ]
      };

      searchResults = await Law.find(fallbackQuery)
        .sort({ viewCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      total = await Law.countDocuments(fallbackQuery);
      console.log(`✅ Fallback search found ${total} laws`);
    }

    // ===========================================
    // INCREMENT SEARCH COUNTS
    // ===========================================
    
    if (searchResults.length > 0) {
      const lawIds = searchResults.map(law => law._id);
      await Law.updateMany(
        { _id: { $in: lawIds } },
        { $inc: { searchCount: 1 } }
      );
    }

    // ===========================================
    // PREPARE RESPONSE
    // ===========================================
    
    const processingTime = Date.now() - startTime;
    
    const response = {
      success: true,
      query: query.trim(),
      filters: {
        category: filters.category || 'all',
        country: filters.country,
        language: filters.language || 'all'
      },
      results: searchResults.map(law => ({
        id: law._id,
        title: law.title,
        category: law.category,
        articleNumber: law.articleNumber,
        summary: law.summary,
        keywords: law.keywords,
        language: law.language,
        viewCount: law.viewCount,
        effectiveDate: law.effectiveDate,
        relevanceScore: law.score || 0
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      processingTime,
      message: total === 0 ? 
        'No laws found matching your search criteria. Try different keywords.' : 
        `Found ${total} law(s) matching your search.`
    };

    res.json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`💥 Law search error (${processingTime}ms):`, error);

    res.status(500).json({
      success: false,
      message: 'An error occurred during law search. Please try again.',
      code: 'SEARCH_ERROR',
      processingTime
    });
  }
});

/**
 * POST /api/laws/explain/:id
 * Get AI explanation for a specific law
 */
router.post('/explain/:id', optionalAuth, async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log(`📖 Law explanation request: ${req.params.id}`);

    // ===========================================
    // FIND LAW
    // ===========================================
    
    const law = await Law.findById(req.params.id);
    
    if (!law || !law.isActive) {
      console.log('❌ Law not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Law not found or not available',
        code: 'LAW_NOT_FOUND'
      });
    }

    // ===========================================
    // INCREMENT VIEW COUNT
    // ===========================================
    
    await law.incrementView();

    // ===========================================
    // GENERATE AI EXPLANATION
    // ===========================================
    
    const explanation = await generateAILawExplanation(law);
    const processingTime = Date.now() - startTime;

    // ===========================================
    // RESPONSE
    // ===========================================
    
    const response = {
      success: true,
      law: {
        id: law._id,
        title: law.title,
        category: law.category,
        articleNumber: law.articleNumber,
        content: law.content,
        summary: law.summary,
        keywords: law.keywords,
        language: law.language,
        country: law.country,
        effectiveDate: law.effectiveDate,
        viewCount: law.viewCount + 1, // Include the increment
        lastUpdated: law.lastUpdated
      },
      explanation,
      processingTime,
      aiModel: openai ? 'gpt-4o-mini' : 'mock-explanation',
      disclaimer: "Данное объяснение предоставлено в информационных целях и не заменяет профессиональную юридическую консультацию. Для решения конкретных правовых вопросов обратитесь к квалифицированному юристу."
    };

    console.log(`✅ Law explanation provided in ${processingTime}ms`);
    res.json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`💥 Law explanation error (${processingTime}ms):`, error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while generating law explanation. Please try again.',
      code: 'EXPLANATION_ERROR',
      processingTime
    });
  }
});

/**
 * GET /api/laws/categories
 * Get all law categories with counts
 */
router.get('/categories', async (req, res) => {
  try {
    console.log('📊 Categories request');

    const pipeline = [
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgViews: { $avg: '$viewCount' },
          totalViews: { $sum: '$viewCount' }
        }
      },
      { $sort: { count: -1 } }
    ];
    
    const categoryCounts = await Law.aggregate(pipeline);
    
    const categoryInfo = {
      'civil': {
        name: 'Гражданское право',
        description: 'Права и обязанности граждан, имущественные отношения'
      },
      'criminal': {
        name: 'Уголовное право',
        description: 'Преступления и наказания, уголовная ответственность'
      },
      'commercial': {
        name: 'Коммерческое право',
        description: 'Предпринимательская деятельность, торговые отношения'
      },
      'labor': {
        name: 'Трудовое право',
        description: 'Трудовые отношения, права работников и работодателей'
      },
      'tax': {
        name: 'Налоговое право',
        description: 'Налоги, сборы, налоговые обязательства'
      },
      'administrative': {
        name: 'Административное право',
        description: 'Государственное управление, административные правонарушения'
      },
      'constitutional': {
        name: 'Конституционное право',
        description: 'Основы государственного строя, права и свободы граждан'
      }
    };
    
    const categories = categoryCounts.map(cat => ({
      id: cat._id,
      name: categoryInfo[cat._id]?.name || cat._id,
      description: categoryInfo[cat._id]?.description || '',
      count: cat.count,
      avgViews: Math.round(cat.avgViews || 0),
      totalViews: cat.totalViews || 0,
      popularity: cat.totalViews > 100 ? 'high' : cat.totalViews > 50 ? 'medium' : 'low'
    }));
    
    const totalLaws = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);
    
    res.json({
      success: true,
      categories,
      summary: {
        totalCategories: categories.length,
        totalLaws,
        mostPopular: categories[0]?.name || 'N/A'
      }
    });

  } catch (error) {
    console.error('💥 Categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving law categories',
      code: 'CATEGORIES_ERROR'
    });
  }
});

/**
 * GET /api/laws/popular
 * Get most popular/viewed laws
 */
router.get('/popular', async (req, res) => {
  try {
    console.log('🔥 Popular laws request');

    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
    const category = req.query.category;
    
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }
    
    const popularLaws = await Law.find(query)
      .sort({ 
        viewCount: -1, 
        searchCount: -1, 
        createdAt: -1 
      })
      .limit(limit)
      .select('title articleNumber category summary viewCount searchCount effectiveDate');
    
    res.json({
      success: true,
      laws: popularLaws.map(law => ({
        id: law._id,
        title: law.title,
        articleNumber: law.articleNumber,
        category: law.category,
        summary: law.summary,
        viewCount: law.viewCount,
        searchCount: law.searchCount,
        effectiveDate: law.effectiveDate,
        popularityScore: (law.viewCount || 0) + (law.searchCount || 0) * 2
      })),
      filters: {
        category: category || 'all',
        limit
      },
      message: `Top ${popularLaws.length} most popular laws`
    });

  } catch (error) {
    console.error('💥 Popular laws error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving popular laws',
      code: 'POPULAR_LAWS_ERROR'
    });
  }
});

/**
 * GET /api/laws/:id
 * Get specific law by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    console.log(`📄 Law details request: ${req.params.id}`);

    const law = await Law.findById(req.params.id);
    
    if (!law || !law.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Law not found',
        code: 'LAW_NOT_FOUND'
      });
    }
    
    // Increment view count
    await law.incrementView();
    
    // Get related laws (same category, different article)
    const relatedLaws = await Law.find({
      category: law.category,
      _id: { $ne: law._id },
      isActive: true
    })
    .sort({ viewCount: -1 })
    .limit(5)
    .select('title articleNumber summary');
    
    res.json({
      success: true,
      law: {
        id: law._id,
        title: law.title,
        category: law.category,
        articleNumber: law.articleNumber,
        content: law.content,
        summary: law.summary,
        keywords: law.keywords,
        language: law.language,
        country: law.country,
        effectiveDate: law.effectiveDate,
        lastUpdated: law.lastUpdated,
        viewCount: law.viewCount + 1,
        searchCount: law.searchCount
      },
      relatedLaws: relatedLaws.map(related => ({
        id: related._id,
        title: related.title,
        articleNumber: related.articleNumber,
        summary: related.summary
      }))
    });

  } catch (error) {
    console.error('💥 Law retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving law details',
      code: 'LAW_RETRIEVAL_ERROR'
    });
  }
});

/**
 * GET /api/laws/category/:category
 * Get laws by category with pagination
 */
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📚 Category laws request: ${category}`);

    const validCategories = ['civil', 'criminal', 'commercial', 'labor', 'tax', 'administrative', 'constitutional'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
        code: 'INVALID_CATEGORY',
        validCategories
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    
    const laws = await Law.find({ 
      category, 
      isActive: true 
    })
    .select('title articleNumber summary keywords viewCount effectiveDate')
    .sort({ viewCount: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Law.countDocuments({ category, isActive: true });
    
    res.json({
      success: true,
      category,
      laws: laws.map(law => ({
        id: law._id,
        title: law.title,
        articleNumber: law.articleNumber,
        summary: law.summary,
        keywords: law.keywords,
        viewCount: law.viewCount,
        effectiveDate: law.effectiveDate
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
    console.error('💥 Category laws error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving laws by category',
      code: 'CATEGORY_LAWS_ERROR'
    });
  }
});

console.log('✅ Legal database routes loaded successfully');

module.exports = router;
