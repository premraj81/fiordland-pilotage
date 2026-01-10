import { useState, useEffect } from 'react';
import { Ship, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';
import { parse, isAfter, isToday, format } from 'date-fns';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQok6tl5GPK_Y7Z0fjjEmDYZmWpctIcoQrPG3AKxXe6TTh3kaUQ-w0qIk-xPUF0AA/pub?output=csv&gid=502006066';

export default function CruiseSchedule() {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            // Try fetching CSV directly (Google Sheets typically allows CORS)
            const res = await fetch(SHEET_CSV_URL);
            if (!res.ok) throw new Error('Network response was not ok');
            const text = await res.text();

            const rows = text.split('\n').slice(1); // Skip header
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const parsedItems = rows.map(row => {
                // Simple comma split - works for the known schema (Ship,Port,Date,Time...)
                // We only need the first 4 columns which generally shouldn't have commas
                const cols = row.split(',');
                if (cols.length < 4) return null;

                const ship = cols[0].trim();
                const port = cols[1].trim();
                let dateStr = cols[2].trim(); // "Mon 22 Sept 25"
                const time = cols[3].trim();

                // Fix non-standard month abbreviations if any
                dateStr = dateStr.replace('Sept', 'Sep');

                return { ship, port, dateStr, time };
            });

            const upcoming = parsedItems
                .filter(item => item && (item.port === 'Fiordland' || item.port === 'Milford Sound' || item.port.includes('Fiordland')))
                .map(item => {
                    try {
                        // dateStr: "Mon 22 Sep 25"
                        // Parse format: EEE d MMM yy
                        // Handle potential quotes
                        const cleanDateStr = item!.dateStr.replace(/"/g, '');
                        const date = parse(cleanDateStr, 'EEE d MMM yy', new Date());
                        return { ...item, date };
                    } catch (e) {
                        return null;
                    }
                })
                .filter((item): item is { ship: string; port: string; dateStr: string; time: string; date: Date } =>
                    !!item && !isNaN(item.date.getTime()) && (isAfter(item.date, today) || isToday(item.date))
                )
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 4);

            setSchedule(upcoming);
            setLoading(false);
        } catch (e) {
            console.error("Failed to load cruise schedule", e);
            // Fallback to CORS proxy if direct fetch failed
            setError(true);
            setLoading(false);
        }
    };

    if (error) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-500">Schedule unavailable</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Ship className="w-5 h-5 text-fiordland-700" />
                <h3 className="font-bold text-fiordland-900">Milford Ship Schedule</h3>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-4 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            ) : schedule.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No upcoming ships found.</p>
            ) : (
                <div className="space-y-3">
                    {schedule.map((stop, idx) => (
                        <div key={idx} className="grid grid-cols-12 items-center gap-2 text-sm">
                            <div className="col-span-1 text-gray-400">
                                <Ship className="w-4 h-4" />
                            </div>
                            <div className="col-span-6 font-medium text-gray-800 truncate">
                                {stop.ship}
                            </div>
                            <div className="col-span-5 text-right text-gray-500 flex flex-col items-end">
                                <span className="font-semibold text-brand-teal text-xs bg-teal-50 px-1.5 py-0.5 rounded">
                                    {format(stop.date, 'd MMM')}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                    ETA {stop.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
