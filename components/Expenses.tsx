import React, { useState, useMemo } from 'react';
import { Expense, Trip, Budget } from '../types';
import ExpenseCard from './ExpenseCard';
import AddExpense from './AddExpense';
import { PlusIcon, TrashIcon, TrendingUpIcon } from './Icons';
import { formatDate } from '../utils/formatters';
import { useBudget } from '../hooks/useBudget';
import SetBudgetModal from './SetBudgetModal';

interface ExpensesProps {
  expenses: Expense[];
  trips: Trip[];
  addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  clearExpenses: () => void;
}

const ExpenseSummary: React.FC<{ expenses: Expense[]; budget: Budget | null; onSetBudget: () => void; }> = ({ expenses, budget, onSetBudget }) => {
    const totalExpensesByCurrency = useMemo(() => {
        return expenses.reduce((acc, expense) => {
            if (!acc[expense.currency]) {
                acc[expense.currency] = 0;
            }
            acc[expense.currency] += expense.amount;
            return acc;
        }, {} as { [currency: string]: number });
    }, [expenses]);

    const budgetProgress = budget ? (totalExpensesByCurrency[budget.currency] || 0) / budget.amount : 0;
    const progressPercentage = Math.min(budgetProgress * 100, 100);
    const isOverBudget = budgetProgress > 1;

    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><TrendingUpIcon /> Expense Summary</h3>
            
            {Object.keys(totalExpensesByCurrency).length > 0 ? (
                <div className="mb-4 space-y-1">
                    {/* FIX: Replaced Object.entries with Object.keys to ensure type safety for the 'total' amount. */}
                    {Object.keys(totalExpensesByCurrency).map((currency) => (
                        <p key={currency} className="text-gray-700 dark:text-gray-300">
                            Total Spent: <span className="font-bold text-cyan-600 dark:text-cyan-400">{new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(totalExpensesByCurrency[currency])}</span>
                        </p>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No expenses logged yet.</p>
            )}

            {budget ? (
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Budget</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{new Intl.NumberFormat(undefined, { style: 'currency', currency: budget.currency }).format(budget.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-cyan-500'}`} 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                     {isOverBudget && <p className="text-xs text-red-500 dark:text-red-400 mt-1 text-right">You've exceeded your budget!</p>}
                </div>
            ) : (
                <button onClick={onSetBudget} className="w-full text-sm text-cyan-600 dark:text-cyan-400 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
                    Set a budget to track spending
                </button>
            )}
        </div>
    );
};

const Expenses: React.FC<ExpensesProps> = ({ expenses, trips, addExpense, clearExpenses }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const { budget, saveBudget } = useBudget();

  const groupedExpenses = useMemo(() => {
    const groups: { [key: string]: Expense[] } = { 'general': [] };
    trips.forEach(trip => {
        groups[trip.id] = [];
    });
    expenses.forEach(expense => {
      if (expense.tripId && groups[expense.tripId]) {
        groups[expense.tripId].push(expense);
      } else {
        groups['general'].push(expense);
      }
    });
    return groups;
  }, [expenses, trips]);

  const tripMap = useMemo(() => {
    const map = new Map<string, Trip>();
    trips.forEach(trip => map.set(trip.id, trip));
    return map;
  }, [trips]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Tracker</h2>
        <div className="flex items-center gap-2">
            {expenses.length > 0 && (
                <button 
                    onClick={clearExpenses} 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 dark:text-red-400 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
                >
                    <TrashIcon />
                    <span>Clear All</span>
                </button>
            )}
            <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-500/20 rounded-md hover:bg-cyan-500/30 transition-colors"
            >
            <PlusIcon />
            <span>Add Expense</span>
            </button>
        </div>
      </div>

      <ExpenseSummary expenses={expenses} budget={budget} onSetBudget={() => setIsBudgetModalOpen(true)} />

      {expenses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
          <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">Click 'Add Expense' to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
            {Object.keys(groupedExpenses).map(tripId => {
                const associatedTrip = tripMap.get(tripId);
                const currentExpenses = groupedExpenses[tripId];
                if (currentExpenses.length === 0) return null;

                return (
                    <div key={tripId}>
                        <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                            {associatedTrip ? `Trip on ${formatDate(associatedTrip.startTime)}` : 'General Expenses'}
                        </h3>
                        <div className="space-y-3">
                            {currentExpenses.map(expense => (
                                <ExpenseCard key={expense.id} expense={expense} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      )}

      {isBudgetModalOpen && (
        <SetBudgetModal
            onClose={() => setIsBudgetModalOpen(false)}
            onSave={saveBudget}
            currentBudget={budget}
        />
      )}

      {isAddModalOpen && (
        <AddExpense
          onClose={() => setIsAddModalOpen(false)}
          addExpense={addExpense}
          trips={trips}
        />
      )}
    </div>
  );
};

export default Expenses;