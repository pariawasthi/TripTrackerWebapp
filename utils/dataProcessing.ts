import { Trip, TransportMode, Coordinates } from '../types';

export const getModeDistribution = (trips: Trip[]) => {
  const modeCounts = trips.reduce((acc, trip) => {
    const mode = trip.mode || TransportMode.UNKNOWN;
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {} as Record<TransportMode, number>);

  return Object.entries(modeCounts).map(([name, value]) => ({ name, value }));
};

export const getPeakHours = (trips: Trip[]) => {
  const hourCounts = new Array(24).fill(0);
  trips.forEach(trip => {
    const hour = new Date(trip.startTime).getHours();
    hourCounts[hour]++;
  });

  return hourCounts.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    trips: count,
  }));
};


export type HeatmapData = [number, number, number]; // [lat, lng, intensity]

export const getHeatmapData = (trips: Trip[]): HeatmapData[] => {
    // Flatten all paths into a single array of coordinates
    const allCoords = trips.flatMap(trip => trip.path);
    
    // For simplicity, we'll assign an intensity of 1 to each point.
    // A more complex implementation could increase intensity for overlapping points.
    return allCoords.map(coord => [coord.lat, coord.lng, 0.5]);
};

export const getTripsByDay = (trips: Trip[]) => {
    const dayCounts = [
        { day: 'Sun', trips: 0 },
        { day: 'Mon', trips: 0 },
        { day: 'Tue', trips: 0 },
        { day: 'Wed', trips: 0 },
        { day: 'Thu', trips: 0 },
        { day: 'Fri', trips: 0 },
        { day: 'Sat', trips: 0 },
    ];
    trips.forEach(trip => {
        const dayIndex = new Date(trip.startTime).getDay(); // 0 for Sunday, 1 for Monday, etc.
        dayCounts[dayIndex].trips++;
    });
    return dayCounts;
};