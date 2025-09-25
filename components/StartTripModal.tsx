import React from 'react';
import { XIcon, MapPinIcon, PencilIcon } from './Icons';

interface StartTripModalProps {
  onClose: () => void;
  onLiveTrack: () => void;
  onManualAdd: () => void;
}

const StartTripModal: React.FC<StartTripModalProps> = ({ onClose, onLiveTrack, onManualAdd }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-sm relative border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close">
          <XIcon />
        </button>
        <div className="p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Start a New Trip</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">How would you like to record your journey?</p>
            <div className="space-y-4">
                <button 
                    onClick={onLiveTrack}
                    className="w-full flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                    <MapPinIcon />
                    Start Live Tracking
                </button>
                <button
                    onClick={onManualAdd}
                    className="w-full flex items-center justify-center gap-3 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                    <PencilIcon />
                    Add Manual Entry
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StartTripModal;