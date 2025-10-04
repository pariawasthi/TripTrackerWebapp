import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trip, Coordinates, TransportMode, Weather } from '../types';
import { detectTransportMode } from '../services/geminiService';
import { getWeatherForCoordinates } from '../services/weatherService';
import Loader from './Loader';
import LiveMapView from './LiveMapView';
import StartTripModal from './StartTripModal';
import ManualTripForm from './ManualTripForm';
import WeatherDisplay from './WeatherDisplay';

import { formatDuration } from '../utils/formatters';
import { MapIcon, PauseIcon, PlayIcon } from './Icons';

interface TrackerProps {
  addTrip: (trip: Trip) => void;
}

const Tracker: React.FC<TrackerProps> = ({ addTrip }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [path, setPath] = useState<Coordinates[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [notes, setNotes] = useState('');

  // State for pre-trip features
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  
  // State for motion detection demo
  const [motionIntensity, setMotionIntensity] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalStartTimeRef = useRef<number | null>(null);
  const activeStartTimeRef = useRef<number | null>(null);
  const totalElapsedTimeAtPauseRef = useRef<number>(0);

  // Effect for motion detection demo
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
        // Don't run the visualizer when tracking
        if (isTracking) {
            setMotionIntensity(0);
            return;
        };

        const acc = event.accelerationIncludingGravity;
        if (acc && acc.x != null && acc.y != null && acc.z != null) {
            // Calculate magnitude of acceleration, subtract gravity (~9.8m/s^2), and normalize
            const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
            const userAcceleration = Math.max(magnitude - 9.8, 0);
            const normalized = Math.min(userAcceleration / 10, 1); // Clamp to 0-1 range
            setMotionIntensity(normalized);
        }
    };

    // iOS 13+ requires permission to access motion events
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
            .then((permissionState: 'granted' | 'denied') => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                }
            })
            .catch(console.error);
    } else {
        // For other browsers that don't need explicit permission
        window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
        window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isTracking]);

  // Fetch initial location and weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: Coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
        };
        setCurrentCoords(coords);
        try {
          const weatherData = await getWeatherForCoordinates(coords);
          setWeather(weatherData);
        } catch (err) {
          setWeatherError('Could not fetch weather data.');
        } finally {
          setIsWeatherLoading(false);
        }
      },
      (err) => {
        setWeatherError(`Location needed for weather. ${err.message}`);
        setIsWeatherLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);
  
  const updateTimer = useCallback(() => {
      if (activeStartTimeRef.current) {
          setElapsedTime(totalElapsedTimeAtPauseRef.current + (Date.now() - activeStartTimeRef.current));
      }
  }, []);

  const startGeoWatch = () => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newCoord: Coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
        };
        setPath(prevPath => [...prevPath, newCoord]);
      },
      (err) => {
        setError(`Location tracking error: ${err.message}`);
        stopTracking();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const startTracking = () => {
    setShowStartModal(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setError(null);
        setIsTracking(true);
        setIsPaused(false);
        
        const now = Date.now();
        originalStartTimeRef.current = now;
        activeStartTimeRef.current = now;
        totalElapsedTimeAtPauseRef.current = 0;
        setElapsedTime(0);
        setNotes('');

        const startCoord: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: now,
        };
        setPath([startCoord]);

        timerIntervalRef.current = setInterval(updateTimer, 1000);
        startGeoWatch();
      },
      (err) => {
        setError(`Could not get location: ${err.message}. Please enable location services.`);
      }
    );
  };

  const pauseTracking = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    setIsPaused(true);
    totalElapsedTimeAtPauseRef.current = elapsedTime;
    timerIntervalRef.current = null;
  };

  const resumeTracking = () => {
    setIsPaused(false);
    activeStartTimeRef.current = Date.now();
    timerIntervalRef.current = setInterval(updateTimer, 1000);
    startGeoWatch();
  };
  
  const stopTracking = async () => {
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setIsTracking(false);
    setIsPaused(false);

    if (path.length < 2 || !originalStartTimeRef.current) {
      setError("Not enough data to save trip.");
      resetState();
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const startTime = originalStartTimeRef.current;
    
    try {
        const endTime = Date.now();
        const mode = await detectTransportMode(path);
        const newTrip: Trip = {
            id: `trip-${endTime}`,
            startTime,
            endTime,
            origin: path[0],
            destination: path[path.length - 1],
            mode,
            path: path,
            notes,
        };
        addTrip(newTrip);
    } catch (err) {
        console.error(err);
        setError("Failed to analyze trip. Saving with 'Unknown' mode.");
        const endTime = Date.now();
        const fallbackTrip: Trip = {
            id: `trip-${endTime}`,
            startTime,
            endTime,
            origin: path[0],
            destination: path[path.length - 1],
            mode: TransportMode.UNKNOWN,
            path: path,
            notes,
        };
        addTrip(fallbackTrip);
    } finally {
        setIsLoading(false);
        resetState();
    }
  };

  const resetState = () => {
      setElapsedTime(0);
      setPath([]);
      setNotes('');
      originalStartTimeRef.current = null;
      activeStartTimeRef.current = null;
      totalElapsedTimeAtPauseRef.current = 0;
      watchIdRef.current = null;
      timerIntervalRef.current = null;
  }

  const handleOpenManualForm = () => {
    setShowStartModal(false);
    setShowManualForm(true);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full">
      {!isTracking && (
        <div className="w-full max-w-md space-y-4">
          <WeatherDisplay weather={weather} isLoading={isWeatherLoading} error={weatherError} />
         
        </div>
      )}

      {!isTracking && (
        <div className="flex flex-col items-center my-6">
            <div className="relative w-64 h-64 rounded-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 shadow-2xl shadow-cyan-500/20">
                {/* Motion ripples (behind the button) */}
                <div
                    className="absolute w-full h-full rounded-full bg-cyan-500/10 transition-transform duration-300 ease-out pointer-events-none"
                    style={{
                        transform: `scale(${0.8 + motionIntensity * 1.2})`,
                        opacity: motionIntensity * 0.5,
                    }}
                />
                <div
                    className="absolute w-full h-full rounded-full bg-cyan-500/5 transition-transform duration-500 ease-out pointer-events-none"
                    style={{
                        transform: `scale(${1 + motionIntensity * 1.5})`,
                        opacity: motionIntensity * 0.3,
                    }}
                />

                <button
                    onClick={() => setShowStartModal(true)}
                    disabled={isLoading}
                    className={`relative z-10 w-52 h-52 rounded-full text-white font-bold text-2xl transition-all duration-300 ease-in-out flex items-center justify-center
                    bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50 animate-pulse
                    ${isLoading && 'bg-gray-500 dark:bg-gray-600 cursor-not-allowed'}
                    `}
                >
                    {isLoading ? <Loader /> : 'START'}
                </button>
            </div>
             <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase">Motion Detection</p>
        </div>
      )}

      <div className="mt-8 h-40 text-center">
        {isTracking ? (
          <div className="flex flex-col items-center animate-fade-in space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={isPaused ? resumeTracking : pauseTracking}
                className="w-32 h-16 rounded-lg text-white font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2 bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600"
              >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={stopTracking}
                className="w-32 h-16 rounded-lg text-white font-bold text-lg transition-colors duration-300 flex items-center justify-center bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/30"
              >
                STOP
              </button>
            </div>

            <div className="flex flex-col items-center">
                <p className={`text-4xl font-mono font-bold tracking-wider ${isPaused ? 'text-gray-400 dark:text-gray-500 animate-pulse' : 'text-cyan-500 dark:text-cyan-400'}`}>
                    {formatDuration(elapsedTime)}
                </p>
                <button
                    onClick={() => setShowMap(true)}
                    className="mt-2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 transition-colors"
                    aria-label="Show live map"
                >
                    <MapIcon />
                    Show Live Map
                </button>
            </div>
          </div>
        ) : (
          <>
            {!isLoading && !error && (
                <p className="text-lg text-gray-500 dark:text-gray-400">Press START to begin your journey.</p>
            )}
            {isLoading && <p className="text-lg text-cyan-500 dark:text-cyan-400 animate-pulse">Analyzing your trip...</p>}
            {error && <p className="text-lg text-red-500 dark:text-red-400 max-w-sm">{error}</p>}
          </>
        )}
      </div>

      {showStartModal && (
        <StartTripModal
            onClose={() => setShowStartModal(false)}
            onLiveTrack={startTracking}
            onManualAdd={handleOpenManualForm}
        />
      )}

      {showManualForm && (
        <ManualTripForm
            onClose={() => setShowManualForm(false)}
            addTrip={addTrip}
        />
      )}
      
      {showMap && <LiveMapView path={path} onClose={() => setShowMap(false)} notes={notes} onNotesChange={setNotes} />}
    </div>
  );
};

export default Tracker;