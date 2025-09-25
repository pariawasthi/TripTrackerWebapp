import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates } from '../types';
import { ChevronLeftIcon, PencilAltIcon } from './Icons';
import Loader from './Loader';
import TakeNotesModal from './TakeNotesModal';
import { useTheme } from '../hooks/useTheme';

// Fix for default Leaflet marker icon path issue with CDNs/bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pulsating icon
const pulsatingIcon = L.divIcon({
  className: 'pulsating-dot',
  iconSize: [20, 20]
});

interface LiveMapViewProps {
  path: Coordinates[];
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

// A component to automatically pan the map to the user's current location
const MapUpdater: React.FC<{ position: L.LatLngExpression }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom() < 15 ? 15 : map.getZoom()); 
  }, [position, map]);
  return null;
};


const LiveMapView: React.FC<LiveMapViewProps> = ({ path, onClose, notes, onNotesChange }) => {
  const { theme } = useTheme();
  const [showNotesModal, setShowNotesModal] = useState(false);
  const positions = useMemo(() => path.map(p => [p.lat, p.lng] as L.LatLngExpression), [path]);

  const currentPosition = positions.length > 0 ? positions[positions.length - 1] : null;

  const lightTileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const darkTileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col animate-fade-in">
       <header className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center z-10 flex-shrink-0">
        <button 
          onClick={onClose} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Back to tracker"
        >
          <ChevronLeftIcon className="text-gray-800 dark:text-gray-200" />
        </button>
        <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white tracking-wider flex-grow pr-10">
          Live Tracking
        </h2>
      </header>
      <div className="flex-grow relative">
        {currentPosition ? (
            <MapContainer 
                center={currentPosition}
                zoom={16}
                style={{ height: '100%', width: '100%', backgroundColor: theme === 'light' ? '#ffffff' : '#111827' }}
                scrollWheelZoom={true}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url={theme === 'light' ? lightTileUrl : darkTileUrl}
            />
            <Polyline pathOptions={{ color: '#22d3ee', weight: 4, opacity: 0.8 }} positions={positions} />
            <Marker position={currentPosition} icon={pulsatingIcon} />
            <MapUpdater position={currentPosition} />
            </MapContainer>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader />
                <p className="mt-4 text-gray-500 dark:text-gray-400">Waiting for GPS signal...</p>
            </div>
        )}

        <button
          onClick={() => setShowNotesModal(true)}
          className="absolute bottom-6 right-6 z-[1000] p-4 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-colors"
          aria-label="Take notes"
        >
          <PencilAltIcon />
        </button>
      </div>
      
      <TakeNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        notes={notes}
        onNotesChange={onNotesChange}
      />
    </div>
  );
};

export default LiveMapView;