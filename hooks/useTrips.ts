
import { useState, useEffect } from 'react';
import { Trip } from '../types';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const storedTrips = localStorage.getItem('geo-journey-trips');
      return storedTrips ? JSON.parse(storedTrips) : [];
    } catch (error) {
      console.error('Error reading trips from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('geo-journey-trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips to localStorage:', error);
    }
  }, [trips]);

  const addTrip = (trip: Trip) => {
    setTrips(prevTrips => [trip, ...prevTrips]);
  };
  
  const clearTrips = () => {
    setTrips([]);
  };

  return { trips, addTrip, clearTrips };
};
