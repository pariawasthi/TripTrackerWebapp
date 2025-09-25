import { useState, useEffect } from 'react';

const AUTH_KEY = 'geo-journey-auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  const login = (password: string): boolean => {
    // In a real app, this would be a call to a server
    if (password === 'password') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      window.location.pathname = '/dashboard';
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    window.location.pathname = '/admin';
  };

  return { isAuthenticated, login, logout };
};