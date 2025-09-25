import React, { useState } from 'react';
import { Trip, TransportMode } from '../types';
import { XIcon } from './Icons';

interface ManualTripFormProps {
  onClose: () => void;
  addTrip: (trip: Trip) => void;
}

const ManualTripForm: React.FC<ManualTripFormProps> = ({ onClose, addTrip }) => {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [mode, setMode] = useState<TransportMode>(TransportMode.DRIVING);
  const [companions, setCompanions] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originAddress || !destinationAddress || !startTime || !endTime) {
      setError("Please fill out all required fields.");
      return;
    }

    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = new Date(endTime).getTime();

    if (startTimestamp >= endTimestamp) {
        setError("End time must be after start time.");
        return;
    }

    const newTrip: Trip = {
      id: `manual-trip-${Date.now()}`,
      startTime: startTimestamp,
      endTime: endTimestamp,
      originAddress,
      destinationAddress,
      mode,
      path: [], // No path for manual trips
      origin: { lat: 0, lng: 0, timestamp: startTimestamp }, // Dummy data
      destination: { lat: 0, lng: 0, timestamp: endTimestamp }, // Dummy data
      companions: companions ? parseInt(companions, 10) : 0,
    };

    addTrip(newTrip);
    onClose();
  };

  const inputClasses = "w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
  const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-md relative border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Close">
          <XIcon />
        </button>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white p-6 pb-0">Add Manual Trip</h3>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="origin" className={labelClasses}>Origin</label>
            <input type="text" id="origin" value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} className={inputClasses} required placeholder="e.g., Main Street Park" />
          </div>
          <div>
            <label htmlFor="destination" className={labelClasses}>Destination</label>
            <input type="text" id="destination" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} className={inputClasses} required placeholder="e.g., City Center Library" />
          </div>
          <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="start-time" className={labelClasses}>Start Time</label>
                <input type="datetime-local" id="start-time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClasses} required />
              </div>
              <div className="flex-1">
                <label htmlFor="end-time" className={labelClasses}>End Time</label>
                <input type="datetime-local" id="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClasses} required />
              </div>
          </div>
           <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="mode" className={labelClasses}>Transport Mode</label>
              <select id="mode" value={mode} onChange={(e) => setMode(e.target.value as TransportMode)} className={inputClasses}>
                {Object.values(TransportMode).filter(m => m !== TransportMode.UNKNOWN).map(cat => <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div className="w-1/3">
              <label htmlFor="companions" className={labelClasses}>Companions</label>
              <input type="number" id="companions" value={companions} onChange={(e) => setCompanions(e.target.value)} className={inputClasses} min="0" placeholder="0" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Save Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualTripForm;