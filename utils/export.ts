import { Trip } from '../types';

export const exportTripsToCSV = (trips: Trip[]) => {
  const headers = [
    'id',
    'startTime',
    'endTime',
    'durationMinutes',
    'mode',
    'originLat',
    'originLng',
    'destinationLat',
    'destinationLng',
    'originAddress',
    'destinationAddress',
    'companions',
    'notes'
  ];

  const rows = trips.map(trip => [
    trip.id,
    new Date(trip.startTime).toISOString(),
    new Date(trip.endTime).toISOString(),
    Math.round((trip.endTime - trip.startTime) / 60000),
    trip.mode,
    trip.origin.lat,
    trip.origin.lng,
    trip.destination.lat,
    trip.destination.lng,
    `"${trip.originAddress || ''}"`,
    `"${trip.destinationAddress || ''}"`,
    trip.companions || 0,
    `"${(trip.notes || '').replace(/"/g, '""')}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `geojourney_trips_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};