import React, { useState } from 'react';
import { Trip, Expense, Suggestion } from '../types';
import { getTripSuggestions } from '../services/geminiService';
import Loader from './Loader';
import SuggestionCard from './SuggestionCard';
import { LightbulbIcon, SparklesIcon } from './Icons';
import { demoSuggestions } from '../utils/demoData';

interface SuggestionsProps {
    trips: Trip[];
    expenses: Expense[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ trips, expenses }) => {
    const hasUserData = trips.length > 0 && !trips[0]?.id.startsWith('demo-');

    const [suggestions, setSuggestions] = useState<Suggestion[]>(demoSuggestions);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setHasGenerated(true);
        try {
            const result = await getTripSuggestions(trips, expenses);

            // ✅ Combine new suggestions with demo ones
            setSuggestions((prev) => [...demoSuggestions, ...(result || [])]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    <LightbulbIcon /> {hasUserData ? 'AI Trip Suggestions' : 'Trip Ideas For You'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    {hasUserData ? 'Get personalized travel ideas based on your history.' : 'Here are some curated ideas to get you started.'}
                </p>
            </div>

            {hasUserData && !hasGenerated && (
                <div className="text-center p-8">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto disabled:bg-gray-600 shadow-lg shadow-cyan-500/30"
                    >
                        {isLoading ? 'Generating...' : <><SparklesIcon /> Generate My Suggestions</>}
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <Loader />
                    <p className="mt-4 text-cyan-500 dark:text-cyan-400 animate-pulse">Analyzing your journeys...</p>
                </div>
            )}

            {hasUserData && error && (
                <p className="text-lg text-red-500 dark:text-red-400 max-w-md mx-auto text-center mb-4">{error}</p>
            )}

            {suggestions.length > 0 && !isLoading && (
                <div className="space-y-4">
                    {suggestions.map((s, index) => (
                        <SuggestionCard key={index} suggestion={s} />
                    ))}
                </div>
            )}

            {hasUserData && !isLoading && hasGenerated && suggestions.length === demoSuggestions.length && !error && (
                <div className="text-center py-16 px-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No additional suggestions could be generated.</p>
                    <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">Try adding more trips or expenses for better recommendations.</p>
                </div>
            )}
        </div>
    );
};

export default Suggestions;
