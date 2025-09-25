import React from 'react';
import { XIcon } from '../Icons';

interface DeleteDataModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDataModal: React.FC<DeleteDataModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-red-500/10 w-full max-w-sm relative border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close">
          <XIcon />
        </button>
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-red-500 dark:text-red-400 mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            This action is irreversible. All of your trip, expense, and budget data will be permanently deleted.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDataModal;