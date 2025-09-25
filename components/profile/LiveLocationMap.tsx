import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates } from '../../types';
import Loader from '../Loader';
import { useTheme } from '../../hooks/useTheme';

// Fix for default Leaflet marker icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LiveLocationMap: React.FC = () => {
  const { theme } = useTheme();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (error) {
    return <p className="text-sm text-red-500 dark:text-red-400 mt-3 text-center">{error}</p>;
  }

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center h-48 mt-3">
        <Loader />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Fetching your location...</p>
      </div>
    );
  }

  const position: L.LatLngExpression = [location.lat, location.lng];
  const lightTileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const darkTileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-64 w-full mt-3 rounded-lg overflow-hidden border-2 border-cyan-500/50">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%', backgroundColor: theme === 'light' ? '#ffffff' : '#111827' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={theme === 'light' ? lightTileUrl : darkTileUrl}
        />
        <Marker position={position}>
          <Popup>Your current location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveLocationMap;