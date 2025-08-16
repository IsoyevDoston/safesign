import React from 'react';
import { 
  Scale, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const About = () => {

  const team = [
    {
      name: {
        ru: "Достон Исоев",
        en: "Doston Isoyev",
        uz: "Doston Isoyev"
      },
      role: {
        ru: "Основатель и CEO",
        en: "CEO and Founder",
        uz: "CEO va Asoschi"
      },
      description: {
        ru: "Эксперт по ИИ и машинному обучению",
        en: "AI and Machine Learning Expert",
        uz: "AI va mashinaviy o‘rganish bo‘yicha ekspert"
      },
      avatar: "DI"
    },
    {
      name: {
        ru: "Рустамхон Имамов",
        en: "Rustamxon Imamov",
        uz: "Rustamxon Imamov"
      },
      role: {
        ru: "PM и CFO",
        en: "PM CFO",
        uz: "PM CFO"
      },
      description: {
        ru: "Управление проектами и финансами",
        en: "Project and Finance Management",
        uz: "Loyihalar va moliya boshqaruvi"
      },
      avatar: "RI"
    },
    {
      name: {
        ru: "Сардор Зоиров",
        en: "Sardor Zoirov",
        uz: "Sardor Zoirov"
      },
      role: {
        ru: "Юрист",
        en: "Lawyer",
        uz: "Yurist"
      },
      description: {
        ru: "5+ лет опыта в юридической сфере",
        en: "5+ years of experience in law",
        uz: "5+ yil huquqiy tajriba"
      },
      avatar: "SZ"
    },
    {
      name: {
        ru: "Шохжахон Зикиров",
        en: "Shohjahon Zikirov",
        uz: "Shohjahon Zikirov"
      },
      role: {
        ru: "Data Scientist",
        en: "Data Scientist",
        uz: "Data Scientist"
      },
      description: {
        ru: "Специалист по анализу данных и машинному обучению",
        en: "Data analysis and machine learning specialist",
        uz: "Ma'lumotlar tahlili va mashinaviy o‘rganish mutaxassisi"
      },
      avatar: "ShZ"
    }
  ];

  // Language selection (default to Russian)
  const lang = 'ru'; // Change to 'en' or 'uz' as needed

  // Section titles and main button texts
  const sectionTitles = {
    about: {
      ru: 'О платформе SafeSign',
      en: 'About SafeSign Platform',
      uz: 'SafeSign platformasi haqida'
    },
    mission: {
      ru: 'Миссия',
      en: 'Mission',
      uz: 'Missiya'
    },
    stats: {
      ru: 'Наши достижения',
      en: 'Our Achievements',
      uz: 'Bizning yutuqlarimiz'
    },
    statsDesc: {
      ru: 'Цифры, которые говорят о нашем успехе',
      en: 'Numbers that speak for our success',
      uz: 'Bizning muvaffaqiyatimizni ko‘rsatadigan raqamlar'
    },
    features: {
      ru: 'Почему выбирают SafeSign',
      en: 'Why Choose SafeSign',
      uz: 'Nega SafeSign?'
    },
    featuresDesc: {
      ru: 'Мы сочетаем передовые технологии с глубоким пониманием местного права',
      en: 'We combine advanced technology with deep local law expertise',
      uz: 'Biz ilg‘or texnologiyalar va mahalliy qonunchilikni chuqur tushunishni birlashtiramiz'
    },
    team: {
      ru: 'Наша команда',
      en: 'Our Team',
      uz: 'Bizning jamoamiz'
    },
    teamDesc: {
      ru: 'Эксперты в области права и технологий, работающие над созданием лучших решений',
      en: 'Experts in law and technology, creating the best solutions',
      uz: 'Huquq va texnologiyalar sohasidagi eng yaxshi yechimlarni yaratadigan mutaxassislar'
    },
    how: {
      ru: 'Как это работает',
      en: 'How it works',
      uz: 'Qanday ishlaydi'
    },
    howDesc: {
      ru: 'Простой процесс получения юридической помощи',
      en: 'A simple process to get legal help',
      uz: 'Yuridik yordam olishning oddiy jarayoni'
    },
    step1: {
      ru: 'Загрузите документ',
      en: 'Upload your document',
      uz: 'Hujjatni yuklang'
    },
    step1Desc: {
      ru: 'Просто перетащите ваш договор или документ в наш интерфейс',
      en: 'Just drag and drop your contract or document into our interface',
      uz: 'Shartnoma yoki hujjatingizni interfeysga yuklang'
    },
    step2: {
      ru: 'ИИ анализирует',
      en: 'AI analyzes',
      uz: 'AI tahlil qiladi'
    },
    step2Desc: {
      ru: 'Наш ИИ мгновенно анализирует документ и выявляет потенциальные риски',
      en: 'Our AI instantly analyzes the document and identifies potential risks',
      uz: 'AI hujjatni tezda tahlil qiladi va xavflarni aniqlaydi'
    },
    step3: {
      ru: 'Получите результат',
      en: 'Get the result',
      uz: 'Natijani oling'
    },
    step3Desc: {
      ru: 'Получите детальный отчет с рекомендациями и предложениями по улучшению',
      en: 'Get a detailed report with recommendations and suggestions for improvement',
      uz: 'Tavsiya va takliflar bilan batafsil hisobot oling'
    },
    tech: {
      ru: 'Передовые технологии',
      en: 'Advanced Technologies',
      uz: 'Ilg‘or texnologiyalar'
    },
    contact: {
      ru: 'Свяжитесь с нами',
      en: 'Contact Us',
      uz: 'Biz bilan bog‘laning'
    },
    contactDesc: {
      ru: 'Готовы ответить на ваши вопросы и помочь с внедрением',
      en: 'Ready to answer your questions and help with implementation',
      uz: 'Savollaringizga javob beramiz va joriy etishda yordam beramiz'
    },
    cta: {
      ru: 'Готовы начать?',
      en: 'Ready to start?',
      uz: 'Boshlashga tayyormisiz?'
    },
    ctaDesc: {
      ru: 'Присоединяйтесь к тысячам компаний, которые уже используют SafeSign для анализа своих документов',
      en: 'Join thousands of companies already using SafeSign to analyze their documents',
      uz: 'Hujjatlarini tahlil qilish uchun SafeSign’dan foydalanayotgan minglab kompaniyalarga qo‘shiling'
    },
    try: {
      ru: 'Попробовать бесплатно',
      en: 'Try for free',
      uz: 'Bepul sinab ko‘ring'
    },
    contactBtn: {
      ru: 'Связаться с нами',
      en: 'Contact us',
      uz: 'Bog‘lanish'
    }
  };

  const stats = [
    { number: "1,500+", label: { ru: "Документов проанализировано", en: "Documents analyzed", uz: "Tahlil qilingan hujjatlar" } },
    { number: "100+", label: { ru: "Довольных клиентов", en: "Happy clients", uz: "Mamnun mijozlar" } },
    { number: "98%", label: { ru: "Точность анализа", en: "Analysis accuracy", uz: "Tahlil aniqligi" } },
    { number: "24/7", label: { ru: "Доступность сервиса", en: "Service availability", uz: "Xizmat doimiyligi" } }
  ];

  const values = [
    {
      icon: Target,
      title: { ru: "Миссия", en: "Mission", uz: "Missiya" },
      description: {
        ru: "Сделать юридические услуги доступными и понятными для каждого бизнеса в Узбекистане и Центральной Азии",
        en: "Make legal services accessible and understandable for every business in Uzbekistan and Central Asia",
        uz: "Yuridik xizmatlarni Oʻzbekiston va Markaziy Osiyodagi har bir biznes uchun ochiq va tushunarli qilish"
      }
    },
    {
      icon: Award,
      title: { ru: "Видение", en: "Vision", uz: "Vision" },
      description: {
        ru: "Стать ведущей платформой правовых технологий в регионе, объединяющей ИИ и экспертизу юристов",
        en: "Become the leading legal tech platform in the region, combining AI and legal expertise",
        uz: "Mintaqadagi yetakchi yuridik texnologiyalar platformasiga aylanish, AI va yuristlar tajribasini birlashtirish"
      }
    },
    {
      icon: Users,
      title: { ru: "Ценности", en: "Values", uz: "Qadriyatlar" },
      description: {
        ru: "Прозрачность, инновации, качество и забота о клиентах - основа нашей работы",
        en: "Transparency, innovation, quality, and client care are the foundation of our work",
        uz: "Shaffoflik, innovatsiya, sifat va mijozlarga gʻamxoʻrlik – ishimizning asosi"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {sectionTitles.about[lang]}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {{
                ru: 'Мы создаем будущее юридических услуг, объединяя передовые технологии искусственного интеллекта с глубокой экспертизой в области права Узбекистана',
                en: 'We are creating the future of legal services by combining advanced artificial intelligence technologies with deep expertise in Uzbekistan law',
                uz: 'Biz ilg‘or sunʼiy intellekt texnologiyalari va Oʻzbekiston huquqi boʻyicha chuqur tajribani birlashtirib, yuridik xizmatlarning kelajagini yaratmoqdamiz'
              }[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title[lang]}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sectionTitles.stats[lang]}
            </h2>
            <p className="text-xl text-gray-600">
              {sectionTitles.statsDesc[lang]}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sectionTitles.features[lang]}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {sectionTitles.featuresDesc[lang]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: { ru: 'Мгновенный анализ', en: 'Instant Analysis', uz: 'Zudlik bilan tahlil' },
                description: {
                  ru: 'Анализ документов за секунды вместо часов ожидания',
                  en: 'Analyze documents in seconds instead of hours of waiting',
                  uz: 'Hujjatlarni soatlab kutish o‘rniga soniyalarda tahlil qiling'
                }
              },
              {
                icon: Shield,
                title: { ru: 'Безопасность данных', en: 'Data Security', uz: 'Maʼlumotlar xavfsizligi' },
                description: {
                  ru: 'Полная конфиденциальность и защита ваших документов',
                  en: 'Full confidentiality and protection of your documents',
                  uz: 'Hujjatlaringiz to‘liq maxfiyligi va himoyasi'
                }
              },
              {
                icon: Globe,
                title: { ru: 'Местная экспертиза', en: 'Local Expertise', uz: 'Mahalliy ekspertiza' },
                description: {
                  ru: 'Специализация на законодательстве Узбекистана',
                  en: 'Specialized in Uzbekistan legislation',
                  uz: 'Oʻzbekiston qonunchiligi boʻyicha ixtisoslashgan'
                }
              },
              {
                icon: Heart,
                title: { ru: 'Простота использования', en: 'Ease of Use', uz: 'Foydalanish qulayligi' },
                description: {
                  ru: 'Интуитивный интерфейс, понятный каждому',
                  en: 'Intuitive interface, understandable for everyone',
                  uz: 'Har kim tushunadigan intuitiv interfeys'
                }
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title[lang]}</h3>
                <p className="text-gray-600 text-sm">{feature.description[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sectionTitles.team[lang]}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {sectionTitles.teamDesc[lang]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name[lang]}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role[lang]}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sectionTitles.how[lang]}
            </h2>
            <p className="text-xl text-gray-600">
              {sectionTitles.howDesc[lang]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{sectionTitles.step1[lang]}</h3>
              <p className="text-gray-600">
                {sectionTitles.step1Desc[lang]}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{sectionTitles.step2[lang]}</h3>
              <p className="text-gray-600">
                {sectionTitles.step2Desc[lang]}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{sectionTitles.step3[lang]}</h3>
              <p className="text-gray-600">
                {sectionTitles.step3Desc[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {sectionTitles.tech[lang]}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {{
          ru: "Мы используем самые современные технологии машинного обучения и обработки естественного языка для анализа юридических документов. Наша система обучена на тысячах договоров и правовых актов Узбекистана.",
          en: "We use the most advanced machine learning and natural language processing technologies to analyze legal documents. Our system is trained on thousands of contracts and legal acts of Uzbekistan.",
          uz: "Biz yuridik hujjatlarni tahlil qilish uchun eng zamonaviy mashinaviy o‘rganish va tabiiy tilni qayta ishlash texnologiyalaridan foydalanamiz. Tizimimiz minglab shartnomalar va O‘zbekiston huquqiy hujjatlari asosida o‘qitilgan."
            }[lang]}
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-700">
            {{
              ru: "Обработка естественного языка (NLP)",
              en: "Natural Language Processing (NLP)",
              uz: "Tabiiy tilni qayta ishlash (NLP)"
            }[lang]}
          </span>
            </div>
            <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-700">
            {{
              ru: "Машинное обучение и глубокие нейронные сети",
              en: "Machine learning and deep neural networks",
              uz: "Mashinaviy o‘rganish va chuqur neyron tarmoqlar"
            }[lang]}
          </span>
            </div>
            <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-700">
            {{
              ru: "Анализ правовых рисков в реальном времени",
              en: "Real-time legal risk analysis",
              uz: "Huquqiy xatarlarni real vaqt rejimida tahlil qilish"
            }[lang]}
          </span>
            </div>
            <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-700">
            {{
              ru: "Интеграция с базами данных законодательства",
              en: "Integration with legislation databases",
              uz: "Qonunchilik maʼlumotlar bazalari bilan integratsiya"
            }[lang]}
          </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center">
            <Scale className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {{
            ru: 'ИИ-движок SafeSign',
            en: 'SafeSign AI Engine',
            uz: 'SafeSign sunʼiy intellekt dvigateli'
          }[lang]}
                </h3>
                <p className="text-gray-600 mb-6">
                  {{
                    ru: 'Наш собственный ИИ-движок, специально обученный на законодательстве Узбекистана и практике местных судов',
                    en: 'Our proprietary AI engine, specially trained on Uzbekistan legislation and local court practice',
                    uz: 'Oʻzbekiston qonunchiligi va mahalliy sud amaliyoti asosida maxsus oʻqitilgan sunʼiy intellekt dvigatelimiz'
                  }[lang]}
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <div className="text-sm text-gray-600">{{ru:'Точность',en:'Accuracy',uz:'Aniqlik'}[lang]}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">&lt;5с</div>
                    <div className="text-sm text-gray-600">{{ru:'Время анализа',en:'Analysis time',uz:'Tahlil vaqti'}[lang]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {sectionTitles.contact[lang]}
            </h2>
            <p className="text-xl text-gray-600">
              {sectionTitles.contactDesc[lang]}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-bl</div>ue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{{ru:'Офис',en:'Office',uz:'Ofis'}[lang]}</h3>
              <p className="text-gray-600">
                {{
              ru: "г. Ташкент, ул. Шахрисабз, 7",
              en: "Tashkent, Shahrisabz str., 7",
              uz: "Toshkent, Shahrisabz ko'chasi, 7"
            }[lang]}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{{ru:'Телефон',en:'Phone',uz:'Telefon'}[lang]}</h3>
              <p className="text-gray-600">
                +998 33 450 74 78
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{{ru:'Электронная почта',en:'Email',uz:'Elektron pochta'}[lang]}</h3>
              <p className="text-gray-600">
                info@safesign.uz<br />
                support@safesign.uz
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;