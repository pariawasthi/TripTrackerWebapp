import React from 'react';
import { Trip } from '../../../types';
import { getModeDistribution } from '../../../utils/dataProcessing';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ModeDistributionChartProps {
    trips: Trip[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                <p className="label text-white">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ModeDistributionChart: React.FC<ModeDistributionChartProps> = ({ trips }) => {
    const data = getModeDistribution(trips);

    if (data.length === 0) {
        return <p className="text-center text-gray-500">No trip data to display.</p>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#d1d5db', fontSize: '14px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ModeDistributionChart;