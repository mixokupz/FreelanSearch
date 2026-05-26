
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../api/authService';

interface AuthUser {
  userId: string;
  status: string;
}

interface AuthContextType {
  user: AuthUser | null;
  signIn: (params: Parameters<typeof authService.login>[0]) => Promise<AuthUser>;
  signUp: (params: { email: string; password?: string; fullName: string }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signIn = async (params: Parameters<typeof authService.login>[0]) => {
    const res = await authService.login(params);
    const userData: AuthUser = {
      userId: res.data.userId,
      status: res.data.status,

    };
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signUp = async ({ email, password, fullName }: { email: string; password?: string; fullName: string }) => {
    // Маппим fullName из формы в name для API
    const res = await authService.register({ email, password, name: fullName });
    const userData: AuthUser = {
      userId: res.data.userId,
      status: res.data.status,

    };

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}