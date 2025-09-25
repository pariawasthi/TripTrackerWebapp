import React from 'react';
import { ChartBarIcon, FireIcon, TableIcon, XIcon, LogoutIcon } from '../Icons';
import { useAuth } from '../../hooks/useAuth';

type DashboardView = 'overview' | 'heatmap' | 'data';

interface SidebarProps {
    currentView: DashboardView;
    setView: (view: DashboardView) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
    view: DashboardView;
    label: string;
    currentView: DashboardView;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ view, label, currentView, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left transition-colors duration-200 rounded-lg ${
            currentView === view
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {children}
        <span className="ml-3">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
    const { logout } = useAuth();
    
    const handleSetView = (view: DashboardView) => {
        setView(view);
        setIsOpen(false); // Close sidebar on selection in mobile
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div 
                className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col z-40 transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-white">
                        NATPAC <span className="text-cyan-400">Portal</span>
                    </h1>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
                        <XIcon />
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavItem view="overview" label="Overview" currentView={currentView} onClick={() => handleSetView('overview')}>
                        <ChartBarIcon />
                    </NavItem>
                    <NavItem view="heatmap" label="Travel Heatmap" currentView={currentView} onClick={() => handleSetView('heatmap')}>
                        <FireIcon />
                    </NavItem>
                    <NavItem view="data" label="Raw Data" currentView={currentView} onClick={() => handleSetView('data')}>
                        <TableIcon />
                    </NavItem>
                </nav>
                <div className="px-4 py-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-700 hover:text-white"
                    >
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;