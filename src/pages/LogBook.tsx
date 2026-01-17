import { useState, useEffect } from 'react';
import { getLogEntries, type LogEntry } from '../lib/logbook';
import { Search, FileText } from 'lucide-react';
import { LogEntryTable } from '../components/LogEntryTable';

export default function LogBook() {
    const [entries, setEntries] = useState<LogEntry[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setEntries(getLogEntries());
    }, []);

    const filteredEntries = entries.filter(e =>
        e.vesselName.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase()) ||
        e.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-[1920px] p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-brand-teal" />
                        Master Log Book
                    </h1>
                    <p className="text-gray-500 mt-1">Complete history of all vessel pilotage entries.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border-gray-300 focus:border-brand-teal focus:ring-brand-teal shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <LogEntryTable entries={filteredEntries} onEntriesChange={() => setEntries(getLogEntries())} />
        </div>
    );
}
