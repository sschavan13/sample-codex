import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { config } from '../config';

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  authEnabled: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'linklens.token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!config.enableAuth) {
      return;
    }
    const cachedToken = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (cachedToken) {
      setToken(cachedToken);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const login = (nextToken: string) => {
      setToken(nextToken);
      if (config.enableAuth && typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, nextToken);
      }
    };

    const logout = () => {
      setToken(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    };

    return {
      token,
      login,
      logout,
      isAuthenticated: Boolean(token),
      authEnabled: config.enableAuth,
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
