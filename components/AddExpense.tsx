import React, { useState } from 'react';
import { Expense, ExpenseCategory, Trip } from '../types';
import { detectExpenseFromText } from '../services/geminiService';
import { XIcon, SparklesIcon } from './Icons';
import Loader from './Loader';
import { formatDate } from '../utils/formatters';

interface AddExpenseProps {
  onClose: () => void;
  addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  trips: Trip[];
}

type Tab = 'manual' | 'ai';

const AddExpense: React.FC<AddExpenseProps> = ({ onClose, addExpense, trips }) => {
  const [activeTab, setActiveTab] = useState<Tab>('manual');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.OTHER);
  const [tripId, setTripId] = useState<string>('');
  
  const [aiText, setAiText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
        setError("Description and amount are required.");
        return;
    }
    addExpense({
      description,
      amount: parseFloat(amount),
      currency,
      category,
      tripId: tripId || undefined,
    });
    onClose();
  };

  const handleDetect = async () => {
    if (!aiText.trim()) {
      setError("Please paste some text to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const detected = await detectExpenseFromText(aiText);
      setDescription(detected.description);
      setAmount(detected.amount.toString());
      setCurrency(detected.currency);
      setCategory(detected.category);
      setActiveTab('manual'); // Switch to manual tab to review and save
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputClasses = "w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
  const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1";

  const TabButton: React.FC<{tab: Tab, label: string, children?: React.ReactNode}> = ({tab, label, children}) => (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 rounded-t-md transition-colors ${activeTab === tab ? 'bg-gray-100 dark:bg-gray-700 text-cyan-500 dark:text-cyan-400' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}
      >
        {children} {label}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-md relative border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close">
          <XIcon />
        </button>

        <div className="flex">
            <TabButton tab="manual" label="Manual Entry" />
            <TabButton tab="ai" label="Detect with AI"><SparklesIcon /></TabButton>
        </div>
        
        <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-b-lg">
            {activeTab === 'manual' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className={labelClasses}>Description</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClasses} required />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-grow">
                            <label htmlFor="amount" className={labelClasses}>Amount</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClasses} required step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="currency" className={labelClasses}>Currency</label>
                            <input type="text" id="currency" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className={inputClasses} maxLength={3} style={{width: '5rem'}}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className={labelClasses}>Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className={inputClasses}>
                            {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="tripId" className={labelClasses}>Link to Trip (Optional)</label>
                        <select id="tripId" value={tripId} onChange={(e) => setTripId(e.target.value)} className={inputClasses}>
                            <option value="">No linked trip</option>
                            {trips.map(trip => <option key={trip.id} value={trip.id}>Trip on {formatDate(trip.startTime)}</option>)}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Save Expense
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="ai-text" className={labelClasses}>Paste confirmation text</label>
                        <textarea 
                            id="ai-text" 
                            rows={5} 
                            value={aiText} 
                            onChange={(e) => setAiText(e.target.value)} 
                            className={inputClasses}
                            placeholder="e.g., Your payment of $12.50 for a train ticket was successful."
                        />
                    </div>
                     {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                    <button 
                        type="button" 
                        onClick={handleDetect} 
                        disabled={isLoading}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-500 dark:disabled:bg-gray-600"
                    >
                        {isLoading ? <Loader /> : <><SparklesIcon /> Detect Expense Details</>}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddExpense;