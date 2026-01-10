import { useState, useEffect } from 'react';
import { Ship, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { parse, isAfter, isToday, format } from 'date-fns';

export default function CruiseSchedule() {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            // Use allorigins as CORS proxy
            const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://newzealandcruiseassociation.com/schedules/'));
            if (!res.ok) throw new Error('Proxy error');

            const data = await res.json();
            if (!data.contents) throw new Error('No content');

            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');

            // Selector based on subagent inspection
            const rows = Array.from(doc.querySelectorAll('table tbody tr')); // Use generic table as it might not have ID in partial fetch or different context
            if (rows.length === 0) {
                // Try ID
                const table = doc.querySelector('#ship-schedule-table');
                if (!table) throw new Error('Table not found');
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const parsedItems = rows.map(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) return null;

                const ship = cells[0]?.textContent?.trim() || '';
                const port = cells[1]?.textContent?.trim() || '';
                const dateStr = cells[2]?.textContent?.trim() || ''; // "Sun 11 Jan 26"

                return { ship, port, dateStr };
            });

            const upcoming = parsedItems
                .filter(item => item && (item.port === 'Fiordland' || item.port === 'Milford Sound'))
                .map(item => {
                    try {
                        // Clean "Sun 11 Jan 26" -> "11 Jan 26"
                        // Split by space, handle 4 parts
                        const parts = item!.dateStr.split(' ');
                        // Expected: [DayName, Day, Month, Year] e.g. ["Sun", "11", "Jan", "26"]
                        if (parts.length < 4) return null;

                        const cleanDateStr = parts.slice(1).join(' '); // "11 Jan 26"
                        const date = parse(cleanDateStr, 'd MMM yy', new Date());

                        return { ...item, date };
                    } catch (e) {
                        return null;
                    }
                })
                .filter((item): item is { ship: string; port: string; dateStr: string; date: Date } =>
                    !!item && !isNaN(item.date.getTime()) && (isAfter(item.date, today) || isToday(item.date))
                )
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 4);

            setSchedule(upcoming);
            setLoading(false);
        } catch (e) {
            console.error("Failed to load cruise schedule", e);
            setError(true);
            setLoading(false);
        }
    };

    if (error) return null; // Hide if error to avoid ugly UI

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Ship className="w-5 h-5 text-brand-teal" />
                    <h3 className="font-bold text-fiordland-900">Cruise Schedule</h3>
                </div>
                <a
                    href="https://newzealandcruiseassociation.com/schedules/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-teal hover:underline flex items-center gap-1"
                >
                    View All <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-6 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : schedule.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No upcoming cruise ships found for Fiordland.</p>
            ) : (
                <div className="space-y-3">
                    {schedule.map((stop, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{stop.ship}</p>
                                <p className="text-xs text-gray-400">Fiordland</p>
                            </div>
                            <div className="flex items-center gap-2 text-right">
                                <div className="bg-teal-50 text-brand-teal px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(stop.date, 'd MMM')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
