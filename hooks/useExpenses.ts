import { useState, useEffect } from 'react';
import { Expense } from '../types';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const storedExpenses = localStorage.getItem('geo-journey-expenses');
      return storedExpenses ? JSON.parse(storedExpenses) : [];
    } catch (error) {
      console.error('Error reading expenses from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('geo-journey-expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'timestamp'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}`,
      timestamp: Date.now(),
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };
  
  const clearExpenses = () => {
    setExpenses([]);
  };

  return { expenses, addExpense, clearExpenses };
};