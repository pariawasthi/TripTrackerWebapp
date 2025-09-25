import React, { useState } from 'react';
import { Coordinates, Weather, RouteSuggestion as RouteSuggestionType, TransportMode } from '../types';
import { getRouteSuggestion } from '../services/geminiService';
import { LocationMarkerIcon, PaperAirplaneIcon, SparklesIcon, CarIcon, BikeIcon, WalkIcon, TransitIcon, UnknownIcon } from './Icons';
import Loader from './Loader';

interface RouteSuggestionProps {
  origin: Coordinates | null;
  weather: Weather | null;
}

const TransportInfo: React.FC<{ mode: TransportMode | string }> = ({ mode }) => {
    const getIcon = () => {
      switch (mode) {
        case TransportMode.DRIVING: return <CarIcon />;
        case TransportMode.BIKING: return <BikeIcon />;
        case TransportMode.WALKING: return <WalkIcon />;
        case TransportMode.TRANSIT: return <TransitIcon />;
        default: return <UnknownIcon />;
      }
    };
    const text = typeof mode === 'string' ? mode.charAt(0) + mode.slice(1).toLowerCase() : 'Unknown';
    return (
      <div className="flex items-center gap-2 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 px-3 py-1">
        {getIcon()}
        <span>{text}</span>
      </div>
    );
};

const RouteSuggestion: React.FC<RouteSuggestionProps> = ({ origin, weather }) => {
  const [destination, setDestination] = useState('');
  const [suggestion, setSuggestion] = useState<RouteSuggestionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (!destination.trim() || !origin || !weather) {
      setError("Please enter a destination and ensure location/weather are available.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await getRouteSuggestion(origin, destination, weather);
      setSuggestion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><SparklesIcon /> AI Route Planner</h3>
      
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <LocationMarkerIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter your destination..."
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>
        <button
          onClick={handleSuggest}
          disabled={isLoading || !origin || !weather}
          className="p-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center"
          aria-label="Get Suggestion"
        >
          {isLoading ? <Loader className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" /> : <PaperAirplaneIcon />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

      {suggestion && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700/50 animate-fade-in space-y-2">
            <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-900 dark:text-white">Suggested Route:</p>
                <TransportInfo mode={suggestion.mode} />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.routeDescription}</p>
            <div className="bg-gray-100 dark:bg-gray-900/50 p-2 rounded-md">
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-500 mb-1">Reasoning:</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">{suggestion.reason}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default RouteSuggestion;