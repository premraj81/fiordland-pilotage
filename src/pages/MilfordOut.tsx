import { Navigation, Info } from 'lucide-react';

export default function MilfordOut() {
    return (
        <div className="max-w-6xl mx-auto pb-12 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">Milford Sound - OUT</h1>
                    <p className="text-fiordland-500">Passage Plan Details and Waypoints</p>
                </div>
                {/* Warning Banner Removed as requested */}
            </div>

            {/* Notes Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <NoteCard number="1" title="Milford Pilot Disembarkation">
                        Pilots and Vessel Masters will determine the safest position to disembark the vessel, on a case by case basis. The PBG indicated serves only as a guide for disembarkation.
                    </NoteCard>
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

            {/* Warnings / Callouts */}
            <div className="grid md:grid-cols-2 gap-4">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-fiordland-900 px-6 py-4 border-b border-fiordland-800 flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-brand-gold" />
                    <h2 className="text-white font-bold text-lg">Waypoints: Milford Sound - OUT</h2>
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { lat: "44° 39.46'S", long: "167° 54.49'E", wpt: "WP008", name: "Milford Sound", rad: "0.5'", crs: "338°", dist: "1.1'", spd: "6" },
                                { lat: "44° 38.38'S", long: "167° 53.88'E", wpt: "WP007", name: "Bridget point", rad: "1.0'", crs: "316°", dist: "1.4'", spd: "8" },
                                { lat: "44° 37.42'S", long: "167° 52.55'E", wpt: "WP006", name: "Mitre Peak", rad: "1.0'", crs: "308°", dist: "1.3'", spd: "8" },
                                { lat: "44° 36.62'S", long: "167° 51.11'E", wpt: "WP005", name: "Copper point", rad: "1.0'", crs: "295°", dist: "0.9'", spd: "8" },
                                { lat: "44° 36.26'S", long: "167° 50.02'E", wpt: "WP004", name: "Stirling Falls", rad: "1.0'", crs: "280°", dist: "0.9'", spd: "10" },
                                { lat: "44° 36.01'S", long: "167° 48.80'E", wpt: "WP003", name: "Dale Point", rad: "0.5'", crs: "340°", dist: "2.9'", spd: "10" },
                                { lat: "44° 33.31'S", long: "167° 47.38'E", wpt: "WP002", name: "St Anne's Point", rad: "0.5'", crs: "294°", dist: "1.6'", spd: "12" },
                                { lat: "44° 33.15'S", long: "167° 45.27'E", wpt: "WP001", name: "Pilot Boarding Ground", rad: "0.5'", crs: "-", dist: "-", spd: "-" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-700">{row.lat}</td>
                                    <td className="px-6 py-4 font-mono text-gray-700">{row.long}</td>
                                    <td className="px-6 py-4 font-semibold text-brand-teal">{row.wpt}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.rad}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono">{row.crs}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.dist}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.spd}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                                <td colSpan={6} className="px-6 py-3 font-bold text-right text-gray-700">Total</td>
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
