import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptionPlan: string;
  documentsAnalyzed: number;
  monthlyLimit: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd validate the token with your backend
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        subscriptionPlan: 'free',
        documentsAnalyzed: 1,
        monthlyLimit: 3
      };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call your backend
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: 'user',
      subscriptionPlan: 'free',
      documentsAnalyzed: 1,
      monthlyLimit: 3
    };
    setUser(mockUser);
    localStorage.setItem('token', 'mock-token');
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock register - in real app, this would call your backend
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
      role: 'user',
      subscriptionPlan: 'free',
      documentsAnalyzed: 0,
      monthlyLimit: 3
    };
    setUser(mockUser);
    localStorage.setItem('token', 'mock-token');
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