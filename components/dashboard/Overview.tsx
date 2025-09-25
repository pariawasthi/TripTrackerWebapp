import React from 'react';
import { Trip } from '../../types';
import ModeDistributionChart from './charts/ModeDistributionChart';
import PeakTravelTimesChart from './charts/PeakTravelTimesChart';
import TripsByDayChart from './charts/TripsByDayChart';
import { DocumentTextIcon, MapPinIcon, RouteIcon, SparklesIcon, UsersIcon } from '../Icons';
import Loader from '../Loader';

interface OverviewProps {
    trips: Trip[];
    insights: string;
    isLoadingInsights: boolean;
    insightsError: string | null;
    onGenerateInsights: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 flex items-center gap-4">
        <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
    </div>
);

const AIInsightsCard: React.FC<Omit<OverviewProps, 'trips'>> = ({ insights, isLoadingInsights, insightsError, onGenerateInsights }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><DocumentTextIcon /> AI Insights</h3>
        <div className="flex-grow flex flex-col items-center justify-center text-center min-h-[100px]">
            {isLoadingInsights && (
                <>
                    <Loader />
                    <p className="mt-2 text-cyan-400 text-sm animate-pulse">Generating analysis...</p>
                </>
            )}
            {insightsError && <p className="text-red-400 text-sm">{insightsError}</p>}
            {insights && <p className="text-gray-300 text-sm whitespace-pre-wrap">{insights}</p>}
        </div>
        <button
            onClick={onGenerateInsights}
            disabled={isLoadingInsights}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors disabled:bg-gray-600"
        >
            {isLoadingInsights ? 'Analyzing...' : <><SparklesIcon /> Generate Insights</>}
        </button>
    </div>
);

const Overview: React.FC<OverviewProps> = (props) => {
    const { trips } = props;

    const totalDistance = trips.reduce((acc, trip) => {
        if (trip.path.length > 1) {
            let tripDistance = 0;
            for (let i = 0; i < trip.path.length - 1; i++) {
                const p1 = trip.path[i];
                const p2 = trip.path[i+1];
                const R = 6371; // Radius of the Earth in km
                const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
                const dLon = (p2.lng - p1.lng) * (Math.PI / 180);
                const a = 
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(p1.lat * (Math.PI / 180)) * Math.cos(p2.lat * (Math.PI / 180)) * 
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = R * c; // Distance in km
                tripDistance += d;
            }
            return acc + tripDistance;
        }
        return acc;
    }, 0);

    const totalCompanions = trips.reduce((acc, trip) => acc + (trip.companions || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Trips" value={trips.length} icon={<MapPinIcon />} />
                <StatCard title="Total Distance" value={`${totalDistance.toFixed(1)} km`} icon={<RouteIcon />} />
                <StatCard title="Total Companions" value={totalCompanions} icon={<UsersIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Transport Mode Distribution">
                    <ModeDistributionChart trips={trips} />
                </ChartCard>
                <ChartCard title="Peak Travel Times (By Hour)">
                    <PeakTravelTimesChart trips={trips} />
                </ChartCard>
                <ChartCard title="Trips by Day of the Week">
                    <TripsByDayChart trips={trips} />
                </ChartCard>
                <AIInsightsCard {...props} />
            </div>
        </div>
    );
};

export default Overview;
