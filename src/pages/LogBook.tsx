import { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import { LogEntryTable } from '../components/LogEntryTable';
import { getChecklists } from '../lib/db';
import { type LogEntry } from '../lib/logbook';

export default function LogBook() {
    const [entries, setEntries] = useState<LogEntry[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        // Fetch all checklists of type 'entry_exit' from Server
        // We bypass the type signature issue by casting or using a dedicated function if we had one,
        // but for now reusing getChecklists with a filter param is easiest.
        // We need to modify getChecklists to accept a type filter first.
        const allData = await getChecklists('entry_exit');

        const mapped: LogEntry[] = allData.map((d: any) => ({
            id: d.id.toString(),
            timestamp: d.createdAt.toISOString(),
            vesselName: d.data?.vesselName || 'Unknown',
            author: d.data?.author || d.userId || 'Unknown',
            content: d.data?.notes || d.data?.content || '',
            loa: d.data?.loa,
            beam: d.data?.beam,
            masterName: d.data?.masterName,
            arrivalDate: d.data?.arrivalDate,
            cruiseLine: d.data?.cruiseLine,
            traineeName: d.data?.traineeName
        }));
        setEntries(mapped);
    };

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

            <LogEntryTable entries={filteredEntries} onEntriesChange={loadEntries} />
        </div>
    );
}
