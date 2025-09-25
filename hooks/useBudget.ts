import { useState, useEffect } from 'react';
import { Budget } from '../types';

export const useBudget = () => {
  const [budget, setBudget] = useState<Budget | null>(() => {
    try {
      const storedBudget = localStorage.getItem('geo-journey-budget');
      return storedBudget ? JSON.parse(storedBudget) : null;
    } catch (error) {
      console.error('Error reading budget from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (budget) {
        localStorage.setItem('geo-journey-budget', JSON.stringify(budget));
      } else {
        localStorage.removeItem('geo-journey-budget');
      }
    } catch (error) {
      console.error('Error saving budget to localStorage:', error);
    }
  }, [budget]);

  const saveBudget = (newBudget: Budget) => {
    setBudget(newBudget);
  };

  const clearBudget = () => {
    setBudget(null);
  }

  return { budget, saveBudget, clearBudget };
};
