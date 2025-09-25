import React from 'react';
import { Trip } from '../../types';
import { exportTripsToCSV } from '../../utils/export';
import { DownloadIcon } from '../Icons';
import { formatDate, formatDuration } from '../../utils/formatters';

interface DataTableProps {
    trips: Trip[];
}

const DataTable: React.FC<DataTableProps> = ({ trips }) => {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h3 className="text-lg font-semibold text-white">All Trip Records</h3>
                <button
                    onClick={() => exportTripsToCSV(trips)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-cyan-300 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
                >
                    <DownloadIcon />
                    <span>Export to CSV</span>
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mode</th>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Origin</th>
                            <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Destination</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {trips.map((trip) => (
                            <tr key={trip.id} className="hover:bg-gray-700/50">
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">{formatDate(trip.startTime)}</td>
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDuration(trip.endTime - trip.startTime)}</td>
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400">{trip.mode}</td>
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 truncate max-w-xs">{trip.originAddress || `${trip.origin.lat.toFixed(3)}, ${trip.origin.lng.toFixed(3)}`}</td>
                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 truncate max-w-xs">{trip.destinationAddress || `${trip.destination.lat.toFixed(3)}, ${trip.destination.lng.toFixed(3)}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {trips.length === 0 && <p className="text-center text-gray-500 py-8">No trips to display.</p>}
        </div>
    );
};

export default DataTable;