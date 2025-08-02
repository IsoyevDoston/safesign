import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield,
  Download,
  Eye,
  X
} from 'lucide-react';

const DocumentReview = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const analyzeDocument = async () => {
    if (!file) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockAnalysis = {
        riskScore: 35,
        summary: "Документ содержит стандартные условия договора поставки с несколькими областями, требующими внимания. Общий уровень риска оценивается как средний.",
        risks: [
          {
            type: "medium",
            description: "Отсутствует четкое определение ответственности за просрочку поставки",
            suggestion: "Рекомендуется добавить конкретные штрафные санкции за нарушение сроков",
            location: "Раздел 4.2"
          },
          {
            type: "low",
            description: "Условия оплаты могут быть более детализированы",
            suggestion: "Уточните порядок и сроки оплаты, включая возможные скидки",
            location: "Раздел 3.1"
          },
          {
            type: "high",
            description: "Отсутствует форс-мажорная оговорка",
            suggestion: "Необходимо добавить раздел о форс-мажорных обстоятельствах",
            location: "Отсутствует"
          }
        ],
        recommendations: [
          "Добавить детальное описание качества товара и процедуры приемки",
          "Включить механизм разрешения споров",
          "Уточнить условия расторжения договора",
          "Добавить положения о конфиденциальности"
        ]
      };
      
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 3000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100 border-red-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getRiskText = (score: number) => {
    if (score >= 70) return 'Высокий риск';
    if (score >= 40) return 'Средний риск';
    return 'Низкий риск';
  };

  const getRiskTypeColor = (type: string) => {
    switch (type) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskTypeText = (type: string) => {
    switch (type) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Анализ документов с ИИ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Загрузите договор или юридический документ для мгновенного анализа рисков 
            и получения рекомендаций от нашего ИИ-юриста
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Загрузить документ</h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : file 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                
                {file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setFile(null)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Удалить
                      </button>
                      <label
                        htmlFor="file-upload"
                        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Заменить
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        Нажмите для выбора файла или перетащите сюда
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Поддерживаются форматы: PDF, DOC, DOCX, TXT (до 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <div className="mt-6">
                  <button
                    onClick={analyzeDocument}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl text-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Анализируем документ...
                      </div>
                    ) : (
                      'Анализировать документ'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="mt-8 space-y-6">
                {/* Risk Score */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Оценка рисков</h3>
                    <div className={`px-4 py-2 rounded-full border ${getRiskColor(analysis.riskScore)}`}>
                      <span className="font-semibold">{analysis.riskScore}/100</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Уровень риска</span>
                      <span>{getRiskText(analysis.riskScore)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          analysis.riskScore >= 70 ? 'bg-red-500' :
                          analysis.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${analysis.riskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Identified Risks */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Выявленные риски</h3>
                  <div className="space-y-4">
                    {analysis.risks.map((risk: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskTypeColor(risk.type)}`}>
                            {getRiskTypeText(risk.type)} риск
                          </span>
                          <span className="text-sm text-gray-500">{risk.location}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{risk.description}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{risk.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Рекомендации</h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Действия</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="h-5 w-5 mr-2" />
                      Скачать отчет
                    </button>
                    <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-5 w-5 mr-2" />
                      Просмотреть детали
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Безопасность</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Шифрование данных</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Автоудаление файлов</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Соответствие GDPR</span>
                </div>
              </div>
            </div>

            {/* Processing Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Процесс анализа</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">1. Извлечение текста</span>
                  <p>Распознавание и обработка содержимого документа</p>
                </div>
                <div>
                  <span className="font-medium">2. ИИ-анализ</span>
                  <p>Выявление рисков и проблемных областей</p>
                </div>
                <div>
                  <span className="font-medium">3. Рекомендации</span>
                  <p>Формирование предложений по улучшению</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Советы</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Загружайте четкие сканы документов</p>
                <p>• Убедитесь, что текст читаем</p>
                <p>• Проверьте размер файла (до 10MB)</p>
                <p>• Используйте поддерживаемые форматы</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;