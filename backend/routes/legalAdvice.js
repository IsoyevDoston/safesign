const express = require('express');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');
const router = express.Router();

console.log('⚖️  Loading Legal Advice Routes...');

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
    console.log('✅ OpenAI client initialized for legal advice');
  } catch (error) {
    console.error('❌ OpenAI initialization failed:', error.message);
  }
} else {
  console.log('⚠️  OpenAI API key not configured - using mock responses');
}

// ===========================================
// LEGAL EXPERTISE SYSTEM PROMPT
// ===========================================

const LEGAL_SYSTEM_PROMPT = `You are an expert AI legal advisor specializing in the legal system of Uzbekistan and Central Asia. You have deep knowledge of:

- Uzbekistan Civil Code and Commercial Law
- Labor Law in Uzbekistan
- Tax and Administrative Law
- Corporate law and business registration
- Contract law and negotiations
- Intellectual property rights
- International trade law relevant to Central Asia

Your role is to:
1. Provide accurate, helpful legal information
2. Explain complex legal concepts in simple terms
3. Reference relevant Uzbekistan laws when applicable
4. Suggest practical next steps
5. Always include appropriate disclaimers

IMPORTANT GUIDELINES:
- Always emphasize that your advice is informational only
- Recommend consulting with a qualified lawyer for specific legal matters
- Be sensitive to cultural and business practices in Uzbekistan
- Provide answers in Russian or English as appropriate
- Focus on practical, actionable guidance
- Reference specific laws and articles when possible

DISCLAIMER REQUIREMENT:
Always end responses with: "Данная информация носит справочный характер. Для решения конкретных правовых вопросов обратитесь к квалифицированному юристу."`;

// ===========================================
// MOCK LEGAL RESPONSES DATABASE
// ===========================================

const mockLegalResponses = {
  // Business Registration
  'регистрация': `## Регистрация бизнеса в Узбекистане

**Основные шаги:**

1. **Выбор организационно-правовой формы:**
   - ООО (Общество с ограниченной ответственностью) - наиболее популярная форма
   - ИП (Индивидуальный предприниматель) - для малого бизнеса
   - АО (Акционерное общество) - для крупных проектов

2. **Необходимые документы:**
   - Заявление о государственной регистрации
   - Устав организации
   - Решение о создании
   - Документы об уставном капитале

3. **Процедура:**
   - Подача через my.gov.uz или центры госуслуг
   - Срок: до 3 рабочих дней
   - Стоимость: от 1 до 5 БРВ

4. **После регистрации:**
   - Изготовление печати
   - Открытие банковского счета
   - Постановка на налоговый учет

**Важно:** Минимальный уставный капитал для ООО составляет 100-кратный размер БРВ.`,

  'налоги': `## Налогообложение в Узбекистане

**Основные налоговые режимы:**

1. **Микрофирма:**
   - Оборот до 1 млрд сум в год
   - Единый налоговый платеж: 4% с оборота
   - Освобождение от НДС и подоходного налога

2. **Малое предпринимательство:**
   - Оборот до 3 млрд сум в год  
   - Единый налоговый платеж: 5% с оборота
   - Возможность работы с НДС

3. **Обычное налогообложение:**
   - Подоходный налог: 7.5% (для резидентов)
   - НДС: 12%
   - Социальный налог: 12%

**Льготы для стартапов:**
- Освобождение от налогов на 3 года при соблюдении условий
- Льготное кредитование
- Упрощенная отчетность

**Сроки подачи отчетности:**
- Месячная отчетность: до 15 числа следующего месяца
- Квартальная: до 15 числа месяца, следующего за кварталом`,

  'трудовой договор': `## Трудовой договор в Узбекистане

**Обязательные элементы:**

1. **Стороны договора:**
   - Полные данные работодателя
   - ФИО и паспортные данные работника

2. **Условия труда:**
   - Должность и трудовая функция
   - Место работы
   - Размер заработной платы
   - Режим рабочего времени

3. **Порядок заключения:**
   - Письменная форма (обязательно)
   - В двух экземплярах
   - Подписи обеих сторон
   - Регистрация в трудовой книжке

**Испытательный срок:**
- Не более 3 месяцев для обычных должностей
- До 6 месяцев для руководящих должностей

**Минимальная заработная плата:**
- Устанавливается государством ежегодно
- В 2024 году: 747 000 сум

**Расторжение договора:**
- По соглашению сторон
- По инициативе работника (2 недели уведомления)
- По инициативе работодателя (с соблюдением процедуры)`,

  'интеллектуальная собственность': `## Защита интеллектуальной собственности

**Виды охраняемых объектов:**

1. **Авторские права:**
   - Литературные произведения
   - Программное обеспечение
   - Базы данных
   - Срок охраны: жизнь автора + 70 лет

2. **Патенты:**
   - Изобретения (20 лет)
   - Полезные модели (5 лет)
   - Промышленные образцы (15 лет)

3. **Товарные знаки:**
   - Срок действия: 10 лет с возможностью продления
   - Регистрация в Агентстве интеллектуальной собственности

**Процедура регистрации:**
1. Подача заявки с описанием объекта
2. Экспертиза (6-18 месяцев)
3. Выдача охранного документа
4. Уплата пошлины

**Защита прав:**
- Гражданско-правовая ответственность
- Административная ответственность
- Уголовная ответственность (за грубые нарушения)`,

  'договор': `## Основы договорного права

**Принципы заключения договоров:**

1. **Свобода договора:**
   - Стороны вправе заключить любой договор
   - Условия определяются по соглашению сторон

2. **Обязательные элементы:**
   - Предмет договора
   - Стороны и их реквизиты
   - Права и обязанности
   - Ответственность за нарушение

3. **Существенные условия:**
   - Предмет (что передается/выполняется)
   - Цена (размер оплаты)
   - Сроки исполнения

**Виды договоров:**
- Купли-продажи
- Поставки товаров
- Оказания услуг
- Подряда
- Аренды

**Изменение и расторжение:**
- По соглашению сторон
- В судебном порядке при существенном нарушении
- В одностороннем порядке (если предусмотрено)

**Ответственность:**
- Возмещение убытков
- Неустойка (штраф, пеня)
- Проценты за пользование чужими денежными средствами`,

  'default': `Благодарю за ваш вопрос. Это важная правовая тема.

**Рекомендую:**

1. **Изучить актуальное законодательство** - правовые нормы могут изменяться
2. **Обратиться к специалисту** - квалифицированный юрист поможет с конкретной ситуацией  
3. **Проверить последние изменения** - в законодательстве Узбекистана регулярно происходят обновления

**Полезные ресурсы:**
- Lex.uz - база законов Узбекистана
- My.gov.uz - портал госуслуг
- Центры "Одного окна" для бизнеса

Для получения более детального ответа на ваш конкретный вопрос, пожалуйста, предоставьте дополнительную информацию о вашей ситуации.`
};

// ===========================================
// AI RESPONSE FUNCTIONS
// ===========================================

/**
 * Get legal advice using OpenAI GPT-4
 * @param {string} question - User's legal question
 * @param {string} context - Additional context
 * @returns {Promise<string>} - AI-generated legal advice
 */
async function getLegalAdviceFromAI(question, context = '') {
  console.log('🤖 Generating AI legal advice...');

  if (!openai) {
    console.log('⚠️  OpenAI not available, using mock response');
    return getMockLegalAdvice(question);
  }

  try {
    const userPrompt = `Вопрос: ${question}

${context ? `Дополнительный контекст: ${context}` : ''}

Пожалуйста, предоставьте подробную юридическую консультацию на русском языке.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: LEGAL_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const advice = completion.choices[0].message.content;
    console.log('✅ AI legal advice generated');
    return advice;

  } catch (error) {
    console.error('❌ OpenAI legal advice failed:', error.message);
    console.log('🔄 Falling back to mock response');
    return getMockLegalAdvice(question);
  }
}

/**
 * Generate mock legal advice for testing
 * @param {string} question - User's question
 * @returns {string} - Mock legal advice
 */
function getMockLegalAdvice(question) {
  console.log('🎭 Generating mock legal advice');

  const lowerQuestion = question.toLowerCase();
  
  // Check for specific topics
  if (lowerQuestion.includes('регистрац') || lowerQuestion.includes('ооо') || lowerQuestion.includes('бизнес')) {
    return mockLegalResponses['регистрация'];
  } 
  
  if (lowerQuestion.includes('налог') || lowerQuestion.includes('налогообложен')) {
    return mockLegalResponses['налоги'];
  }
  
  if (lowerQuestion.includes('трудов') || lowerQuestion.includes('работник') || lowerQuestion.includes('зарплат')) {
    return mockLegalResponses['трудовой договор'];
  }
  
  if (lowerQuestion.includes('интеллектуальн') || lowerQuestion.includes('патент') || lowerQuestion.includes('авторск')) {
    return mockLegalResponses['интеллектуальная собственность'];
  }
  
  if (lowerQuestion.includes('договор') || lowerQuestion.includes('контракт')) {
    return mockLegalResponses['договор'];
  }
  
  return mockLegalResponses['default'];
}

/**
 * Validate legal question input
 * @param {string} question - Question to validate
 * @returns {object} - Validation result
 */
function validateLegalQuestion(question) {
  if (!question || typeof question !== 'string') {
    return { isValid: false, message: 'Question is required' };
  }
  
  const trimmedQuestion = question.trim();
  
  if (trimmedQuestion.length < 5) {
    return { isValid: false, message: 'Question is too short (minimum 5 characters)' };
  }
  
  if (trimmedQuestion.length > 2000) {
    return { isValid: false, message: 'Question is too long (maximum 2000 characters)' };
  }
  
  // Check for obvious spam or inappropriate content
  const spamKeywords = ['spam', 'advertisement', 'viagra', 'casino'];
  if (spamKeywords.some(keyword => trimmedQuestion.toLowerCase().includes(keyword))) {
    return { isValid: false, message: 'Question contains inappropriate content' };
  }
  
  return { isValid: true, message: 'Question is valid' };
}

// ===========================================
// ROUTES
// ===========================================

/**
 * POST /api/legal-advice/ask
 * Get AI legal advice for a question
 */
router.post('/ask', auth, async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log(`💬 Legal advice request from: ${req.user.email}`);

    const { question, context } = req.body;
    
    // ===========================================
    // INPUT VALIDATION
    // ===========================================
    
    const validation = validateLegalQuestion(question);
    if (!validation.isValid) {
      console.log('❌ Invalid question:', validation.message);
      return res.status(400).json({
        success: false,
        message: validation.message,
        code: 'INVALID_QUESTION'
      });
    }

    // Validate context if provided
    if (context && typeof context === 'string' && context.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Context is too long (maximum 1000 characters)',
        code: 'CONTEXT_TOO_LONG'
      });
    }

    // ===========================================
    // GENERATE AI RESPONSE
    // ===========================================
    
    const advice = await getLegalAdviceFromAI(question.trim(), context?.trim() || '');
    const processingTime = Date.now() - startTime;

    // ===========================================
    // RESPONSE
    // ===========================================
    
    const response = {
      success: true,
      question: question.trim(),
      advice,
      context: context?.trim() || null,
      timestamp: new Date().toISOString(),
      processingTime,
      aiModel: openai ? 'gpt-4o-mini' : 'mock-response',
      disclaimer: "Данная информация носит справочный характер и не заменяет профессиональную юридическую консультацию. Для решения конкретных правовых вопросов обратитесь к квалифицированному юристу."
    };

    console.log(`✅ Legal advice provided in ${processingTime}ms`);
    res.json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`💥 Legal advice error (${processingTime}ms):`, error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while generating legal advice. Please try again.',
      code: 'ADVICE_ERROR',
      processingTime
    });
  }
});

/**
 * GET /api/legal-advice/topics
 * Get list of common legal topics
 */
router.get('/topics', async (req, res) => {
  try {
    const topics = [
      {
        id: 'business_registration',
        title: 'Регистрация бизнеса',
        description: 'Создание ООО, ИП, выбор организационно-правовой формы',
        examples: [
          'Как зарегистрировать ООО в Узбекистане?',
          'Какие документы нужны для регистрации ИП?',
          'Сколько стоит регистрация бизнеса?'
        ]
      },
      {
        id: 'taxation',
        title: 'Налогообложение',
        description: 'Налоговые режимы, льготы, отчетность',
        examples: [
          'Какие налоги платит малый бизнес?',
          'Что такое статус микрофирмы?',
          'Как получить налоговые льготы?'
        ]
      },
      {
        id: 'labor_law',
        title: 'Трудовое право',
        description: 'Трудовые договоры, права работников, увольнение',
        examples: [
          'Как правильно составить трудовой договор?',
          'Какие права у работника при увольнении?',
          'Сколько длится испытательный срок?'
        ]
      },
      {
        id: 'contracts',
        title: 'Договорное право',
        description: 'Составление, изменение и расторжение договоров',
        examples: [
          'Что должно быть в договоре поставки?',
          'Как расторгнуть договор досрочно?',
          'Какая ответственность за нарушение договора?'
        ]
      },
      {
        id: 'intellectual_property',
        title: 'Интеллектуальная собственность',
        description: 'Патенты, товарные знаки, авторские права',
        examples: [
          'Как зарегистрировать товарный знак?',
          'Сколько действует патент на изобретение?',
          'Как защитить авторские права?'
        ]
      },
      {
        id: 'consumer_protection',
        title: 'Защита прав потребителей',
        description: 'Права покупателей, возврат товаров, жалобы',
        examples: [
          'Как вернуть некачественный товар?',
          'Какие права у потребителя?',
          'Куда жаловаться на нарушения?'
        ]
      }
    ];

    res.json({
      success: true,
      topics,
      totalTopics: topics.length
    });

  } catch (error) {
    console.error('💥 Topics retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving legal topics',
      code: 'TOPICS_ERROR'
    });
  }
});

/**
 * GET /api/legal-advice/quick-questions
 * Get list of quick legal questions for UI
 */
router.get('/quick-questions', async (req, res) => {
  try {
    const quickQuestions = [
      'Как зарегистрировать ООО в Узбекистане?',
      'Какие налоги платит малый бизнес?',
      'Как правильно составить трудовой договор?',
      'Что такое НДС и кто его платит?',
      'Как защитить интеллектуальную собственность?',
      'Какие документы нужны для экспорта товаров?',
      'Как открыть банковский счет для бизнеса?',
      'Какие льготы есть для стартапов?',
      'Как получить лицензию на деятельность?',
      'Что делать при нарушении договора?',
      'Как оформить увольнение сотрудника?',
      'Какая ответственность у директора ООО?'
    ];

    res.json({
      success: true,
      questions: quickQuestions,
      totalQuestions: quickQuestions.length
    });

  } catch (error) {
    console.error('💥 Quick questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving quick questions',
      code: 'QUICK_QUESTIONS_ERROR'
    });
  }
});

/**
 * POST /api/legal-advice/feedback
 * Submit feedback on legal advice quality
 */
router.post('/feedback', auth, async (req, res) => {
  try {
    const { rating, comment, adviceId } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
        code: 'INVALID_RATING'
      });
    }

    // In a full implementation, you would save this to a Feedback collection
    console.log('📝 Legal advice feedback received:', {
      userId: req.user._id,
      rating,
      comment: comment?.substring(0, 100) + '...',
      adviceId,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! It helps us improve our legal advice service.',
      data: {
        rating,
        submitted: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      code: 'FEEDBACK_ERROR'
    });
  }
});

console.log('✅ Legal advice routes loaded successfully');

module.exports = router;
