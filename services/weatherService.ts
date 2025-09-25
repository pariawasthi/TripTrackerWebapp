import { Coordinates, Weather } from '../types';

/**
 * MOCK weather service. In a real app, this would call a real weather API.
 */
export const getWeatherForCoordinates = (coords: Coordinates): Promise<Weather> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conditions: Weather['condition'][] = ['Sunny', 'Cloudy', 'Rainy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 20) + 10; // Temp between 10°C and 30°C

      resolve({
        condition: randomCondition,
        temperature: randomTemp,
      });
    }, 1000); // Simulate network delay
  });
};
