## Step 5: Frontend Components

### 5.1 Main App Component (src/App.js)
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import DocumentReview from './pages/DocumentReview';
import LegalAdvice from './pages/LegalAdvice';
import LawSearch from './pages/LawSearch';
import Blog from './pages/Blog';
import About from './pages/About';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/law-search" element={<LawSearch />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/document-review" element={
              <ProtectedRoute>
                <DocumentReview />
              </ProtectedRoute>
            } />
            <Route path="/legal-advice" element={
              <ProtectedRoute>
                <LegalAdvice />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 5.2 Authentication Context (src/context/AuthContext.js)
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5.3 API Services (src/services/api.js)
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5.4 Auth Service (src/services/auth.js)
```javascript
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};
```

### 5.5 Document Service (src/services/documents.js)
```javascript
import api from './api';

export const documentService = {
  analyzeDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await api.post('/documents/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocumentHistory: async () => {
    const response = await api.get('/documents/history');
    return response.data;
  },

  getDocument: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  }
};
```

### 5.6 Layout Component (src/components/common/Layout.js)
```javascript
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
```

### 5.7 Header Component (src/components/common/Header.js)
```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Анализ документов', href: '/document-review' },
    { name: 'Юридическая консультация', href: '/legal-advice' },
    { name: 'Поиск законов', href: '/law-search' },
    { name: 'Блог', href: '/blog' },
    { name: 'О нас', href: '/about' },
  ];

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LegalAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Панель управления
                </Link>
                <span className="text-sm text-gray-500">
                  Привет, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Панель управления
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

### 5.8 Home Page (src/pages/Home.js)
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  DocumentCheckIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      name: 'Анализ документов',
      description: 'ИИ анализирует ваши договоры и выявляет потенциальные риски',
      icon: DocumentCheckIcon,
      href: '/document-review'
    },
    {
      name: 'Юридическая консультация',
      description: 'Получите персональные рекомендации от ИИ-юриста',
      icon: ChatBubbleLeftRightIcon,
      href: '/legal-advice'
    },
    {
      name: 'База законов',
      description: 'Поиск и разъяснение законов Узбекистана и Центральной Азии',
      icon: BookOpenIcon,
      href: '/law-search'
    }
  ];

  const benefits = [
    {
      name: 'Безопасность',
      description: 'Защищенная обработка документов с соблюдением конфиденциальности',
      icon: ShieldCheckIcon
    },
    {
      name: 'Скорость',
      description: 'Мгновенный анализ документов вместо часов ожидания',
      icon: ClockIcon
    },
    {
      name: 'Местная экспертиза',
      description: 'Специализация на законодательстве Узбекистана и региона',
      icon: GlobeAltIcon
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">ИИ-помощник для</span>
              <span className="block text-primary-200">юридических задач</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-primary-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Анализируйте договоры, получайте юридические консультации и изучайте законы с помощью искусственного интеллекта. 
              Создано специально для бизнеса в Узбекистане и Центральной Азии.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Перейти в панель управления
                </Link>
              ) : (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Начать бесплатно
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
                    >
                      Войти
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Возможности платформы
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Все инструменты для работы с юридическими документами в одном месте
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <Link
                  to={feature.href}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Подробнее →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Почему выбирают нас
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto mb-4">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {benefit.name}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Готовы начать?</span>
            <span className="block">Попробуйте бесплатно уже сегодня.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            3 анализа документов бесплатно. Без обязательств.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
            >
              Зарегистрироваться бесплатно
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
```

## Step 6: Running the Application

### 6.1 Environment Setup
Create `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 6.2 Database Setup
Make sure MongoDB is running, then seed the database:
```bash
cd backend
npm run seed
```

### 6.3 Start Backend
```bash
cd backend
npm run dev
```

### 6.4 Start Frontend
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Step 7: Additional Pages (Create these files in src/pages/)

### 7.1 Document Review Page (src/pages/DocumentReview.js)
```javascript
import React, { useState } from 'react';
import { documentService } from '../services/documents';
import toast from 'react-hot-toast';

const DocumentReview = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const analyzeDocument = async () => {
    if (!file) {
      toast.error('Пожалуйста, выберите файл для анализа');
      return;
    }

    setLoading(true);
    try {
      const result = await documentService.analyzeDocument(file);
      setAnalysis(result.document.analysis);
      toast.success('Документ успешно проанализирован!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при анализе документа');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score) => {
    if (score >= 70) return 'bg-red-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Анализ документов с ИИ
        </h1>
        <p className="text-lg text-gray-600">
          Загрузите договор или юридический документ для анализа рисков
        </p>
      </div>

      {/* File Upload */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Загрузить документ</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {file ? file.name : 'Нажмите для выбора файла или перетащите сюда'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, TXT до 10MB
              </p># AI Legal Platform - Complete Development Guide

## Project Overview
A comprehensive AI-powered legal platform for contract review, legal advice, and law search functionality, specifically designed for Uzbekistan and Central Asia markets.

## Technology Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **File Storage**: Local file system (development)
- **AI Integration**: OpenAI API (GPT-4)
- **Document Processing**: PDF parsing libraries
- **Authentication**: JWT tokens

## Project Structure
```
legal-ai-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── database/
│   └── legal-documents/
└── README.md
```

## Prerequisites
Before starting, ensure you have:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key
- Git

## Step 1: Project Setup

### 1.1 Create Project Directory
```bash
mkdir legal-ai-platform
cd legal-ai-platform
```

### 1.2 Initialize Git Repository
```bash
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "uploads/" >> .gitignore
```

## Step 2: Backend Development

### 2.1 Create Backend Structure
```bash
mkdir backend
cd backend
npm init -y
```

### 2.2 Install Backend Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer pdf-parse docx-parser openai helmet express-rate-limit
npm install -D nodemon
```

### 2.3 Create Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legal-ai-platform
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
```

### 2.4 Server Configuration (server.js)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/legal-advice', require('./routes/legalAdvice'));
app.use('/api/laws', require('./routes/laws'));
app.use('/api/blog', require('./routes/blog'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2.5 Database Models

#### User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'professional', 'enterprise'],
    default: 'free'
  },
  documentsAnalyzed: {
    type: Number,
    default: 0
  },
  monthlyLimit: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Document Model (models/Document.js)
```javascript
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  analysis: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100
    },
    risks: [{
      type: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      description: String,
      suggestion: String,
      location: String
    }],
    summary: String,
    recommendations: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
```

#### Law Model (models/Law.js)
```javascript
const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['civil', 'criminal', 'commercial', 'labor', 'tax', 'administrative']
  },
  articleNumber: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Uzbekistan'
  },
  language: {
    type: String,
    enum: ['uzbek', 'russian', 'english'],
    default: 'uzbek'
  },
  keywords: [String],
  relatedLaws: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Law'
  }]
}, {
  timestamps: true
});

lawSchema.index({ title: 'text', content: 'text', keywords: 'text' });

module.exports = mongoose.model('Law', lawSchema);
```

#### Blog Model (models/Blog.js)
```javascript
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  category: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
```

### 2.6 API Routes

#### Authentication Routes (routes/auth.js)
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Document Analysis Routes (routes/documents.js)
```javascript
const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const Document = require('../models/Document');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upload and analyze document
router.post('/analyze', auth, upload.single('document'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Check subscription limits
    if (user.subscriptionPlan === 'free' && user.documentsAnalyzed >= user.monthlyLimit) {
      return res.status(403).json({ 
        message: 'Monthly limit exceeded. Please upgrade your subscription.' 
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from document
    let content = '';
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      content = data.text;
    } else if (file.mimetype === 'text/plain') {
      content = fs.readFileSync(file.path, 'utf8');
    }

    // Create document record
    const document = new Document({
      userId: req.user.userId,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      content: content,
      status: 'processing'
    });

    await document.save();

    // Analyze with AI
    const analysisPrompt = `
    Please analyze this legal document and provide:
    1. Risk assessment score (0-100)
    2. Identify potential risks and issues
    3. Suggest improvements
    4. Provide a summary
    
    Document content:
    ${content}
    
    Please respond in JSON format with the following structure:
    {
      "riskScore": number,
      "risks": [{"type": "high|medium|low", "description": "string", "suggestion": "string", "location": "string"}],
      "summary": "string",
      "recommendations": ["string"]
    }
    `;

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 2000,
        temperature: 0.3
      });

      const analysis = JSON.parse(aiResponse.choices[0].message.content);
      
      // Update document with analysis
      document.analysis = analysis;
      document.status = 'completed';
      await document.save();

      // Update user's document count
      user.documentsAnalyzed += 1;
      await user.save();

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      res.json({
        message: 'Document analyzed successfully',
        document: {
          id: document._id,
          fileName: document.fileName,
          analysis: document.analysis,
          status: document.status
        }
      });

    } catch (aiError) {
      document.status = 'failed';
      await document.save();
      fs.unlinkSync(file.path);
      
      res.status(500).json({ 
        message: 'AI analysis failed', 
        error: aiError.message 
      });
    }

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's documents
router.get('/history', auth, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId })
      .select('-content')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific document
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Legal Advice Routes (routes/legalAdvice.js)
```javascript
const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get legal advice
router.post('/ask', auth, async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const systemPrompt = `You are a legal advisor specializing in Uzbekistan and Central Asian law. 
    Provide helpful, accurate legal guidance while always recommending consultation with a qualified lawyer for specific cases.
    Focus on:
    - Uzbekistan legal framework
    - Central Asian business law
    - Contract law
    - Commercial regulations
    
    Always include disclaimers about seeking professional legal advice.`;

    const userPrompt = `Question: ${question}
    ${context ? `Context: ${context}` : ''}
    
    Please provide legal guidance in a clear, structured format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const advice = response.choices[0].message.content;

    res.json({
      question,
      advice,
      disclaimer: "This is general legal information and should not replace professional legal advice. Please consult with a qualified lawyer for specific legal matters."
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Laws Search Routes (routes/laws.js)
```javascript
const express = require('express');
const Law = require('../models/Law');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Search laws
router.get('/search', async (req, res) => {
  try {
    const { query, category, country = 'Uzbekistan' } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let searchCriteria = {
      country,
      $text: { $search: query }
    };

    if (category) {
      searchCriteria.category = category;
    }

    const laws = await Law.find(searchCriteria)
      .populate('relatedLaws', 'title articleNumber')
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    res.json(laws);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get law explanation
router.post('/explain/:id', async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);
    
    if (!law) {
      return res.status(404).json({ message: 'Law not found' });
    }

    const explanationPrompt = `
    Please provide a clear, simple explanation of this law:
    
    Title: ${law.title}
    Article: ${law.articleNumber}
    Content: ${law.content}
    
    Explain in simple terms:
    1. What this law means
    2. Who it applies to
    3. Key requirements or restrictions
    4. Practical implications
    5. Common scenarios where it applies
    
    Make it understandable for business owners and general public.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: explanationPrompt }],
      max_tokens: 1000,
      temperature: 0.3
    });

    const explanation = response.choices[0].message.content;

    res.json({
      law,
      explanation,
      disclaimer: "This explanation is for informational purposes only. Please consult with a legal professional for specific legal advice."
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Law.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Blog Routes (routes/blog.js)
```javascript
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    
    let query = { published: true };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single blog post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      published: true 
    }).populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const featuredPosts = await Blog.find({ 
      published: true, 
      featured: true 
    })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(3);

    res.json(featuredPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

### 2.7 Middleware

#### Authentication Middleware (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
```

### 2.8 Package.json Scripts
Update your backend package.json scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedDatabase.js"
  }
}
```

## Step 3: Frontend Development

### 3.1 Create React App
```bash
# Go back to root directory
cd ..
npx create-react-app frontend
cd frontend
```

### 3.2 Install Frontend Dependencies
```bash
npm install axios react-router-dom tailwindcss postcss autoprefixer @heroicons/react react-hot-toast
npx tailwindcss init -p
```

### 3.3 Configure Tailwind CSS
Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

### 3.4 Frontend Structure
```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Layout.js
│   │   └── LoadingSpinner.js
│   ├── auth/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── ProtectedRoute.js
│   ├── documents/
│   │   ├── DocumentUpload.js
│   │   ├── DocumentAnalysis.js
│   │   └── DocumentHistory.js
│   ├── legal/
│   │   ├── LegalAdviser.js
│   │   └── LawSearch.js
│   └── blog/
│       ├── BlogList.js
│       └── BlogPost.js
├── pages/
│   ├── Home.js
│   ├── Dashboard.js
│   ├── DocumentReview.js
│   ├── LegalAdvice.js
│   ├── LawSearch.js
│   ├── Blog.js
│   └── About.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── documents.js
├── context/
│   └── AuthContext.js
├── utils/
│   └── constants.js
└── App.js
```

## Step 4: Database Seeding

### 4.1 Create Seed Script (backend/utils/seedDatabase.js)
```javascript
const mongoose = require('mongoose');
const Law = require('../models/Law');
const Blog = require('../models/Blog');
const User = require('../models/User');
require('dotenv').config();

const seedLaws = [
  {
    title: "Гражданский кодекс Республики Узбекистан - Статья 1",
    category: "civil",
    articleNumber: "ГК-1",
    content: "Гражданское законодательство основывается на признании равенства участников регулируемых им отношений, неприкосновенности собственности, свободы договора, недопустимости произвольного вмешательства кого-либо в частные дела.",
    summary: "Основные принципы гражданского права в Узбекистане",
    keywords: ["гражданское право", "равенство", "собственность", "договор"],
    language: "russian"
  },
  {
    title: "Трудовой кодекс - Трудовой договор",
    category: "labor",
    articleNumber: "ТК-77",
    content: "Трудовой договор - соглашение между работодателем и работником, в соответствии с которым работодатель обязуется предоставить работнику работу по обусловленной трудовой функции.",
    summary: "Определение и основы трудового договора",
    keywords: ["трудовой договор", "работодатель", "работник", "трудовая функция"],
    language: "russian"
  },
  {
    title: "Закон о предпринимательстве - Регистрация бизнеса",
    category: "commercial",
    articleNumber: "ЗП-15",
    content: "Государственная регистрация субъектов предпринимательства осуществляется в порядке, установленном законодательством, и является обязательным условием для осуществления предпринимательской деятельности.",
    summary: "Требования к регистрации предпринимательской деятельности",
    keywords: ["предпринимательство", "регистрация", "бизнес", "лицензия"],
    language: "russian"
  }
];

const seedBlogs = [
  {
    title: "Основы договорного права в Узбекистане",
    slug: "osnovy-dogovornogo-prava-uzbekistan",
    content: "Подробное руководство по заключению и исполнению договоров в Узбекистане. В данной статье рассматриваются основные принципы договорного права, обязательные элементы договора, порядок заключения и расторжения договоров, а также специфика различных видов договоров в условиях узбекского законодательства.",
    excerpt: "Узнайте основы договорного права и избегайте типичных ошибок при заключении договоров",
    category: "Договорное право",
    tags: ["договор", "право", "бизнес"],
    featured: true,
    published: true
  },
  {
    title: "ИИ в юридической практике: революция или эволюция?",
    slug: "ai-legal-practice-revolution",
    content: "Искусственный интеллект меняет юридическую индустрию. Рассмотрим, как ИИ помогает в анализе документов, поиске прецедентов и автоматизации рутинных задач. Влияние на профессию юриста и перспективы развития технологий в правовой сфере.",
    excerpt: "Как искусственный интеллект трансформирует юридическую практику",
    category: "Технологии",
    tags: ["ИИ", "технологии", "автоматизация"],
    featured: false,
    published: true
  },
  {
    title: "Защита интеллектуальной собственности в Центральной Азии",
    slug: "ip-protection-central-asia",
    content: "Обзор системы защиты интеллектуальной собственности в странах Центральной Азии. Особенности патентного права, товарных знаков и авторских прав. Практические рекомендации для бизнеса.",
    excerpt: "Полное руководство по защите интеллектуальной собственности в регионе",
    category: "Интеллектуальная собственность",
    tags: ["патенты", "товарные знаки", "авторское право"],
    featured: true,
    published: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Law.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@legalai.uz',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Seed laws
    await Law.insertMany(seedLaws);
    console.log('Laws seeded successfully');

    // Seed blogs with admin as author
    const blogsWithAuthor = seedBlogs.map(blog => ({
      ...blog,
      author: adminUser._id
    }));
    await Blog.insertMany(blogsWithAuthor);
    console.log('Blogs seeded successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();