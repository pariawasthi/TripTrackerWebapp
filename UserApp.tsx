import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Tracker from './components/Tracker';
import History from './components/History';
import MapView from './components/MapView';
import Expenses from './components/Expenses';
import Suggestions from './components/Suggestions';
import Profile from './components/Profile';
import { useTrips } from './hooks/useTrips';
import { useExpenses } from './hooks/useExpenses';
import { useBudget } from './hooks/useBudget';
import { HistoryIcon, MapPinIcon, WalletIcon, LightbulbIcon, UserCircleIcon, DashboardIcon, MoonIcon, SunIcon } from './components/Icons';
import { Trip } from './types';

import { demoTrips, demoExpenses } from './utils/demoData';

type View = 'tracker' | 'history' | 'expenses' | 'suggestions' | 'profile';

const UserApp: React.FC = () => {
  const [view, setView] = useState<View>('tracker');
  const { trips: userTrips, addTrip, clearTrips } = useTrips();
  const { expenses: userExpenses, addExpense, clearExpenses } = useExpenses();
  const { clearBudget } = useBudget();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  

  const displayTrips = useMemo(() => {
    return userTrips.length > 0 ? userTrips : demoTrips;
  }, [userTrips]);

  const displayExpenses = useMemo(() => {
    return userExpenses.length > 0 ? userExpenses : demoExpenses;
  }, [userExpenses]);

  const handleClearAllData = () => {
    clearTrips();
    clearExpenses();
    clearBudget();
    setView('tracker');
  };

  const NavButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-xs font-medium transition-colors duration-300 flex flex-col items-center justify-center gap-1 ${
        active 
        ? 'text-cyan-500 dark:text-cyan-400' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans flex flex-col text-gray-800 dark:text-gray-200">
      <header className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-gray-200/10 dark:shadow-cyan-500/10 sticky top-0 z-10 flex items-center">
        <div className="flex-1">
            {/* Left side spacer */}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">
          Trip<span className="text-cyan-500 dark:text-cyan-400">Tracker</span>
        </h1>
        <div className="flex-1 flex justify-end items-center gap-4">
<Link
  to="/dashboard"
  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 transition-colors"
>              <DashboardIcon />
              <span>Dashboard</span>
          </Link>
          
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-6">
        {view === 'tracker' && <Tracker addTrip={addTrip} />}
        {view === 'history' && <History trips={displayTrips} clearTrips={clearTrips} onSelectTrip={setSelectedTrip} />}
        {view === 'expenses' && <Expenses expenses={displayExpenses} trips={displayTrips} addExpense={addExpense} clearExpenses={clearExpenses} />}
        {view === 'suggestions' && <Suggestions trips={displayTrips} expenses={displayExpenses} />}
        {view === 'profile' && <Profile onClearAllData={handleClearAllData} />}
      </main>

      <footer className="sticky bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex justify-around">
          <NavButton active={view === 'tracker'} onClick={() => setView('tracker')}>
            <MapPinIcon />
            <span>Tracker</span>
          </NavButton>
          <NavButton active={view === 'history'} onClick={() => setView('history')}>
            <HistoryIcon />
            <span>History</span>
          </NavButton>
          <NavButton active={view === 'expenses'} onClick={() => setView('expenses')}>
            <WalletIcon />
            <span>Expenses</span>
          </NavButton>
          <NavButton active={view === 'suggestions'} onClick={() => setView('suggestions')}>
            <LightbulbIcon />
            <span>Suggestions</span>
          </NavButton>
           <NavButton active={view === 'profile'} onClick={() => setView('profile')}>
            <UserCircleIcon />
            <span>Profile</span>
          </NavButton>
        </nav>
      </footer>
      
      {selectedTrip && <MapView trip={selectedTrip} onClose={() => setSelectedTrip(null)} />}
    </div>
  );
};

export default UserApp;