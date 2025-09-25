import React from 'react';
import { Weather } from '../types';
import { SunIcon, CloudIcon, RainIcon } from './Icons';
import Loader from './Loader';

interface WeatherDisplayProps {
  weather: Weather | null;
  isLoading: boolean;
  error: string | null;
}

const WeatherIcon: React.FC<{ condition: Weather['condition'] }> = ({ condition }) => {
  switch (condition) {
    case 'Sunny':
      return <SunIcon />;
    case 'Cloudy':
      return <CloudIcon />;
    case 'Rainy':
      return <RainIcon />;
    default:
      return null;
  }
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, isLoading, error }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700/50 flex items-center justify-center text-center min-h-[60px]">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader />
          <span>Fetching weather...</span>
        </div>
      )}
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      {weather && !isLoading && (
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="text-yellow-400">
            <WeatherIcon condition={weather.condition} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{weather.temperature}°C</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{weather.condition}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;