import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Trip } from '../types';
import { ChevronLeftIcon } from './Icons';
import { useTheme } from '../hooks/useTheme';

// Type definition
interface MapViewProps {
  trip: Trip;
  onClose: () => void;
}

// Fix for default Leaflet marker icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView: React.FC<MapViewProps> = ({ trip, onClose }) => {
  const { theme } = useTheme(); // still used for UI, but map stays satellite
  const positions = useMemo(() => trip.path.map(p => [p.lat, p.lng] as L.LatLngExpression), [trip.path]);
  const bounds = useMemo(() => L.latLngBounds(positions), [positions]);

  const origin = [trip.origin.lat, trip.origin.lng] as L.LatLngExpression;
  const destination = [trip.destination.lat, trip.destination.lng] as L.LatLngExpression;

  // Satellite map from Esri
  const satelliteTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col animate-fade-in">
      <header className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center z-10 flex-shrink-0">
        <button 
          onClick={onClose} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Back to history"
        >
          <ChevronLeftIcon className="text-gray-800 dark:text-gray-200" />
        </button>
        <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white tracking-wider flex-grow pr-10">
          Trip Map
        </h2>
      </header>

      <div className="flex-grow">
        <MapContainer 
          bounds={bounds}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          boundsOptions={{ padding: [50, 50] }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> & contributors'
            url={satelliteTileUrl}
          />
          <Polyline pathOptions={{ color: '#22d3ee', weight: 4, opacity: 0.8 }} positions={positions} />
          <Marker position={origin}>
            <Popup>Start of Trip</Popup>
          </Marker>
          <Marker position={destination}>
            <Popup>End of Trip</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
