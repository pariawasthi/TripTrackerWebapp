import React from 'react';
import { Suggestion, TransportMode } from '../types';
import { CarIcon, BikeIcon, WalkIcon, TransitIcon, UnknownIcon, MapPinIcon, WalletIcon } from './Icons';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const TransportInfo: React.FC<{ mode: TransportMode | string }> = ({ mode }) => {
    const getIcon = () => {
      switch (mode) {
        case TransportMode.DRIVING: return <CarIcon />;
        case TransportMode.BIKING: return <BikeIcon />;
        case TransportMode.WALKING: return <WalkIcon />;
        case TransportMode.TRANSIT: return <TransitIcon />;
        case "MULTIPLE": return <MapPinIcon />;
        default: return <UnknownIcon />;
      }
    };
  
    const getText = () => {
        if (Object.values(TransportMode).includes(mode as TransportMode)) {
            const str = mode as string;
            return str.charAt(0) + str.slice(1).toLowerCase();
        }
        return mode.charAt(0) + mode.slice(1).toLowerCase();
    }
  
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
        {getIcon()}
        <span>{getText()}</span>
      </div>
    );
};

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700/50 animate-fade-in flex flex-col overflow-hidden">
        <img src={suggestion.imageUrl} alt={suggestion.title} className="w-full h-40 object-cover" />
        
        <div className="p-4 space-y-3 flex-grow flex flex-col">
            <div>
                <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{suggestion.title}</h3>
                <div className="flex justify-between items-baseline mt-1">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 text-sm">
                        <WalletIcon className="h-4 w-4" /> {suggestion.estimatedBudget}
                    </p>
                    <TransportInfo mode={suggestion.transportMode} />
                </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow">{suggestion.description}</p>
            
            {suggestion.budgetDetails && suggestion.budgetDetails.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Budget Breakdown:</h4>
                    <ul className="space-y-1 text-sm">
                        {suggestion.budgetDetails.map((detail, index) => (
                            <li key={index} className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                <span>{detail.item}</span>
                                <span className="font-medium">{detail.cost}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="bg-gray-100 dark:bg-gray-900/50 p-2 rounded-md mt-auto">
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-500 mb-1">Why you might like it:</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">{suggestion.reason}</p>
            </div>
        </div>
    </div>
  );
};

export default SuggestionCard;