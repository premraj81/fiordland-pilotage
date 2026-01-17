import { Trash2 } from 'lucide-react';
import { type LogEntry, deleteLogEntry } from '../lib/logbook';

export function LogEntryTable({ entries, onEntriesChange }: { entries: LogEntry[], onEntriesChange?: () => void }) {

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this log entry? This action cannot be undone.')) {
            deleteLogEntry(id);
            if (onEntriesChange) onEntriesChange();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Date</th>
                            <th className="px-6 py-4 whitespace-nowrap">Ship Name</th>
                            <th className="px-6 py-4 whitespace-nowrap">Cruise Line</th>
                            <th className="px-6 py-4 text-right">Length</th>
                            <th className="px-6 py-4 text-right">Beam</th>
                            <th className="px-6 py-4 whitespace-nowrap">Pilot</th>
                            <th className="px-6 py-4 whitespace-nowrap">Trainee</th>
                            <th className="px-6 py-4 whitespace-nowrap">Master</th>
                            <th className="px-6 py-4 min-w-[300px]">Note</th>
                            <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap align-top">
                                    {entry.arrivalDate || new Date(entry.timestamp).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-bold whitespace-nowrap align-top">
                                    {entry.vesselName}
                                </td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap align-top">
                                    {entry.cruiseLine || '-'}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-900 whitespace-nowrap align-top">
                                    {entry.loa ? `${entry.loa}m` : '-'}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-900 whitespace-nowrap align-top">
                                    {entry.beam ? `${entry.beam}m` : '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-900 whitespace-nowrap align-top">
                                    {entry.author}
                                </td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap align-top">
                                    {entry.traineeName || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-900 whitespace-nowrap align-top">
                                    {entry.masterName || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-700 leading-relaxed align-top">
                                    {entry.content}
                                </td>
                                <td className="px-6 py-4 text-right align-top">
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                        title="Delete Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-500 italic">
                                    No log entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
