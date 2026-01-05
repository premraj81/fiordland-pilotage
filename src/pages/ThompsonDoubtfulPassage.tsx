import { useState } from 'react';
import { Navigation, Info } from 'lucide-react';
import { cn } from '../lib/utils';

// Data for "North Bound" (Image 0)
const NORTH_BOUND_WAYPOINTS = [
    { lat: "45° 15.77'S", long: "166° 47.36'E", wpt: "WP001", name: "Febrero Point", rad: "2.0'", crs: "091°", dist: "3.2'", spd: "16", time: "12", wo: "Jamieson Head 135" },
    { lat: "45° 15.83'S", long: "166° 51.89'E", wpt: "WP002", name: "Enter Doubtful", rad: "1.0'", crs: "121°", dist: "1.6'", spd: "16", time: "6", pi: ".2 stbd", wo: "Jamieson Head @ .6" },
    { lat: "45° 17.32'S", long: "166° 52.61'E", wpt: "WP003", name: "Jamieson Head", rad: "1.0'", crs: "160°", dist: "1.3'", spd: "16", time: "5", pi: ".15 port", wo: "Marcac./Espin. Pts in tx" },
    { lat: "45° 17.98'S", long: "166° 54.22'E", wpt: "WP004", name: "Utah Island", rad: "1.0'", crs: "107°", dist: "1.9'", spd: "16", time: "7", pi: ".17 port", wo: "Marcacionses Pt Abeam" },
    { lat: "45° 18.55'S", long: "166° 56.86'E", wpt: "WP005", name: "Marcaciones Point", rad: "1.0'", crs: "090°", dist: "2.0'", spd: "16", time: "7", pi: ".3 port", wo: "Seymour I. @ .9" },
    { lat: "45° 18.55'S", long: "166° 59.64'E", wpt: "WP006", name: "Seymour Island", rad: "1.0'", crs: "055°", dist: "1.1'", spd: "14", time: "8", pi: "VRM .1" },
    { lat: "45° 17.90'S", long: "167° 00.96'E", wpt: "WP007", name: "Common Head", rad: "0.5'", crs: "331°", dist: "1.6'", spd: "14", time: "6", pi: "VRM .1" },
    { lat: "45° 16.54'S", long: "166° 59.87'E", wpt: "WP008", name: "Surgeon Bay", rad: "1.0'", crs: "350°", dist: "1.5'", spd: "14", time: "6", pi: ".3 stbd", wo: "Lyall Bay Abeam" },
    { lat: "45° 15.07'S", long: "166° 59.52'E", wpt: "WP009", name: "Lieutenant Head", rad: "1.0'", crs: "335°", dist: "3.6'", spd: "16", time: "14", pi: ".22 stbd", wo: "Deas Cove Ent @ 1.1" },
    { lat: "45° 11.79'S", long: "166° 57.33'E", wpt: "WP010", name: "Deas Cove", rad: "1.0'", crs: "029°", dist: "2.2'", spd: "16", time: "8", pi: ".17 stbd", wo: "Channel Side 350" },
    { lat: "45° 09.85'S", long: "166° 58.85'E", wpt: "WP011", name: "Open Cove", rad: "1.0'", crs: "334°", dist: "1.4'", spd: "16", time: "5", pi: ".23 stbd", wo: "Shanks Hd 335" },
    { lat: "45° 08.59'S", long: "166° 57.98'E", wpt: "WP012", name: "Colonial head", rad: "1.0'", crs: "349°", dist: "2.5'", spd: "16", time: "9", pi: ".3 stbd", wo: "Shanks Hd 015" },
    { lat: "45° 06.18'S", long: "166° 57.25'E", wpt: "WP013", name: "Exit Doubtful", rad: "3.0'", crs: "-", dist: "24nm", spd: "-", time: "1h 34m" },
];

// Data for "South Bound" (Image 1)
const SOUTH_BOUND_WAYPOINTS = [
    { lat: "45° 06.18'S", long: "166° 57.25'E", wpt: "WP013", name: "Enter Doubtful", rad: "3.0'", crs: "168°", dist: "2.5'", spd: "16", time: "9" },
    { lat: "45° 08.59'S", long: "166° 57.98'E", wpt: "WP012", name: "Colonial head", rad: "1.0'", crs: "154°", dist: "1.4'", spd: "16", time: "5", pi: ".26 port", wo: "Conspicious Pt 200" },
    { lat: "45° 09.85'S", long: "166° 58.85'E", wpt: "WP011", name: "Open Cove", rad: "1.0'", crs: "209°", dist: "2.2'", spd: "16", time: "8", pi: ".27 port", wo: "Conspicious Pt 170" },
    { lat: "45° 11.79'S", long: "166° 57.33'E", wpt: "WP010", name: "Deas Cove", rad: "1.0'", crs: "155°", dist: "3.6'", spd: "16", time: "14", pi: ".22 port", wo: "Conspicious Pt 180" },
    { lat: "45° 15.07'S", long: "166° 59.52'E", wpt: "WP009", name: "Lieutenant Head", rad: "1.0'", crs: "170°", dist: "1.5'", spd: "16", time: "6", pi: ".3 port", wo: "Conspicious Pt 140" },
    { lat: "45° 16.54'S", long: "166° 59.87'E", wpt: "WP008", name: "Surgeon Bay", rad: "1.0'", crs: "151°", dist: "1.4'", spd: "14", time: "6", pi: "VRM .1", wo: "Common Hd 185" },
    { lat: "45° 17.90'S", long: "167° 00.96'E", wpt: "WP007", name: "Common Head", rad: "0.5'", crs: "235°", dist: "1.1'", spd: "14", time: "8", pi: "VRM .1" },
    { lat: "45° 18.55'S", long: "166° 59.64'E", wpt: "WP006", name: "Seymour Island", rad: "1.0'", crs: "270°", dist: "2.0'", spd: "16", time: "7", pi: ".32 stbd", wo: "Marcaciones Pt 295" },
    { lat: "45° 18.55'S", long: "166° 56.86'E", wpt: "WP005", name: "Marcaciones Point", rad: "1.0'", crs: "287°", dist: "1.9'", spd: "16", time: "7", pi: ".18 stbd", wo: "E. Indian I. 342" },
    { lat: "45° 17.98'S", long: "166° 54.22'E", wpt: "WP004", name: "Utah Island", rad: "1.0'", crs: "340°", dist: "1.3'", spd: "16", time: "6", pi: ".2 port" },
    { lat: "45° 17.32'S", long: "166° 52.61'E", wpt: "WP003", name: "Jamieson Head", rad: "1.0'", crs: "301°", dist: "1.6'", spd: "16", time: "6", pi: ".16 stbd", wo: "Jamieson Hd 325" },
    { lat: "45° 15.83'S", long: "166° 51.89'E", wpt: "WP002", name: "Enter Doubtful", rad: "1.0'", crs: "271°", dist: "3.2'", spd: "16", time: "12" },
    { lat: "45° 15.77'S", long: "166° 47.36'E", wpt: "WP001", name: "Febrero Point", rad: "2.0'", crs: "-", dist: "24nm", spd: "-", time: "1h 34m" },
];

export default function ThompsonDoubtfulPassage() {
    const [direction, setDirection] = useState<'north' | 'south'>('south');

    const waypoints = direction === 'north' ? NORTH_BOUND_WAYPOINTS : SOUTH_BOUND_WAYPOINTS;
    const isNorth = direction === 'north';

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">
                        {isNorth ? 'Doubtful to Thompson' : 'Thompson to Doubtful'}
                    </h1>
                    <p className="text-fiordland-500">Te Awa-O-Tu / Thompson Sound and Doubtful Sound / Patea</p>
                </div>

                {/* Direction Toggle */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setDirection('north')}
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                            isNorth
                                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                    >
                        North Bound
                    </button>
                    <button
                        onClick={() => setDirection('south')}
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                            !isNorth
                                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                    >
                        South Bound
                    </button>
                </div>
            </div>

            {/* Notes Section - Changes based on direction */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <NoteCard number="1" title="Track Information">
                        The tracks shown are approximate. The courses steered and wheel over positions will vary depending upon the following:
                        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                            <li>The size of the vessel (including the draft & speed).</li>
                            <li>The handling characteristics of the vessel.</li>
                            <li>The influence of weather & Current.</li>
                        </ul>
                    </NoteCard>
                    <NoteCard number="2" title="Speed & Time">
                        Speed calculations are based on the indicated speeds in the table. Adjustments should be made for actual vessel speed and conditions.
                    </NoteCard>
                </div>

                <div className="space-y-4">
                    <NoteCard number="3" title="Bridge Resource Management">
                        Pilots support and use <strong>BRIDGE RESOURCE MANAGEMENT</strong>. Master/crew to <strong>MONITOR</strong> the execution of <strong>TRANSIT, ENGINE & HELM ORDERS</strong>.
                        Please <strong>ASK</strong> the Pilot if you are in any doubt about the planned passage or its progress.
                    </NoteCard>
                    <NoteCard number="4" title="Prohibited Entry" className="border-red-200 bg-red-50/50">
                        Cruise ships are <strong>prohibited</strong> from entering the internal waters of Fiordland between Nautical Dusk and Nautical Dawn, unless the pilot or harbourmaster decides that it is necessary to do so due to adverse weather or emergency. Harbour Master may grant specific permission on occasion.
                    </NoteCard>
                </div>
            </div>

            {/* Warnings / Callouts  */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2 font-bold text-blue-800">
                    <Info className="w-4 h-4" /> Navigational Note
                </div>
                <p className="text-sm text-blue-900">
                    Be aware of potentially strong local winds and currents, particularly near Secretary Island and in the Patea Passage.
                </p>
            </div>

            {/* Waypoints Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500" key={`table-${direction}`}>
                <div className="bg-fiordland-900 px-6 py-4 border-b border-fiordland-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-brand-gold" />
                        <h2 className="text-white font-bold text-lg">Waypoints: {isNorth ? 'North Bound' : 'South Bound'}</h2>
                    </div>
                    <div className="px-3 py-1 bg-fiordland-800 rounded text-xs font-mono text-fiordland-300">
                        {isNorth ? 'WP001 → WP013' : 'WP013 → WP001'}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Latitude</th>
                                <th className="px-6 py-3">Longitude</th>
                                <th className="px-6 py-3">WPT</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Radius (nm)</th>
                                <th className="px-6 py-3">Course</th>
                                <th className="px-6 py-3">Dist (nm)</th>
                                <th className="px-6 py-3">Speed (kn)</th>
                                <th className="px-6 py-3">Time (min)</th>
                                <th className="px-6 py-3 text-brand-teal">P.I. Ref</th>
                                <th className="px-6 py-3 text-brand-teal">Wheel Over</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {waypoints.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-700">{row.lat}</td>
                                    <td className="px-6 py-4 font-mono text-gray-700">{row.long}</td>
                                    <td className="px-6 py-4 font-semibold text-brand-teal">{row.wpt}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.rad}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono">{row.crs}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.dist}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.spd}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.time}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-brand-teal font-medium whitespace-pre-line max-w-[150px]">
                                        {row.pi || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600 italic max-w-[200px] leading-tight">
                                        {row.wo || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                                <td colSpan={6} className="px-6 py-3 font-bold text-right text-gray-700">Total</td>
                                <td className="px-6 py-3 font-bold text-fiordland-900">24nm</td>
                                <td className="px-6 py-3 font-bold text-fiordland-900"></td>
                                <td className="px-6 py-3 font-bold text-fiordland-900">~1h 34m</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

function NoteCard({ number, title, children, className = "" }: { number: string, title: string, children: React.ReactNode, className?: string }) {
    return (
        <div className={`p-5 rounded-xl border border-gray-200 bg-white ${className}`}>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-fiordland-900 text-white w-6 h-6 rounded flex items-center justify-center text-xs">{number}</span>
                {title}
            </h3>
            <div className="text-sm text-gray-700 leading-relaxed">
                {children}
            </div>
        </div>
    )
}
