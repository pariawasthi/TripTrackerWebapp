import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { BellIcon, CrosshairsIcon, ShieldCheckIcon, TrashIcon, UserCircleIcon } from './Icons';
import LiveLocationMap from './profile/LiveLocationMap';
import DeleteDataModal from './profile/DeleteDataModal';

interface ProfileProps {
    onClearAllData: () => void;
}

const ProfileCard: React.FC<{ children: React.ReactNode, title: string, icon: React.ReactNode }> = ({ children, title, icon }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            {icon}
            <span>{title}</span>
        </h3>
        {children}
    </div>
);

const Profile: React.FC<ProfileProps> = ({ onClearAllData }) => {
    const { userId } = useUser();
    const [showLocation, setShowLocation] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSosClick = () => {
        alert("Emergency SOS Activated!\n\nIn a real application, this would contact emergency services with your current location.");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Profile & Settings</h2>

            <ProfileCard title="Anonymous User ID" icon={<UserCircleIcon />}>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your journeys are linked to this anonymous ID to protect your privacy.</p>
                <p className="mt-2 text-center font-mono text-cyan-600 dark:text-cyan-400 bg-gray-100 dark:bg-gray-900 p-2 rounded-md break-all">{userId || 'Loading...'}</p>
            </ProfileCard>

            <ProfileCard title="Emergency SOS" icon={<BellIcon />}>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Press and hold in case of an emergency.</p>
                <button 
                    onClick={handleSosClick}
                    className="w-full py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <BellIcon />
                    ACTIVATE SOS
                </button>
            </ProfileCard>

            <ProfileCard title="Live Location" icon={<CrosshairsIcon />}>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">View your current location on the map.</p>
                <button
                    onClick={() => setShowLocation(prev => !prev)}
                    className="w-full text-sm text-cyan-600 dark:text-cyan-400 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                >
                    {showLocation ? 'Hide My Location' : 'Show My Location'}
                </button>
                {showLocation && <LiveLocationMap />}
            </ProfileCard>

            <ProfileCard title="Privacy" icon={<ShieldCheckIcon />}>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your location and trip data are stored securely on your device and are never shared without your explicit consent.
                    Our AI features process data anonymously to provide you with insights.
                </p>
            </ProfileCard>

            <ProfileCard title="Data Management" icon={<TrashIcon />}>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Permanently delete all of your trips, expenses, and budget data from this device.</p>
                 <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
                >
                    <TrashIcon />
                    Delete All My Data
                </button>
            </ProfileCard>

            {showDeleteModal && (
                <DeleteDataModal
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        onClearAllData();
                        setShowDeleteModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Profile;