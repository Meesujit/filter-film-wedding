'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, users, credentials } from '../../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
  isTeam: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string) => {
    // Check credentials against mock data
    const credentialEntries = Object.entries(credentials);
    
    for (const [role, creds] of credentialEntries) {
      if (creds.email === email && creds.password === password) {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          return { success: true };
        }
      }
    }
    
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    isTeam: user?.role === 'team',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
