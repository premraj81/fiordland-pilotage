import { useState } from 'react';
import { AlertTriangle, Navigation, Info } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming this utility exists

// Data for "IN"
const IN_WAYPOINTS = [
    { wpt: "WP001", name: "Pilot Boarding Ground", rad: "0.5'", crs: "114°", dist: "1.6'", spd: "12", wo: "St. Anne 136, Dale Pt. Opens" },
    { wpt: "WP002", name: "St Anne's Point", rad: "0.5'", crs: "160°", dist: "2.9'", spd: "10", pi: ".2 stbd", wo: "Creek Bed to Stbd, VRM .1" },
    { wpt: "WP003", name: "Dale Point", rad: "0.5'", crs: "100°", dist: "0.9'", spd: "10", pi: ".13 stbd", wo: "Copper Pt. @ .9" },
    { wpt: "WP004", name: "Stirling Falls", rad: "1.0'", crs: "115°", dist: "0.9'", spd: "8", pi: ".12 stbd", wo: "Copper Pt Abeam" },
    { wpt: "WP005", name: "Copper Point", rad: "1.0'", crs: "128°", dist: "1.3'", spd: "8", pi: ".17 stbd" },
    { wpt: "WP006", name: "Mitre Peak", rad: "1.0'", crs: "136°", dist: "1.4'", spd: "8" },
    { wpt: "WP007", name: "Bridget Point", rad: "1.0'", crs: "158°", dist: "1.1'", spd: "6" },
    { wpt: "WP008", name: "Milford Sound", rad: "0.5'", crs: "-", dist: "-", spd: "-" },
];

// Data for "OUT"
const OUT_WAYPOINTS = [
    { wpt: "WP008", name: "Milford Sound", rad: "0.5'", crs: "338°", dist: "1.1'", spd: "6" },
    { wpt: "WP007", name: "Bridget point", rad: "1.0'", crs: "316°", dist: "1.4'", spd: "8" },
    { wpt: "WP006", name: "Mitre Peak", rad: "1.0'", crs: "308°", dist: "1.3'", spd: "8", pi: ".3 port", wo: "Copper Pt. @ .5" },
    { wpt: "WP005", name: "Copper point", rad: "1.0'", crs: "295°", dist: "0.9'", spd: "8", pi: ".12 port" },
    { wpt: "WP004", name: "Stirling Falls", rad: "1.0'", crs: "280°", dist: "0.9'", spd: "10", pi: ".13 port", wo: "Dale Pt. @ .8, St A. Pt Opens" },
    { wpt: "WP003", name: "Dale Point", rad: "0.5'", crs: "340°", dist: "2.9'", spd: "10", pi: ".2 port" },
    { wpt: "WP002", name: "St Anne's Point", rad: "0.5'", crs: "294°", dist: "1.6'", spd: "12" },
    { wpt: "WP001", name: "Pilot Boarding Ground", rad: "0.5'", crs: "-", dist: "-", spd: "-" },
];

export default function MilfordPassage() {
    const [direction, setDirection] = useState<'in' | 'out'>('in');

    const waypoints = direction === 'in' ? IN_WAYPOINTS : OUT_WAYPOINTS;
    const isOut = direction === 'out';

    return (
        <div className="max-w-6xl mx-auto pb-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">Milford Sound</h1>
                    <p className="text-fiordland-500">Passage Plan Details and Waypoints</p>
                </div>

                {/* Direction Toggle */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setDirection('in')}
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                            !isOut
                                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                    >
                        Inwards
                    </button>
                    <button
                        onClick={() => setDirection('out')}
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                            isOut
                                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                    >
                        Outwards
                    </button>
                </div>
            </div>

            {/* Notes Section - Changes based on direction */}
            <div className="grid lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300" key={direction}>
                <div className="space-y-4">
                    {/* Different Note 1 for In vs Out */}
                    {!isOut ? (
                        <NoteCard number="1" title="Pilot Boarding Ground">
                            PILOT BOARDING GROUND- MILFORD SOUND. ARRIVING VESSELS to not proceed further EAST then the indicated PBG, for Pilot Boarding.
                            On occasion, Pilots may request vessels to proceed past the PBG for a safer Boarding Option, based on the prevailing weather conditions at the time.
                            A mutually agreed Pilot Boarding Position may be determined on a case by case basis.
                        </NoteCard>
                    ) : (
                        <NoteCard number="1" title="Milford Pilot Disembarkation">
                            Pilots and Vessel Masters will determine the safest position to disembark the vessel, on a case by case basis. The PBG indicated serves only as a guide for disembarkation.
                        </NoteCard>
                    )}

                    <NoteCard number="2" title="Track Information">
                        The tracks shown are approximate. The courses steered and wheel over positions will vary depending upon the following:
                        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                            <li>The size of the vessel (including the draft & speed).</li>
                            <li>The handling characteristics of the vessel.</li>
                            <li>The influence of weather & Current.</li>
                        </ul>
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

            {/* Warnings / Callouts - Update based on direction */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Commit Marker - Only for IN */}
                {!isOut && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 font-bold text-amber-800">
                            <AlertTriangle className="w-4 h-4" /> Commit Point
                        </div>
                        <p className="text-sm text-amber-900">
                            Milford Sound Commit Point. MPX to be completed prior to this position. Vessel passing this position indicates Pilot and Bridge team meet all requirements to enter Milford Sound.
                        </p>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 font-bold text-blue-800">
                        <Info className="w-4 h-4" /> Gale Point
                    </div>
                    <p className="text-sm text-blue-900">
                        Wind shear may be experienced rounding Gale Point. Accelerated wind speeds are common between Gale Point and Copper Point. 'Day Breeze' generally encountered during afternoon.
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 font-bold text-blue-800">
                        <Navigation className="w-4 h-4" /> Navigational Note
                    </div>
                    <p className="text-sm text-blue-900">
                        Local Tourist vessels navigate in a clockwise direction. Other vessels and kayaks may be encountered.
                    </p>
                </div>
            </div>

            {/* Waypoints Table */}
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-bold text-center mb-2">
                Wheel Over and PI for reference purpose only, not official.
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500" key={`table-${direction}`}>
                <div className="bg-fiordland-900 px-6 py-4 border-b border-fiordland-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-brand-gold" />
                        <h2 className="text-white font-bold text-lg">Waypoints: Milford Sound - {isOut ? 'OUT' : 'IN'}</h2>
                    </div>
                    <div className="px-3 py-1 bg-fiordland-800 rounded text-xs font-mono text-fiordland-300">
                        {isOut ? 'WP008 → WP001' : 'WP001 → WP008'}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">WPT</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Radius (nm)</th>
                                <th className="px-6 py-3">Course</th>
                                <th className="px-6 py-3">Dist (nm)</th>
                                <th className="px-6 py-3">Speed (kn)</th>
                                <th className="px-6 py-3 text-brand-teal">P.I. Ref</th>
                                <th className="px-6 py-3 text-brand-teal">Wheel Over</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {waypoints.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-brand-teal">{row.wpt}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.rad}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono">{row.crs}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.dist}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.spd}</td>
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
                                <td colSpan={4} className="px-6 py-3 font-bold text-right text-gray-700">Total</td>
                                <td className="px-6 py-3 font-bold text-fiordland-900">10nm</td>
                                <td className="px-6 py-3 font-bold text-fiordland-900">~1h 09m</td>
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
        <div className={`p-4 rounded-xl border border-gray-200 bg-white ${className}`}>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                <span className="bg-fiordland-900 text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">{number}</span>
                {title}
            </h3>
            <div className="text-xs text-gray-700 leading-relaxed">
                {children}
            </div>
        </div>
    )
}
