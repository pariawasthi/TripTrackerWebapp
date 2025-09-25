import React from 'react';
import { Trip, TransportMode } from '../types';
import { formatDate, formatDuration } from '../utils/formatters';
import { CarIcon, BikeIcon, WalkIcon, TransitIcon, UnknownIcon, UsersIcon } from './Icons';

interface TripCardProps {
  trip: Trip;
  onSelectTrip: (trip: Trip) => void;
}

const TransportInfo: React.FC<{ mode: TransportMode }> = ({ mode }) => {
  const getIcon = () => {
    switch (mode) {
      case TransportMode.DRIVING:
        return <CarIcon />;
      case TransportMode.BIKING:
        return <BikeIcon />;
      case TransportMode.WALKING:
        return <WalkIcon />;
      case TransportMode.TRANSIT:
        return <TransitIcon />;
      default:
        return <UnknownIcon />;
    }
  };

  const getText = () => {
      switch (mode) {
        case TransportMode.DRIVING: return 'Driving';
        case TransportMode.BIKING: return 'Biking';
        case TransportMode.WALKING: return 'Walking';
        case TransportMode.TRANSIT: return 'Transit';
        default: return 'Unknown';
      }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
};

const TripCard: React.FC<TripCardProps> = ({ trip, onSelectTrip }) => {
  const duration = trip.endTime - trip.startTime;
  const isManualTrip = trip.path.length === 0;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700/50 transition-all duration-300 ${!isManualTrip ? 'hover:border-cyan-500/50 hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer' : ''}`}
      onClick={isManualTrip ? undefined : () => onSelectTrip(trip)}
      role={isManualTrip ? 'listitem' : 'button'}
      tabIndex={isManualTrip ? -1 : 0}
      aria-label={`View details for trip on ${formatDate(trip.startTime)}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          {isManualTrip ? (
             <p className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
              {trip.originAddress || 'Manual Trip'} <span className="text-gray-500 dark:text-gray-400 font-normal">to</span> {trip.destinationAddress || 'Unknown'}
            </p>
          ) : (
             <p className="font-bold text-lg text-gray-900 dark:text-white">Trip on {formatDate(trip.startTime)}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Duration: <span className="font-medium text-gray-700 dark:text-gray-300">{formatDuration(duration)}</span>
          </p>
           {(trip.companions ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <UsersIcon />
                <span>{trip.companions} Companion{trip.companions! > 1 ? 's' : ''}</span>
            </div>
           )}
        </div>
        <TransportInfo mode={trip.mode} />
      </div>

      {trip.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{trip.notes}</p>
        </div>
      )}
    </div>
  );
};

export default TripCard;