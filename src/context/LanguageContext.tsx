import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation keys and values
const translations = {
  // Navigation
  'nav.home': {
    uz: 'Bosh sahifa',
    ru: 'Главная',
    en: 'Home'
  },
  'nav.document_review': {
    uz: 'Hujjat tahlili',
    ru: 'Анализ документов',
    en: 'Document Review'
  },
  'nav.legal_advice': {
    uz: 'Yuridik maslahat',
    ru: 'Юридическая консультация',
    en: 'Legal Advice'
  },
  'nav.law_search': {
    uz: 'Qonun qidiruvi',
    ru: 'Поиск законов',
    en: 'Law Search'
  },
  'nav.blog': {
    uz: 'Blog',
    ru: 'Блог',
    en: 'Blog'
  },
  'nav.about': {
    uz: 'Biz haqimizda',
    ru: 'О нас',
    en: 'About'
  },
  'nav.login': {
    uz: 'Kirish',
    ru: 'Войти',
    en: 'Login'
  },
  'nav.register': {
    uz: 'Ro\'yxatdan o\'tish',
    ru: 'Регистрация',
    en: 'Register'
  },
  'nav.dashboard': {
    uz: 'Boshqaruv paneli',
    ru: 'Панель управления',
    en: 'Dashboard'
  },
  'nav.logout': {
    uz: 'Chiqish',
    ru: 'Выйти',
    en: 'Logout'
  },

  // Home page
  'home.hero.title': {
    uz: 'AI-yordamchi yuridik vazifalar uchun',
    ru: 'ИИ-помощник для юридических задач',
    en: 'AI Assistant for Legal Tasks'
  },
  'home.hero.subtitle': {
    uz: 'Shartnomalarni tahlil qiling, yuridik maslahatlar oling va sun\'iy intellekt yordamida qonunlarni o\'rganing. O\'zbekiston va Markaziy Osiyo biznesiga maxsus yaratilgan.',
    ru: 'Анализируйте договоры, получайте юридические консультации и изучайте законы с помощью искусственного интеллекта. Создано специально для бизнеса в Узбекистане и Центральной Азии.',
    en: 'Analyze contracts, get legal advice, and study laws with artificial intelligence. Created specifically for business in Uzbekistan and Central Asia.'
  },
  'home.hero.cta_start': {
    uz: 'Bepul boshlash',
    ru: 'Начать бесплатно',
    en: 'Start Free'
  },
  'home.hero.cta_dashboard': {
    uz: 'Boshqaruv paneliga o\'tish',
    ru: 'Перейти в панель управления',
    en: 'Go to Dashboard'
  },
  'home.features.title': {
    uz: 'Platforma imkoniyatlari',
    ru: 'Возможности платформы',
    en: 'Platform Features'
  },
  'home.features.subtitle': {
    uz: 'Yuridik hujjatlar bilan ishlash uchun barcha vositalar bir joyda',
    ru: 'Все инструменты для работы с юридическими документами в одном месте',
    en: 'All tools for working with legal documents in one place'
  },
  'home.feature.document_analysis.title': {
    uz: 'Hujjat tahlili',
    ru: 'Анализ документов',
    en: 'Document Analysis'
  },
  'home.feature.document_analysis.description': {
    uz: 'AI sizning shartnomalaringizni tahlil qiladi va potentsial xavflarni aniqlaydi',
    ru: 'ИИ анализирует ваши договоры и выявляет потенциальные риски',
    en: 'AI analyzes your contracts and identifies potential risks'
  },
  'home.feature.legal_consultation.title': {
    uz: 'Yuridik maslahat',
    ru: 'Юридическая консультация',
    en: 'Legal Consultation'
  },
  'home.feature.legal_consultation.description': {
    uz: 'O\'zbek huquqiga ixtisoslashgan AI-yuristdan shaxsiy tavsiyalar oling',
    ru: 'Получите персональные рекомендации от ИИ-юриста, специализирующегося на узбекском праве',
    en: 'Get personalized recommendations from an AI lawyer specializing in Uzbek law'
  },
  'home.feature.law_database.title': {
    uz: 'Qonunlar bazasi',
    ru: 'База законов',
    en: 'Law Database'
  },
  'home.feature.law_database.description': {
    uz: 'AI yordamida O\'zbekiston va Markaziy Osiyo qonunlarini qidirish va tushuntirish',
    ru: 'Поиск и разъяснение законов Узбекистана и Центральной Азии с помощью ИИ',
    en: 'Search and explanation of laws of Uzbekistan and Central Asia with AI'
  },

  // Benefits
  'home.benefits.title': {
    uz: 'Nima uchun bizni tanlashadi',
    ru: 'Почему выбирают нас',
    en: 'Why Choose Us'
  },
  'home.benefit.security.title': {
    uz: 'Ma\'lumotlar xavfsizligi',
    ru: 'Безопасность данных',
    en: 'Data Security'
  },
  'home.benefit.security.description': {
    uz: 'Xalqaro maxfiylik standartlariga rioya qilgan holda hujjatlarni himoyalangan qayta ishlash',
    ru: 'Защищенная обработка документов с соблюдением международных стандартов конфиденциальности',
    en: 'Secure document processing in compliance with international privacy standards'
  },
  'home.benefit.speed.title': {
    uz: 'Tezkor natija',
    ru: 'Мгновенный результат',
    en: 'Instant Results'
  },
  'home.benefit.speed.description': {
    uz: 'Yurist kutish o\'rniga soniyalar ichida hujjat tahlili',
    ru: 'Анализ документов за секунды вместо часов ожидания у юриста',
    en: 'Document analysis in seconds instead of hours waiting for a lawyer'
  },
  'home.benefit.expertise.title': {
    uz: 'Mahalliy ekspertiza',
    ru: 'Местная экспертиза',
    en: 'Local Expertise'
  },
  'home.benefit.expertise.description': {
    uz: 'O\'zbekiston va Markaziy Osiyo mamlakatlari qonunchiligiga ixtisoslashuv',
    ru: 'Специализация на законодательстве Узбекистана и стран Центральной Азии',
    en: 'Specialization in the legislation of Uzbekistan and Central Asian countries'
  },

  // CTA
  'home.cta.title': {
    uz: 'Boshlashga tayyormisiz?',
    ru: 'Готовы начать?',
    en: 'Ready to Start?'
  },
  'home.cta.subtitle': {
    uz: 'LegalAI-ni bugun bepul sinab ko\'ring. 3 ta hujjat tahlili majburiyatsiz.',
    ru: 'Попробуйте LegalAI бесплатно уже сегодня. 3 анализа документов без обязательств.',
    en: 'Try LegalAI for free today. 3 document analyses without obligations.'
  },
  'home.cta.button': {
    uz: 'Bepul ro\'yxatdan o\'tish',
    ru: 'Зарегистрироваться бесплатно',
    en: 'Register for Free'
  },

  // Authentication
  'auth.welcome': {
    uz: 'Xush kelibsiz',
    ru: 'Добро пожаловать',
    en: 'Welcome'
  },
  'auth.login_subtitle': {
    uz: 'LegalAI hisobingizga kiring',
    ru: 'Войдите в свой аккаунт LegalAI',
    en: 'Sign in to your LegalAI account'
  },
  'auth.register_title': {
    uz: 'Hisob yaratish',
    ru: 'Создать аккаунт',
    en: 'Create Account'
  },
  'auth.register_subtitle': {
    uz: 'LegalAI-ga qo\'shiling va 3 ta bepul tahlil oling',
    ru: 'Присоединяйтесь к LegalAI и получите 3 бесплатных анализа',
    en: 'Join LegalAI and get 3 free analyses'
  },
  'auth.email': {
    uz: 'Email manzil',
    ru: 'Email адрес',
    en: 'Email Address'
  },
  'auth.password': {
    uz: 'Parol',
    ru: 'Пароль',
    en: 'Password'
  },
  'auth.full_name': {
    uz: 'To\'liq ism',
    ru: 'Полное имя',
    en: 'Full Name'
  },
  'auth.confirm_password': {
    uz: 'Parolni tasdiqlang',
    ru: 'Подтвердите пароль',
    en: 'Confirm Password'
  },
  'auth.remember_me': {
    uz: 'Meni eslab qol',
    ru: 'Запомнить меня',
    en: 'Remember Me'
  },
  'auth.forgot_password': {
    uz: 'Parolni unutdingizmi?',
    ru: 'Забыли пароль?',
    en: 'Forgot Password?'
  },
  'auth.login_button': {
    uz: 'Kirish',
    ru: 'Войти',
    en: 'Sign In'
  },
  'auth.register_button': {
    uz: 'Hisob yaratish',
    ru: 'Создать аккаунт',
    en: 'Create Account'
  },
  'auth.no_account': {
    uz: 'Hisobingiz yo\'qmi?',
    ru: 'Нет аккаунта?',
    en: 'No account?'
  },
  'auth.have_account': {
    uz: 'Hisobingiz bormi?',
    ru: 'Уже есть аккаунт?',
    en: 'Already have an account?'
  },

  // Dashboard
  'dashboard.welcome': {
    uz: 'Xush kelibsiz',
    ru: 'Добро пожаловать',
    en: 'Welcome'
  },
  'dashboard.subtitle': {
    uz: 'Yuridik hujjatlaringizni boshqaring va maslahatlar oling',
    ru: 'Управляйте своими юридическими документами и получайте консультации',
    en: 'Manage your legal documents and get consultations'
  },
  'dashboard.documents_analyzed': {
    uz: 'Tahlil qilingan hujjatlar',
    ru: 'Документов проанализировано',
    en: 'Documents Analyzed'
  },
  'dashboard.remaining_analyses': {
    uz: 'Qolgan tahlillar',
    ru: 'Оставшиеся анализы',
    en: 'Remaining Analyses'
  },
  'dashboard.average_risk': {
    uz: 'O\'rtacha xavf',
    ru: 'Средний риск',
    en: 'Average Risk'
  },
  'dashboard.time_saved': {
    uz: 'Tejangan vaqt',
    ru: 'Время экономии',
    en: 'Time Saved'
  },
  'dashboard.quick_actions': {
    uz: 'Tezkor harakatlar',
    ru: 'Быстрые действия',
    en: 'Quick Actions'
  },
  'dashboard.recent_documents': {
    uz: 'So\'nggi hujjatlar',
    ru: 'Последние документы',
    en: 'Recent Documents'
  },
  'dashboard.all_documents': {
    uz: 'Barcha hujjatlar',
    ru: 'Все документы',
    en: 'All Documents'
  },

  // Document Review
  'document.title': {
    uz: 'AI bilan hujjat tahlili',
    ru: 'Анализ документов с ИИ',
    en: 'Document Analysis with AI'
  },
  'document.subtitle': {
    uz: 'Xavflarni tahlil qilish uchun shartnoma yoki yuridik hujjat yuklang',
    ru: 'Загрузите договор или юридический документ для анализа рисков',
    en: 'Upload a contract or legal document for risk analysis'
  },
  'document.upload_title': {
    uz: 'Hujjat yuklash',
    ru: 'Загрузить документ',
    en: 'Upload Document'
  },
  'document.upload_text': {
    uz: 'Fayl tanlash uchun bosing yoki bu yerga sudrab olib keling',
    ru: 'Нажмите для выбора файла или перетащите сюда',
    en: 'Click to select file or drag and drop here'
  },
  'document.supported_formats': {
    uz: 'PDF, DOC, DOCX, TXT 10MB gacha',
    ru: 'PDF, DOC, DOCX, TXT до 10MB',
    en: 'PDF, DOC, DOCX, TXT up to 10MB'
  },
  'document.analyze_button': {
    uz: 'Hujjatni tahlil qilish',
    ru: 'Анализировать документ',
    en: 'Analyze Document'
  },
  'document.analyzing': {
    uz: 'Hujjat tahlil qilinmoqda...',
    ru: 'Анализируем документ...',
    en: 'Analyzing document...'
  },
  'document.risk_assessment': {
    uz: 'Xavf baholash',
    ru: 'Оценка рисков',
    en: 'Risk Assessment'
  },
  'document.identified_risks': {
    uz: 'Aniqlangan xavflar',
    ru: 'Выявленные риски',
    en: 'Identified Risks'
  },
  'document.recommendations': {
    uz: 'Tavsiyalar',
    ru: 'Рекомендации',
    en: 'Recommendations'
  },
  'document.download_report': {
    uz: 'Hisobotni yuklab olish',
    ru: 'Скачать отчет',
    en: 'Download Report'
  },

  // Legal Advice
  'legal_advice.title': {
    uz: 'AI Yuridik maslahat',
    ru: 'ИИ Юридическая консультация',
    en: 'AI Legal Consultation'
  },
  'legal_advice.subtitle': {
    uz: 'O\'zbekiston va Markaziy Osiyo qonunchiligiga ixtisoslashgan AI-yuristdan shaxsiy tavsiyalar oling',
    ru: 'Получите персональные рекомендации от ИИ-юриста, специализирующегося на законодательстве Узбекистана и Центральной Азии',
    en: 'Get personalized recommendations from an AI lawyer specializing in Uzbekistan and Central Asian legislation'
  },
  'legal_advice.placeholder': {
    uz: 'Yuridik savolingizni bering...',
    ru: 'Задайте ваш правовой вопрос...',
    en: 'Ask your legal question...'
  },
  'legal_advice.popular_questions': {
    uz: 'Mashhur savollar',
    ru: 'Популярные вопросы',
    en: 'Popular Questions'
  },
  'legal_advice.disclaimer_title': {
    uz: 'Muhim ogohlantirish',
    ru: 'Важное уведомление',
    en: 'Important Notice'
  },
  'legal_advice.disclaimer_text': {
    uz: 'Ushbu maslahat ma\'lumot berish xarakteriga ega va professional yuridik yordamni almashtirmaydi. Aniq yuridik masalalarni hal qilish uchun malakali yuristga murojaat qiling.',
    ru: 'Данная консультация носит информационный характер и не заменяет профессиональную юридическую помощь. Для решения конкретных правовых вопросов обратитесь к квалифицированному юристу.',
    en: 'This consultation is for informational purposes and does not replace professional legal assistance. For specific legal issues, consult a qualified lawyer.'
  },

  // Law Search
  'law_search.title': {
    uz: 'O\'zbekiston qonunlar bazasi',
    ru: 'База законов Узбекистана',
    en: 'Uzbekistan Law Database'
  },
  'law_search.subtitle': {
    uz: 'AI yordamida O\'zbekiston qonunchiligini qidirish va o\'rganish. Murakkab huquqiy me\'yorlarning tushunarli tushuntirishlarini oling.',
    ru: 'Поиск и изучение законодательства Узбекистана с помощью ИИ. Получите понятные объяснения сложных правовых норм.',
    en: 'Search and study Uzbekistan legislation with AI. Get clear explanations of complex legal norms.'
  },
  'law_search.search_placeholder': {
    uz: 'Qonunlar, moddalar, kalit so\'zlar bo\'yicha qidirish...',
    ru: 'Поиск по законам, статьям, ключевым словам...',
    en: 'Search by laws, articles, keywords...'
  },
  'law_search.all_categories': {
    uz: 'Barcha toifalar',
    ru: 'Все категории',
    en: 'All Categories'
  },
  'law_search.found_results': {
    uz: 'Topildi',
    ru: 'Найдено',
    en: 'Found'
  },
  'law_search.results': {
    uz: 'natija',
    ru: 'результатов',
    en: 'results'
  },
  'law_search.read_full': {
    uz: 'To\'liq o\'qish',
    ru: 'Читать полностью',
    en: 'Read Full'
  },
  'law_search.explain_ai': {
    uz: 'AI bilan tushuntirish',
    ru: 'Объяснить ИИ',
    en: 'Explain with AI'
  },

  // Blog
  'blog.title': {
    uz: 'LegalAI huquqiy blogi',
    ru: 'Правовой блог LegalAI',
    en: 'LegalAI Legal Blog'
  },
  'blog.subtitle': {
    uz: 'Huquq, biznes va texnologiyalar bo\'yicha ekspert maqolalari. O\'zbekiston va Markaziy Osiyo qonunchiligi haqida dolzarb ma\'lumotlar.',
    ru: 'Экспертные статьи о праве, бизнесе и технологиях. Актуальная информация о законодательстве Узбекистана и Центральной Азии.',
    en: 'Expert articles on law, business and technology. Current information about the legislation of Uzbekistan and Central Asia.'
  },
  'blog.featured_articles': {
    uz: 'Tavsiya etilgan maqolalar',
    ru: 'Рекомендуемые статьи',
    en: 'Featured Articles'
  },
  'blog.popular_articles': {
    uz: 'Mashhur maqolalar',
    ru: 'Популярные статьи',
    en: 'Popular Articles'
  },
  'blog.read_more': {
    uz: 'Batafsil o\'qish',
    ru: 'Читать далее',
    en: 'Read More'
  },
  'blog.search_placeholder': {
    uz: 'Maqolalarni qidirish...',
    ru: 'Поиск статей...',
    en: 'Search articles...'
  },

  // About
  'about.title': {
    uz: 'LegalAI platformasi haqida',
    ru: 'О платформе LegalAI',
    en: 'About LegalAI Platform'
  },
  'about.subtitle': {
    uz: 'Biz yuridik xizmatlarning kelajagini yaratmoqdamiz, ilg\'or sun\'iy intellekt texnologiyalarini O\'zbekiston huquqidagi chuqur ekspertiza bilan birlashtiramiz',
    ru: 'Мы создаем будущее юридических услуг, объединяя передовые технологии искусственного интеллекта с глубокой экспертизой в области права Узбекистана',
    en: 'We are creating the future of legal services by combining advanced artificial intelligence technologies with deep expertise in Uzbekistan law'
  },
  'about.our_mission': {
    uz: 'Bizning missiyamiz',
    ru: 'Наша миссия',
    en: 'Our Mission'
  },
  'about.our_vision': {
    uz: 'Bizning ko\'rish',
    ru: 'Наше видение',
    en: 'Our Vision'
  },
  'about.our_values': {
    uz: 'Bizning qadriyatlarimiz',
    ru: 'Наши ценности',
    en: 'Our Values'
  },
  'about.our_team': {
    uz: 'Bizning jamoa',
    ru: 'Наша команда',
    en: 'Our Team'
  },
  'about.contact_us': {
    uz: 'Biz bilan bog\'laning',
    ru: 'Свяжитесь с нами',
    en: 'Contact Us'
  },

  // Common
  'common.loading': {
    uz: 'Yuklanmoqda...',
    ru: 'Загрузка...',
    en: 'Loading...'
  },
  'common.error': {
    uz: 'Xatolik',
    ru: 'Ошибка',
    en: 'Error'
  },
  'common.success': {
    uz: 'Muvaffaqiyat',
    ru: 'Успех',
    en: 'Success'
  },
  'common.cancel': {
    uz: 'Bekor qilish',
    ru: 'Отмена',
    en: 'Cancel'
  },
  'common.save': {
    uz: 'Saqlash',
    ru: 'Сохранить',
    en: 'Save'
  },
  'common.delete': {
    uz: 'O\'chirish',
    ru: 'Удалить',
    en: 'Delete'
  },
  'common.edit': {
    uz: 'Tahrirlash',
    ru: 'Редактировать',
    en: 'Edit'
  },
  'common.view': {
    uz: 'Ko\'rish',
    ru: 'Просмотр',
    en: 'View'
  },
  'common.search': {
    uz: 'Qidirish',
    ru: 'Поиск',
    en: 'Search'
  },
  'common.filter': {
    uz: 'Filtr',
    ru: 'Фильтр',
    en: 'Filter'
  },
  'common.sort': {
    uz: 'Saralash',
    ru: 'Сортировка',
    en: 'Sort'
  },
  'common.next': {
    uz: 'Keyingi',
    ru: 'Следующий',
    en: 'Next'
  },
  'common.previous': {
    uz: 'Oldingi',
    ru: 'Предыдущий',
    en: 'Previous'
  },
  'common.close': {
    uz: 'Yopish',
    ru: 'Закрыть',
    en: 'Close'
  },
  'common.start': {
    uz: 'Boshlash',
    ru: 'Начать',
    en: 'Start'
  },
  'common.free': {
    uz: 'bepul',
    ru: 'бесплатно',
    en: 'free'
  },
  'common.no_obligations': {
    uz: 'majburiyatsiz',
    ru: 'без обязательств',
    en: 'no obligations'
  },

  // Risk levels
  'risk.high': {
    uz: 'Yuqori xavf',
    ru: 'Высокий риск',
    en: 'High Risk'
  },
  'risk.medium': {
    uz: 'O\'rta xavf',
    ru: 'Средний риск',
    en: 'Medium Risk'
  },
  'risk.low': {
    uz: 'Past xavf',
    ru: 'Низкий риск',
    en: 'Low Risk'
  },

  // Status
  'status.completed': {
    uz: 'Tugallangan',
    ru: 'Завершен',
    en: 'Completed'
  },
  'status.processing': {
    uz: 'Qayta ishlanmoqda',
    ru: 'Обработка',
    en: 'Processing'
  },
  'status.failed': {
    uz: 'Xatolik',
    ru: 'Ошибка',
    en: 'Failed'
  },
  'status.pending': {
    uz: 'Kutilmoqda',
    ru: 'Ожидание',
    en: 'Pending'
  },

  // Dashboard specific
  'dashboard.upload_contract_description': {
    uz: 'Xavflarni tahlil qilish uchun shartnoma yuklang',
    ru: 'Загрузите договор для анализа рисков',
    en: 'Upload contract for risk analysis'
  },
  'dashboard.ask_ai_lawyer': {
    uz: 'AI-yuristga savol bering',
    ru: 'Задайте вопрос ИИ-юристу',
    en: 'Ask AI lawyer a question'
  },
  'dashboard.find_legal_info': {
    uz: 'Kerakli huquqiy ma\'lumotni toping',
    ru: 'Найдите нужную правовую информацию',
    en: 'Find needed legal information'
  },
  'dashboard.used': {
    uz: 'Ishlatilgan',
    ru: 'Использовано',
    en: 'Used'
  },
  'dashboard.on_average': {
    uz: 'o\'rtacha',
    ru: 'в среднем',
    en: 'on average'
  },
  'dashboard.instead_waiting_lawyer': {
    uz: 'yurist kutish o\'rniga',
    ru: 'вместо ожидания юриста',
    en: 'instead of waiting for lawyer'
  },
  'dashboard.your_plan': {
    uz: 'Sizning rejangiz',
    ru: 'Ваш план',
    en: 'Your Plan'
  },
  'dashboard.current_plan': {
    uz: 'Joriy reja',
    ru: 'Текущий план',
    en: 'Current Plan'
  },
  'dashboard.analyses_per_month': {
    uz: 'Oyiga tahlillar',
    ru: 'Анализов в месяц',
    en: 'Analyses per Month'
  },
  'dashboard.upgrade_plan': {
    uz: 'Rejani yaxshilash',
    ru: 'Улучшить план',
    en: 'Upgrade Plan'
  },
  'dashboard.useful_tips': {
    uz: 'Foydali maslahatlar',
    ru: 'Полезные советы',
    en: 'Useful Tips'
  },
  'dashboard.tip_quality_title': {
    uz: 'Hujjat sifati',
    ru: 'Качество документов',
    en: 'Document Quality'
  },
  'dashboard.tip_quality_desc': {
    uz: 'Yaxshi tahlil uchun aniq skanlar yuklang',
    ru: 'Загружайте четкие сканы для лучшего анализа',
    en: 'Upload clear scans for better analysis'
  },
  'dashboard.tip_format_title': {
    uz: 'Fayl formati',
    ru: 'Формат файлов',
    en: 'File Format'
  },
  'dashboard.tip_format_desc': {
    uz: 'PDF, DOC, DOCX, TXT qo\'llab-quvvatlanadi',
    ru: 'Поддерживаются PDF, DOC, DOCX, TXT',
    en: 'PDF, DOC, DOCX, TXT supported'
  },
  'dashboard.tip_privacy_title': {
    uz: 'Maxfiylik',
    ru: 'Конфиденциальность',
    en: 'Privacy'
  },
  'dashboard.tip_privacy_desc': {
    uz: 'Barcha hujjatlar himoyalangan va tahlildan keyin o\'chiriladi',
    ru: 'Все документы защищены и удаляются после анализа',
    en: 'All documents are protected and deleted after analysis'
  },
  'dashboard.need_help': {
    uz: 'Yordam kerakmi?',
    ru: 'Нужна помощь?',
    en: 'Need Help?'
  },
  'dashboard.how_it_works': {
    uz: 'Bu qanday ishlaydi?',
    ru: 'Как это работает?',
    en: 'How does it work?'
  },
  'dashboard.knowledge_base': {
    uz: 'Bilimlar bazasi',
    ru: 'База знаний',
    en: 'Knowledge Base'
  },
  'dashboard.contact_support': {
    uz: 'Qo\'llab-quvvatlash bilan bog\'lanish',
    ru: 'Связаться с поддержкой',
    en: 'Contact Support'
  },

  // Auth specific
  'auth.password_min': {
    uz: 'Kamida 8 ta belgi',
    ru: 'Минимум 8 символов',
    en: 'Minimum 8 characters'
  },
  'auth.passwords_no_match': {
    uz: 'Parollar mos kelmaydi',
    ru: 'Пароли не совпадают',
    en: 'Passwords do not match'
  },
  'auth.terms_agreement': {
    uz: 'Men foydalanish shartlari va maxfiylik siyosati bilan roziman',
    ru: 'Я соглашаюсь с условиями использования и политикой конфиденциальности',
    en: 'I agree to the terms of use and privacy policy'
  },
  'auth.free_analyses_offer': {
    uz: 'Ro\'yxatdan o\'tganda 3 ta bepul hujjat tahlili',
    ru: '3 бесплатных анализа документов при регистрации',
    en: '3 free document analyses upon registration'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'uz';
    }
    return 'uz'; // Default for server-side rendering
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};