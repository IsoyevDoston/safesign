import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, 
  MessageSquare, 
  BookOpen,
  Shield,
  Clock,
  Globe,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      name: t('home.feature.document_analysis.title'),
      description: t('home.feature.document_analysis.description'),
      icon: FileText,
      href: '/document-review',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: t('home.feature.legal_consultation.title'),
      description: t('home.feature.legal_consultation.description'),
      icon: MessageSquare,
      href: '/legal-advice',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: t('home.feature.law_database.title'),
      description: t('home.feature.law_database.description'),
      icon: BookOpen,
      href: '/law-search',
      color: 'from-green-500 to-green-600'
    }
  ];

  const benefits = [
    {
      name: t('home.benefit.security.title'),
      description: t('home.benefit.security.description'),
      icon: Shield
    },
    {
      name: t('home.benefit.speed.title'),
      description: t('home.benefit.speed.description'),
      icon: Clock
    },
    {
      name: t('home.benefit.expertise.title'),
      description: t('home.benefit.expertise.description'),
      icon: Globe
    }
  ];

  const stats = [
    { label: 'Документов проанализировано', value: '1,500+', icon: FileText },
    { label: 'Довольных клиентов', value: '100+', icon: Users },
    { label: 'Точность анализа', value: '98%', icon: TrendingUp },
    { label: 'Средняя оценка', value: '4.9/5', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Азиз Каримов',
      role: 'Директор ООО "ТехноСервис"',
      content: 'SafeSign помог нам быстро проанализировать сложный договор поставки. Сэкономили время и деньги.',
      avatar: 'AK'
    },
    {
      name: 'Нигора Рахимова',
      role: 'Юрист',
      content: 'Отличный инструмент для предварительного анализа документов. Очень точные рекомендации.',
      avatar: 'НР'
    },
    {
      name: 'Бахтиёр Усманов',
      role: 'Предприниматель',
      content: 'Простой интерфейс, быстрые результаты. Рекомендую всем, кто работает с договорами.',
      avatar: 'БУ'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('home.hero.cta_dashboard')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('home.hero.cta_start')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white hover:text-blue-700 transition-all duration-200"
                  >
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">3 {t('common.free')} {t('dashboard.documents_analyzed')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{t('common.no_obligations')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{t('home.benefit.speed.title')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.name} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.href}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-all duration-200"
                  >
                    {t('blog.read_more')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.benefits.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={benefit.name} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <benefit.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-xl text-gray-600">
              Что говорят о нас наши пользователи
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
        <div className="relative max-w-7xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
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
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white hover:text-blue-700 transition-all duration-200"
            >
              {t('blog.read_more')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;