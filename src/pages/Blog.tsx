import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  ArrowRight, 
  Search,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  readTime: number;
  featured: boolean;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'contract-law', label: 'Договорное право' },
    { value: 'business-law', label: 'Бизнес-право' },
    { value: 'tax-law', label: 'Налоговое право' },
    { value: 'labor-law', label: 'Трудовое право' },
    { value: 'technology', label: 'Правовые технологии' },
    { value: 'updates', label: 'Обновления законов' }
  ];

  const mockPosts: BlogPost[] = [
    {
      id: 1,
      title: "Основы договорного права в Узбекистане: полное руководство для бизнеса",
      slug: "osnovy-dogovornogo-prava-uzbekistan",
      excerpt: "Подробное руководство по заключению и исполнению договоров в Узбекистане. Узнайте основы договорного права и избегайте типичных ошибок при заключении договоров.",
      content: "Полный контент статьи...",
      author: "Азиз Каримов",
      category: "contract-law",
      tags: ["договор", "право", "бизнес", "Узбекистан"],
      publishedAt: "2024-01-15",
      views: 2450,
      readTime: 8,
      featured: true
    },
    {
      id: 2,
      title: "ИИ в юридической практике: революция или эволюция?",
      slug: "ai-legal-practice-revolution",
      excerpt: "Как искусственный интеллект трансформирует юридическую практику. Рассмотрим влияние ИИ на анализ документов, поиск прецедентов и автоматизацию рутинных задач.",
      content: "Полный контент статьи...",
      author: "Нигора Рахимова",
      category: "technology",
      tags: ["ИИ", "технологии", "автоматизация", "будущее"],
      publishedAt: "2024-01-12",
      views: 1890,
      readTime: 6,
      featured: true
    },
    {
      id: 3,
      title: "Новые изменения в налоговом законодательстве 2024",
      slug: "tax-law-changes-2024",
      excerpt: "Обзор ключевых изменений в налоговом законодательстве Узбекистана на 2024 год. Что нужно знать предпринимателям и бухгалтерам.",
      content: "Полный контент статьи...",
      author: "Бахтиёр Усманов",
      category: "tax-law",
      tags: ["налоги", "изменения", "2024", "предпринимательство"],
      publishedAt: "2024-01-10",
      views: 3200,
      readTime: 10,
      featured: false
    },
    {
      id: 4,
      title: "Защита интеллектуальной собственности в Центральной Азии",
      slug: "ip-protection-central-asia",
      excerpt: "Полное руководство по защите интеллектуальной собственности в регионе. Особенности патентного права, товарных знаков и авторских прав.",
      content: "Полный контент статьи...",
      author: "Дилшод Ахмедов",
      category: "business-law",
      tags: ["патенты", "товарные знаки", "авторское право", "IP"],
      publishedAt: "2024-01-08",
      views: 1650,
      readTime: 12,
      featured: true
    },
    {
      id: 5,
      title: "Трудовые споры: как защитить свои права",
      slug: "labor-disputes-rights-protection",
      excerpt: "Практическое руководство по разрешению трудовых споров. Пошаговый алгоритм действий для работников и работодателей.",
      content: "Полный контент статьи...",
      author: "Малика Турсунова",
      category: "labor-law",
      tags: ["трудовые споры", "права работников", "суд", "медиация"],
      publishedAt: "2024-01-05",
      views: 980,
      readTime: 7,
      featured: false
    },
    {
      id: 6,
      title: "Цифровая трансформация юридических услуг",
      slug: "digital-transformation-legal-services",
      excerpt: "Как цифровые технологии меняют сферу юридических услуг. Обзор современных инструментов и платформ для юристов.",
      content: "Полный контент статьи...",
      author: "Шерзод Назаров",
      category: "technology",
      tags: ["цифровизация", "юридические услуги", "технологии", "инновации"],
      publishedAt: "2024-01-03",
      views: 1420,
      readTime: 9,
      featured: false
    }
  ];

  const [filteredPosts, setFilteredPosts] = useState(mockPosts);

  React.useEffect(() => {
    let filtered = mockPosts;

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory]);

  const featuredPosts = mockPosts.filter(post => post.featured);
  const popularPosts = [...mockPosts].sort((a, b) => b.views - a.views).slice(0, 5);

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'contract-law': 'bg-blue-100 text-blue-800',
      'business-law': 'bg-green-100 text-green-800',
      'tax-law': 'bg-yellow-100 text-yellow-800',
      'labor-law': 'bg-purple-100 text-purple-800',
      'technology': 'bg-pink-100 text-pink-800',
      'updates': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Правовой блог LegalAI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Экспертные статьи о праве, бизнесе и технологиях. 
            Актуальная информация о законодательстве Узбекистана и Центральной Азии.
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Рекомендуемые статьи</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post, index) => (
              <article key={post.id} className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${index === 0 ? 'lg:row-span-2' : ''}`}>
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Рекомендуем
                  </span>
                </div>
                <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getCategoryColor(post.category)} text-gray-800 bg-white`}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} мин
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group">
                    Читать далее
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск статей..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
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
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                        {post.featured && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            Рекомендуем
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} мин чтения
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} просмотров
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group">
                    Читать полностью
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Предыдущая
                </button>
                <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  2
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  3
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Следующая
                </button>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Posts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Популярные статьи</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views} просмотров
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Категории</h3>
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

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Подписка на новости</h3>
              <p className="text-sm text-gray-600 mb-4">
                Получайте последние обновления о правовых изменениях и новые статьи на email.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Подписаться
                </button>
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные теги</h3>
              <div className="flex flex-wrap gap-2">
                {['договор', 'налоги', 'ИИ', 'бизнес', 'право', 'технологии', 'Узбекистан', 'стартап', 'IP', 'суд'].map(tag => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;