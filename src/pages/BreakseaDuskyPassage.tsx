import { useState } from 'react';
import { Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

// Data for "North Bound" (Dusky to Breaksea)
const NORTH_BOUND_WAYPOINTS = [
    { lat: "45° 48.43'S", long: "166° 22.79'E", wpt: "WP002", name: "Enter dusky Sound", rad: "3.0'", crs: "073°", dist: "3.3'", spd: "16", time: "12", wo: "South Point Abeam" },
    { lat: "45° 47.48'S", long: "166° 27.35'E", wpt: "WP003", name: "Anchor Island", rad: "3.0'", crs: "084°", dist: "4.3'", spd: "16", time: "16", pi: ".4 port", wo: "Conspicuous Cape Abm" },
    { lat: "45° 47.02'S", long: "166° 33.55'E", wpt: "WP004", name: "Normans Island", rad: "1.0'", crs: "045°", dist: "1.2'", spd: "16", time: "5", pi: ".2 port", wo: "Thrum Cap 045" },
    { lat: "45° 46.14'S", long: "166° 34.83'E", wpt: "WP005", name: "Indian Island", rad: "1.0'", crs: "075°", dist: "3.0'", spd: "16", time: "11", pi: ".23 stbd", wo: "Porpoise Pt @ .8" },
    { lat: "45° 45.36'S", long: "166° 38.96'E", wpt: "WP006", name: "Duck Cove", rad: "2.0'", crs: "090°", dist: "1.2'", spd: "16", time: "5", pi: ".2 port", wo: "Porpoise Pt Abeam" },
    { lat: "45° 45.36'S", long: "166° 40.76'E", wpt: "WP007", name: "Bowen Channel", rad: "1.0'", crs: "054°", dist: "2.1'", spd: "16", time: "8", pi: ".25 port", wo: "Passage Pt @ 1.0" },
    { lat: "45° 44.07'S", long: "166° 43.27'E", wpt: "WP008", name: "Front Island", rad: "2.0'", crs: "007°", dist: "2.6'", spd: "16", time: "10", pi: ".2 port", wo: "Clearing Narrows" },
    { lat: "45° 41.41'S", long: "166° 43.74'E", wpt: "WP009", name: "Passage Point", rad: "1.0'", crs: "356°", dist: "4.4'", spd: "16", time: "17", pi: ".28 port", wo: "Occ Cove 313, Brksea in tx" },
    { lat: "45° 36.96'S", long: "166° 43.30'E", wpt: "WP010", name: "Occasional Cove", rad: "1.0'", crs: "310°", dist: "3.3'", spd: "16", time: "12", pi: ".15 stbd", wo: "Gilbert I. Abeam" },
    { lat: "45° 34.84'S", long: "166° 39.68'E", wpt: "WP011", name: "Breaksea Island", rad: "1.0'", crs: "348°", dist: "4.1'", spd: "16", time: "15", pi: ".5 port" },
    { lat: "45° 30.80'S", long: "166° 38.43'E", wpt: "WP012", name: "Exit Breaksea Sound", rad: "3.0'", crs: "-", dist: "30.0NM", spd: "-", time: "1h 51m" },
];

// Data for "South Bound" (Breaksea to Dusky)
const SOUTH_BOUND_WAYPOINTS = [
    { lat: "45° 30.80'S", long: "166° 38.43'E", wpt: "WP012", name: "Enter Breaksea Sound", rad: "3.0'", crs: "168°", dist: "4.1'", spd: "16", time: "15", wo: "Breaksea Islet 084" },
    { lat: "45° 34.84'S", long: "166° 39.68'E", wpt: "WP011", name: "Breaksea Island", rad: "1.0'", crs: "130°", dist: "3.3'", spd: "16", time: "12", pi: ".14 port", wo: "Conspicious Pt Abm Stbd" },
    { lat: "45° 36.96'S", long: "166° 43.30'E", wpt: "WP010", name: "Occasional Cove", rad: "1.0'", crs: "176°", dist: "4.4'", spd: "16", time: "17", pi: ".2 port", wo: "Conspicious Cove Abm Port" },
    { lat: "45° 41.41'S", long: "166° 43.74'E", wpt: "WP009", name: "Passage Point", rad: "1.0'", crs: "187°", dist: "2.6'", spd: "16", time: "10", pi: ".11 port", wo: "Conspicious Pt 207" },
    { lat: "45° 44.07'S", long: "166° 43.27'E", wpt: "WP008", name: "Front Island", rad: "1.0'", crs: "234°", dist: "2.1'", spd: "16", time: "8", pi: ".23 stbd", wo: "Porpoise Pt 260" },
    { lat: "45° 45.36'S", long: "166° 40.76'E", wpt: "WP007", name: "Bowen Channel", rad: "1.0'", crs: "270°", dist: "1.2'", spd: "16", time: "5", pi: ".2 stbd", wo: "Conspicious Pt 240" },
    { lat: "45° 45.36'S", long: "166° 38.96'E", wpt: "WP006", name: "Duck Cove", rad: "2.0'", crs: "255°", dist: "3.0'", spd: "16", time: "11", pi: ".22, .29 stbd", wo: "Indian I. 226" },
    { lat: "45° 46.14'S", long: "166° 34.83'E", wpt: "WP005", name: "Indian Island", rad: "1.0'", crs: "255°", dist: "1.2'", spd: "16", time: "5", pi: ".21 port", wo: "Thrum Cap 256" },
    { lat: "45° 47.02'S", long: "166° 33.55'E", wpt: "WP004", name: "Normans Island", rad: "1.0'", crs: "264°", dist: "4.3'", spd: "16", time: "16", pi: ".43 port" },
    { lat: "45° 47.48'S", long: "166° 27.35'E", wpt: "WP003", name: "Anchor Island", rad: "1.0'", crs: "253°", dist: "3.3'", spd: "16", time: "12" },
    { lat: "45° 48.43'S", long: "166° 22.79'E", wpt: "WP002", name: "Exit dusky Sound", rad: "3.0'", crs: "-", dist: "30NM", spd: "-", time: "1h 51M" },
];

export default function BreakseaDuskyPassage() {
    const [direction, setDirection] = useState<'north' | 'south'>('south');

    const waypoints = direction === 'north' ? NORTH_BOUND_WAYPOINTS : SOUTH_BOUND_WAYPOINTS;
    const isNorth = direction === 'north';

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">
                        {isNorth ? 'Dusky to Breaksea' : 'Breaksea to Dusky'}
                    </h1>
                    <p className="text-fiordland-500">Te Puaitaha / Breaksea Sound and Tamatea / Dusky Sound</p>
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
                </div>

                <div className="space-y-4">
                    <NoteCard number="2" title="Bridge Resource Management">
                        Pilots support and use <strong>BRIDGE RESOURCE MANAGEMENT</strong>. Master/crew to <strong>MONITOR</strong> the execution of <strong>TRANSIT, ENGINE & HELM ORDERS</strong>.
                        Please <strong>ASK</strong> the Pilot if you are in any doubt about the planned passage or its progress.
                    </NoteCard>
                    <NoteCard number="3" title="Prohibited Entry" className="border-red-200 bg-red-50/50">
                        Cruise ships are <strong>prohibited</strong> from entering the internal waters of Fiordland between Nautical Dusk and Nautical Dawn, unless the pilot or harbourmaster decides that it is necessary to do so due to adverse weather or emergency. Harbour Master may grant specific permission on occasion.
                    </NoteCard>
                </div>
            </div>

            {/* Waypoints Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500" key={`table-${direction}`}>
                <div className="bg-fiordland-900 px-6 py-4 border-b border-fiordland-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-brand-gold" />
                        <h2 className="text-white font-bold text-lg">Waypoints: {isNorth ? 'North Bound' : 'South Bound'}</h2>
                    </div>
                    <div className="px-3 py-1 bg-fiordland-800 rounded text-xs font-mono text-fiordland-300">
                        {isNorth ? 'WP002 → WP012' : 'WP012 → WP002'}
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
                                <td className="px-6 py-3 font-bold text-fiordland-900">30NM</td>
                                <td className="px-6 py-3 font-bold text-fiordland-900"></td>
                                <td className="px-6 py-3 font-bold text-fiordland-900">~1h 51m</td>
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
