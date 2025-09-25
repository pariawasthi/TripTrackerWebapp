import React from 'react';
import { Trip } from '../types';
import TripCard from './TripCard';
import { TrashIcon } from './Icons';

interface HistoryProps {
  trips: Trip[];
  clearTrips: () => void;
  onSelectTrip: (trip: Trip) => void;
}

const History: React.FC<HistoryProps> = ({ trips, clearTrips, onSelectTrip }) => {
  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trip History</h2>
            {trips.length > 0 && (
                <button 
                    onClick={clearTrips} 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 dark:text-red-400 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
                >
                    <TrashIcon />
                    Clear All
                </button>
            )}
        </div>
      
      {trips.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No trips recorded yet.</p>
          <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">Start a trip on the Tracker screen to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onSelectTrip={onSelectTrip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;