import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Trip } from '../../types';
import { getHeatmapData } from '../../utils/dataProcessing';

declare global {
    namespace L {
        function heatLayer(latlngs: any[], options?: any): any;
    }
}

interface HeatmapViewProps {
    trips: Trip[];
}

const HeatmapView: React.FC<HeatmapViewProps> = ({ trips }) => {
    const heatmapLayerRef = useRef<any>(null);
    const mapRef = useRef<L.Map>(null);

    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current;
            const points = getHeatmapData(trips);

            if (heatmapLayerRef.current) {
                map.removeLayer(heatmapLayerRef.current);
            }

            if (points.length > 0) {
                heatmapLayerRef.current = L.heatLayer(points, { 
                    radius: 25, 
                    blur: 15,
                    maxZoom: 18,
                    gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
                }).addTo(map);

                const bounds = L.latLngBounds(points.map(p => [p[0], p[1]]));
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        }
    }, [trips]);

    return (
        <div className="h-[calc(100vh-8rem)] w-full rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <MapContainer
                ref={mapRef}
                center={[20.5937, 78.9629]} // Centered on India
                zoom={5}
                style={{ height: '100%', width: '100%', backgroundColor: '#111827' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
            </MapContainer>
        </div>
    );
};

export default HeatmapView;