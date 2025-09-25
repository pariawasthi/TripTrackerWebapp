import React, { useState } from 'react';
import { Budget } from '../types';
import { XIcon } from './Icons';

interface SetBudgetModalProps {
  onClose: () => void;
  onSave: (budget: Budget) => void;
  currentBudget: Budget | null;
}

const SetBudgetModal: React.FC<SetBudgetModalProps> = ({ onClose, onSave, currentBudget }) => {
  const [amount, setAmount] = useState(currentBudget?.amount.toString() || '');
  const [currency, setCurrency] = useState(currentBudget?.currency || 'USD');
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    if (currency.trim().length === 0) {
        setError('Please enter a currency code (e.g., USD).');
        return;
    }
    onSave({ amount: numericAmount, currency: currency.toUpperCase() });
    onClose();
  };

  const inputClasses = "w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
  const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-sm relative border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close">
          <XIcon />
        </button>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Set Monthly Budget</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-grow">
                <label htmlFor="amount" className={labelClasses}>Amount</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClasses} required step="0.01" placeholder="e.g., 500" />
              </div>
              <div>
                <label htmlFor="currency" className={labelClasses}>Currency</label>
                <input type="text" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClasses} required maxLength={3} placeholder="USD" style={{ width: '6rem' }}/>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
              Save Budget
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetBudgetModal;