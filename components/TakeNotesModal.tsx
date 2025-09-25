import React from 'react';
import { XIcon } from './Icons';

interface TakeNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const TakeNotesModal: React.FC<TakeNotesModalProps> = ({ isOpen, onClose, notes, onNotesChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-md relative border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close">
          <XIcon />
        </button>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trip Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={6}
            className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="Add any details about your trip..."
          />
          <button
            onClick={onClose}
            className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeNotesModal;