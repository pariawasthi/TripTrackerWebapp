import React, { useState, useMemo } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Overview from '../components/dashboard/Overview';
import HeatmapView from '../components/dashboard/HeatmapView';
import DataTable from '../components/dashboard/DataTable';
import { useTrips } from '../hooks/useTrips';
import { getDashboardInsights } from '../services/geminiService';
import { demoTrips } from '../utils/demoData';

type DashboardView = 'overview' | 'heatmap' | 'data';

const Dashboard: React.FC = () => {
    const [view, setView] = useState<DashboardView>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { trips: userTrips } = useTrips();
    const [insights, setInsights] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [insightsError, setInsightsError] = useState<string | null>(null);

    const trips = useMemo(() => {
        return userTrips.length > 0 ? userTrips : demoTrips;
    }, [userTrips]);

    const handleGenerateInsights = async () => {
        setIsLoadingInsights(true);
        setInsightsError(null);
        setInsights('');
        try {
            const result = await getDashboardInsights(trips);
            setInsights(result);
        } catch (err) {
            setInsightsError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoadingInsights(false);
        }
    };

    const renderView = () => {
        switch (view) {
            case 'heatmap':
                return <HeatmapView trips={trips} />;
            case 'data':
                return <DataTable trips={trips} />;
            case 'overview':
            default:
                return (
                    <Overview 
                        trips={trips}
                        insights={insights}
                        isLoadingInsights={isLoadingInsights}
                        insightsError={insightsError}
                        onGenerateInsights={handleGenerateInsights}
                    />
                );
        }
    };
    
    return (
        <div className="relative min-h-screen md:flex font-sans admin-dashboard">
            <Sidebar 
                currentView={view} 
                setView={setView} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader view={view} onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;