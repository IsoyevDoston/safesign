import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const quickActions = [
    {
      name: t('nav.document_review'),
      description: t('dashboard.upload_contract_description'),
      icon: FileText,
      href: '/document-review',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: t('nav.legal_advice'),
      description: t('dashboard.ask_ai_lawyer'),
      icon: MessageSquare,
      href: '/legal-advice',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: t('nav.law_search'),
      description: t('dashboard.find_legal_info'),
      icon: BookOpen,
      href: '/law-search',
      color: 'from-green-500 to-green-600'
    }
  ];

  const recentDocuments = [
    {
      id: 1,
      name: 'Договор поставки товаров.pdf',
      status: 'completed',
      riskScore: 25,
      date: '2024-01-15',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Трудовой договор.docx',
      status: 'completed',
      riskScore: 45,
      date: '2024-01-14',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Соглашение о конфиденциальности.pdf',
      status: 'processing',
      riskScore: null,
      date: '2024-01-13',
      size: '1.2 MB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'processing':
        return 'Обработка';
      case 'failed':
        return 'Ошибка';
      default:
        return 'Неизвестно';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskText = (score: number) => {
    if (score >= 70) return 'Высокий';
    if (score >= 40) return 'Средний';
    return 'Низкий';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.documents_analyzed')}</p>
                <p className="text-3xl font-bold text-gray-900">{user?.documentsAnalyzed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">за месяц</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.remaining_analyses')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(user?.monthlyLimit || 3) - (user?.documentsAnalyzed || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{t('dashboard.used')}</span>
                <span>{user?.documentsAnalyzed || 0}/{user?.monthlyLimit || 3}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((user?.documentsAnalyzed || 0) / (user?.monthlyLimit || 3)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.average_risk')}</p>
                <p className="text-3xl font-bold text-gray-900">32%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{t('risk.low')}</span>
              <span className="text-gray-500 ml-1">{t('dashboard.on_average')}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.time_saved')}</p>
                <p className="text-3xl font-bold text-gray-900">24ч</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{t('dashboard.instead_waiting_lawyer')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.quick_actions')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-xl p-6 transition-all duration-200 hover:shadow-lg border border-gray-200 hover:border-gray-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {t('common.start')}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('dashboard.recent_documents')}</h2>
                <Link 
                  to="/document-review" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  {t('dashboard.all_documents')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(doc.date).toLocaleDateString('ru-RU')}
                          </span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {doc.riskScore !== null && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(doc.riskScore)}`}>
                          {getRiskText(doc.riskScore)}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.your_plan')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('dashboard.current_plan')}:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {user?.subscriptionPlan || 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('dashboard.analyses_per_month')}:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.monthlyLimit || 3}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('dashboard.used')}:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.documentsAnalyzed || 0}
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                {t('dashboard.upgrade_plan')}
              </button>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                {t('dashboard.useful_tips')}
              </h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">{t('dashboard.tip_quality_title')}</p>
                  <p className="text-gray-600">{t('dashboard.tip_quality_desc')}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">{t('dashboard.tip_format_title')}</p>
                  <p className="text-gray-600">{t('dashboard.tip_format_desc')}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">{t('dashboard.tip_privacy_title')}</p>
                  <p className="text-gray-600">{t('dashboard.tip_privacy_desc')}</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('dashboard.need_help')}</h3>
              <div className="space-y-3">
                <Link 
                  to="/about" 
                  className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t('dashboard.how_it_works')}
                </Link>
                <Link 
                  to="/blog" 
                  className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t('dashboard.knowledge_base')}
                </Link>
                <a 
                  href="mailto:support@legalai.uz" 
                  className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t('dashboard.contact_support')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;