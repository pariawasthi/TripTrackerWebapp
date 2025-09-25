import React from 'react';
import { MenuIcon } from '../Icons';

interface DashboardHeaderProps {
    view: 'overview' | 'heatmap' | 'data';
    onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ view, onMenuClick }) => {
    const titles = {
        overview: 'Dashboard Overview',
        heatmap: 'Travel Density Heatmap',
        data: 'Raw Trip Data'
    };

    return (
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            <button 
                className="text-gray-400 hover:text-white md:hidden" 
                onClick={onMenuClick}
                aria-label="Open sidebar"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">{titles[view]}</h2>
            {/* Empty div to balance the flexbox on mobile, allowing the title to be properly centered */}
            <div className="w-6 h-6 md:hidden"></div>
        </header>
    );
};

export default DashboardHeader;