import React from 'react';
import { Trip } from '../../../types';
import { getTripsByDay } from '../../../utils/dataProcessing';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TripsByDayChartProps {
    trips: Trip[];
}

const TripsByDayChart: React.FC<TripsByDayChartProps> = ({ trips }) => {
    const data = getTripsByDay(trips);

    if (trips.length === 0) {
        return <p className="text-center text-gray-500">No trip data to display.</p>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                        labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend wrapperStyle={{ color: '#d1d5db' }}/>
                    <Bar dataKey="trips" fill="#00C49F" name="Number of Trips" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TripsByDayChart;