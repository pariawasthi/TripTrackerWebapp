import React from 'react';
import { Expense, ExpenseCategory } from '../types';
import { TicketIcon, FoodIcon, ShoppingBagIcon, BedIcon, UnknownIcon } from './Icons';

interface ExpenseCardProps {
  expense: Expense;
}

const CategoryInfo: React.FC<{ category: ExpenseCategory }> = ({ category }) => {
  const getIcon = () => {
    switch (category) {
      case ExpenseCategory.TICKET: return <TicketIcon />;
      case ExpenseCategory.FOOD: return <FoodIcon />;
      case ExpenseCategory.SHOPPING: return <ShoppingBagIcon />;
      case ExpenseCategory.ACCOMMODATION: return <BedIcon />;
      default: return <UnknownIcon />;
    }
  };
  
  const getText = () => {
      const text = category.charAt(0) + category.slice(1).toLowerCase();
      return text;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: expense.currency,
  }).format(expense.amount);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700/50 flex justify-between items-center animate-fade-in">
        <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
            <CategoryInfo category={expense.category} />
        </div>
        <div className="text-right">
            <p className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{formattedAmount}</p>
        </div>
    </div>
  );
};

export default ExpenseCard;