import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Filter, 
  Eye, 
  ExternalLink,
  Tag,
  Calendar,
  FileText,
  Scale,
  ChevronDown,
  Star
} from 'lucide-react';

interface Law {
  id: number;
  title: string;
  category: string;
  articleNumber: string;
  content: string;
  summary: string;
  keywords: string[];
  lastUpdated: string;
  views: number;
  rating: number;
}

const LawSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'civil', label: 'Гражданское право' },
    { value: 'commercial', label: 'Коммерческое право' },
    { value: 'labor', label: 'Трудовое право' },
    { value: 'tax', label: 'Налоговое право' },
    { value: 'administrative', label: 'Административное право' },
    { value: 'criminal', label: 'Уголовное право' }
  ];

  const mockLaws: Law[] = [
    {
      id: 1,
      title: "Гражданский кодекс Республики Узбекистан - Основные принципы",
      category: "civil",
      articleNumber: "ГК-1",
      content: "Гражданское законодательство основывается на признании равенства участников регулируемых им отношений, неприкосновенности собственности, свободы договора, недопустимости произвольного вмешательства кого-либо в частные дела, необходимости беспрепятственного осуществления гражданских прав, обеспечения восстановления нарушенных прав, их судебной защиты.",
      summary: "Основополагающие принципы гражданского права в Узбекистане",
      keywords: ["гражданское право", "равенство", "собственность", "договор", "права"],
      lastUpdated: "2024-01-15",
      views: 1250,
      rating: 4.8
    },
    {
      id: 2,
      title: "Трудовой кодекс - Трудовой договор",
      category: "labor",
      articleNumber: "ТК-77",
      content: "Трудовой договор - соглашение между работодателем и работником, в соответствии с которым работодатель обязуется предоставить работнику работу по обусловленной трудовой функции, обеспечить условия труда, предусмотренные трудовым законодательством и иными нормативными правовыми актами, содержащими нормы трудового права, коллективным договором, соглашениями, локальными нормативными актами и данным соглашением, своевременно и в полном размере выплачивать работнику заработную плату.",
      summary: "Определение и основные условия трудового договора",
      keywords: ["трудовой договор", "работодатель", "работник", "заработная плата"],
      lastUpdated: "2024-01-10",
      views: 980,
      rating: 4.6
    },
    {
      id: 3,
      title: "Закон о предпринимательстве - Государственная регистрация",
      category: "commercial",
      articleNumber: "ЗП-15",
      content: "Государственная регистрация субъектов предпринимательства осуществляется в порядке, установленном законодательством, и является обязательным условием для осуществления предпринимательской деятельности. Регистрация производится в течение трех рабочих дней со дня подачи документов.",
      summary: "Процедура государственной регистрации предпринимательской деятельности",
      keywords: ["предпринимательство", "регистрация", "бизнес", "документы"],
      lastUpdated: "2024-01-08",
      views: 756,
      rating: 4.7
    },
    {
      id: 4,
      title: "Налоговый кодекс - НДС для малого бизнеса",
      category: "tax",
      articleNumber: "НК-156",
      content: "Субъекты малого предпринимательства, осуществляющие деятельность в рамках микрофирм, освобождаются от уплаты налога на добавленную стоимость при условии, что их годовой оборот не превышает установленного лимита.",
      summary: "Особенности применения НДС для субъектов малого предпринимательства",
      keywords: ["НДС", "малый бизнес", "микрофирма", "налоги"],
      lastUpdated: "2024-01-05",
      views: 1100,
      rating: 4.9
    }
  ];

  const [filteredLaws, setFilteredLaws] = useState(mockLaws);

  const handleSearch = () => {
    let filtered = mockLaws;

    if (searchQuery) {
      filtered = filtered.filter(law => 
        law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(law => law.category === selectedCategory);
    }

    setFilteredLaws(filtered);
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategory]);

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      civil: 'bg-blue-100 text-blue-800',
      commercial: 'bg-green-100 text-green-800',
      labor: 'bg-purple-100 text-purple-800',
      tax: 'bg-yellow-100 text-yellow-800',
      administrative: 'bg-red-100 text-red-800',
      criminal: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            База законов Узбекистана
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Поиск и изучение законодательства Узбекистана с помощью ИИ. 
            Получите понятные объяснения сложных правовых норм.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по законам, статьям, ключевым словам..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                Фильтры
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата обновления
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Любая дата</option>
                    <option>За последний месяц</option>
                    <option>За последние 3 месяца</option>
                    <option>За последний год</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Популярность
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Любая</option>
                    <option>Высокая (1000+ просмотров)</option>
                    <option>Средняя (500+ просмотров)</option>
                    <option>Низкая (менее 500)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Рейтинг
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Любой</option>
                    <option>4.5+ звезд</option>
                    <option>4.0+ звезд</option>
                    <option>3.5+ звезд</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Найдено: {filteredLaws.length} результатов
              </h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>По релевантности</option>
                <option>По дате обновления</option>
                <option>По популярности</option>
                <option>По рейтингу</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredLaws.map((law) => (
                <div key={law.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(law.category)}`}>
                          {getCategoryLabel(law.category)}
                        </span>
                        <span className="text-sm text-gray-500">{law.articleNumber}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                        {law.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {law.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(law.lastUpdated).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {law.views} просмотров
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        {law.rating}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {law.keywords.slice(0, 4).map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        <Tag className="h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedLaw(law)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Читать полностью
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Scale className="h-4 w-4 mr-2" />
                      Объяснить ИИ
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Источник
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные категории</h3>
              <div className="space-y-2">
                {categories.slice(1).map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние обновления</h3>
              <div className="space-y-3">
                {mockLaws.slice(0, 3).map(law => (
                  <div key={law.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                      {law.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(law.lastUpdated).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-center mb-3">
                <Scale className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">ИИ-помощник</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Не можете найти нужную информацию? Задайте вопрос нашему ИИ-юристу.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Задать вопрос ИИ
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Полезные ссылки</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Официальный портал законодательства
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Министерство юстиции РУз
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Верховный суд РУз
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Налоговый комитет
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Law Detail Modal */}
        {selectedLaw && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLaw.title}</h2>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedLaw.category)}`}>
                        {getCategoryLabel(selectedLaw.category)}
                      </span>
                      <span className="text-sm text-gray-500">{selectedLaw.articleNumber}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLaw(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Содержание статьи</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedLaw.content}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Краткое изложение</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedLaw.summary}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedLaw.keywords.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                        <Tag className="h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Scale className="h-4 w-4 mr-2" />
                    Объяснить простыми словами
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="h-4 w-4 mr-2" />
                    Скачать PDF
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Открыть источник
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawSearch;