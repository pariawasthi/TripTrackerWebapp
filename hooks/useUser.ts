import { useState, useEffect } from 'react';

const USER_ID_KEY = 'geo-journey-user-id';

export const useUser = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      let storedId = localStorage.getItem(USER_ID_KEY);
      if (!storedId) {
        storedId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem(USER_ID_KEY, storedId);
      }
      setUserId(storedId);
    } catch (error) {
      console.error('Error accessing localStorage for user ID:', error);
      // Fallback for environments where localStorage is disabled
      setUserId('user-anonymous');
    }
  }, []);

  return { userId };
};