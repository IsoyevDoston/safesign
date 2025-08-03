import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  const team = [
    {
      name: "Doston Isoyev",
      role: "CEO va Asoschi",
      description: "AI va mashinaviy o'rganish bo'yicha ekspert",
      avatar: "DI"
    },
    {
      name: "Rustamxon Imamov",
      role: "PM CFO",
      description: "Loyihalar va moliya boshqaruvi",
      avatar: "RI"
    },
    {
      name: "Sardor Zoirov",
      role: "Yurist",
      description: "5+ yil huquqiy tajriba",
      avatar: "SZ"
    },
    {
      name: "Shohjahon Zikirov",
      role: "Data Scientist",
      description: "Ma'lumotlar tahlili va mashinaviy o'rganish mutaxassisi",
      avatar: "ShZ"
    }
  ];

  const stats = [
    { number: "10,000+", label: t('dashboard.documents_analyzed') },
    { number: "2,500+", label: "Mamnun mijozlar" },
    { number: "98%", label: "Tahlil aniqligi" },
    { number: "24/7", label: "Xizmat doimiyligi" }
  ];

  const values = [
    {
      icon: Target,
      title: t('about.mission.title'),
      description: t('about.mission.description')
    },
    {
      icon: Award,
      title: t('about.vision.title'),
      description: t('about.vision.description')
    },
    {
      icon: Users,
      title: t('about.values.title'),
      description: t('about.values.description')
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
              {t('about.hero.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
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
              {t('about.stats.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.stats.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
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
              {t('about.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: t('about.feature.instant.title'),
                description: t('about.feature.instant.description')
              },
              {
                icon: Shield,
                title: t('about.feature.security.title'),
                description: t('about.feature.security.description')
              },
              {
                icon: Globe,
                title: t('about.feature.local.title'),
                description: t('about.feature.local.description')
              },
              {
                icon: Heart,
                title: t('about.feature.ease.title'),
                description: t('about.feature.ease.description')
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
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
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.contact.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.contact.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ofis</h3>
              <p className="text-gray-600">
                Toshkent sh., Amir Temur ko'chasi, 108<br />
                "Poytaxt" biznes markazi, 15-qavat
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600">
                +998 94 650 74 78
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                info@safesign.uz<br />
                support@safesign.uz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
        <div className="relative max-w-7xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle').replace(/LegalAI/g, 'SafeSign')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('home.cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white hover:text-blue-700 transition-all duration-200"
            >
              {t('about.contact.title')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;           <div key={index} className="text-center">
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
                Мы используем самые современные технологии машинного обучения и 
                обработки естественного языка для анализа юридических документов. 
                Наша система обучена на тысячах договоров и правовых актов Узбекистана.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Обработка естественного языка (NLP)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Машинное обучение и глубокие нейронные сети</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Анализ правовых рисков в реальном времени</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Интеграция с базами данных законодательства</span>
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
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Офис</h3>
              <p className="text-gray-600">
                г. Ташкент, ул. Амира Темура, 108<br />
                Бизнес-центр "Poytaxt", 15 этаж
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Телефон</h3>
              <p className="text-gray-600">
                +998 94 650 74 78
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                info@safesign.uz<br />
                support@safesign.uz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
        <div className="relative max-w-7xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {sectionTitles.cta[lang].replace('LegalAI', 'SafeSign')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {sectionTitles.ctaDesc[lang].replace(/LegalAI/g, 'SafeSign')}
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl">
              {sectionTitles.try[lang]}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white hover:text-blue-700 transition-all duration-200">
              {sectionTitles.contactBtn[lang]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;