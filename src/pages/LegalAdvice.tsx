import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  BookOpen,
  Scale
} from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const LegalAdvice = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: t('legal_advice.initial_message'),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "Как зарегистрировать ООО в Узбекистане?",
    "Какие налоги платит малый бизнес?",
    "Как правильно составить трудовой договор?",
    "Что такое НДС и кто его платит?",
    "Как защитить интеллектуальную собственность?",
    "Какие документы нужны для экспорта?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 2000);
  };

  const getAIResponse = (question: string): string => {
    const responses: { [key: string]: string } = {
      'регистрация ооо': `Для регистрации ООО в Узбекистане необходимо:

1. **Подготовить документы:**
   - Заявление о государственной регистрации
   - Устав общества
   - Решение о создании ООО
   - Документы об оплате уставного капитала

2. **Требования к уставному капиталу:**
   - Минимальный размер: 100-кратный размер БРВ
   - Может быть внесен деньгами или имуществом

3. **Процедура регистрации:**
   - Подача документов в Единый портал госуслуг
   - Срок регистрации: до 3 рабочих дней
   - Получение свидетельства о регистрации

4. **Дополнительные шаги:**
   - Изготовление печати
   - Открытие банковского счета
   - Постановка на налоговый учет

**Важно:** Рекомендую обратиться к квалифицированному юристу для детальной консультации по вашей конкретной ситуации.`,
      
      'налоги малый бизнес': `Малый бизнес в Узбекистане может работать по следующим налоговым режимам:

1. **Микрофирма:**
   - Оборот до 1 млрд сум в год
   - Единый налоговый платеж: 4% с оборота
   - Освобождение от НДС, подоходного налога

2. **Малое предпринимательство:**
   - Оборот до 3 млрд сум в год
   - Единый налоговый платеж: 5% с оборота
   - Возможность работы с НДС

3. **Льготы для стартапов:**
   - Освобождение от налогов на 3 года
   - Льготы по социальным взносам
   - Упрощенная отчетность

**Рекомендации:**
- Ведите точный учет доходов и расходов
- Своевременно подавайте отчетность
- Консультируйтесь с налоговыми консультантами

*Данная информация носит общий характер. Для точной консультации обратитесь к налоговому консультанту.*`,
      
      'default': `Спасибо за ваш вопрос. Это важная правовая тема, которая требует детального рассмотрения.

Для получения точной консультации по вашему вопросу рекомендую:

1. **Изучить актуальное законодательство** - правовые нормы могут изменяться
2. **Обратиться к специалисту** - квалифицированный юрист поможет с конкретной ситуацией
3. **Проверить последние изменения** - в законодательстве Узбекистана регулярно происходят обновления

**Важное напоминание:** Данная консультация носит информационный характер и не заменяет профессиональную юридическую помощь. Для решения конкретных правовых вопросов обязательно обратитесь к квалифицированному юристу.

Могу ли я помочь вам с чем-то еще?`
    };

    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('ооо') || lowerQuestion.includes('регистрац')) {
      return responses['регистрация ооо'];
    } else if (lowerQuestion.includes('налог') || lowerQuestion.includes('малый бизнес')) {
      return responses['налоги малый бизнес'];
    } else {
      return responses['default'];
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('legal_advice.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('legal_advice.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('legal_advice.ai_lawyer')}</h3>
                    <p className="text-sm text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {t('legal_advice.online')}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {t('legal_advice.specialization')}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 ml-3' 
                          : 'bg-gradient-to-br from-purple-600 to-blue-600 mr-3'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={t('legal_advice.placeholder')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || loading}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Questions */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('legal_advice.popular_questions')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800">{t('legal_advice.important_notice')}</h3>
              </div>
              <p className="text-sm text-yellow-700 leading-relaxed">
                {t('legal_advice.disclaimer_text')}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('legal_advice.ai_capabilities')}</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{t('legal_advice.uzbek_law')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{t('legal_advice.corporate_law')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{t('legal_advice.tax_consulting')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{t('legal_advice.labor_law')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{t('legal_advice.contract_law')}</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{t('legal_advice.response_time')}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {t('legal_advice.response_description')}
              </p>
              <div className="text-xs text-gray-500">
                {t('legal_advice.available_24_7')}
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{t('legal_advice.additional_resources')}</h3>
              </div>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  {t('legal_advice.law_database')}
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  {t('legal_advice.document_templates')}
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  {t('legal_advice.legal_articles')}
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  {t('legal_advice.lawyer_contacts')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAdvice;