import { Radio, Anchor, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Info() {
    const channels = [
        { ch: '16', color: 'bg-red-600 text-white', name: 'Emergency / Calling Channel', monitor: 'All vessels and Milford Airport Tower' },
        { ch: '6', color: 'bg-yellow-500 text-black', name: 'Pilot boat Aramoana line of sight Channel', monitor: 'Aramoana (Ch6 Primary - Ch10 Secondary)' },
        { ch: '10', color: 'bg-yellow-500 text-black', name: 'Pilot boat Aramoana line of sight Channel', monitor: 'Aramoana, Fishing Vessels and Kayaks' },
        { ch: '62', color: 'bg-yellow-500 text-black', name: 'Coastal channel via repeater', monitor: 'Aramoana - Can pick up the repeater from Deep Water Basin to talk down the coast\nPilot Boat Aramoana Skippers = Fjord, Mitch, Callum and Cody as crew' },
        { ch: '73', color: 'bg-emerald-700 text-white', name: "Cruise Milford's Vessel 'Milford Adventurer' and Passenger Terminal Desk", monitor: 'This is the Passenger Transfer Vessel\nSkippers = Rodger, Brad, Craig, Dan\n(Milford Adventurer to use STB side of the Cruise Ship for Transfers due to vessel configuration)' },
        { ch: '19', color: 'bg-lime-400 text-black', name: 'Copper Point Weather Station', monitor: "Known as 'Steve' by the Locals" },
        { ch: '14', color: 'bg-rose-300 text-black', name: 'Milford Harbour Control', monitor: 'Harbour Controllers = Chris and Callum' },
        { ch: '74', color: 'bg-sky-200 text-black', name: 'Milford Sound Tourism', monitor: 'MST runs Milford Sounds Infrastructure' },
        { ch: '12', color: 'bg-amber-100 text-black', name: 'Southern Discoveries', monitor: 'Vessels = Pride of Milford, Spirit of Milford, Lady Bowen and Lady Stirling' },
        { ch: '9', color: 'bg-pink-400 text-white', name: 'Real NZ (Rjs)', monitor: 'Vessels = Sinbad, Milford Haven, Milford Mariner, Milford Sovereign and Milford Monarch' },
        { ch: '77', color: 'bg-blue-300 text-black', name: 'Mitre Peak Cruises', monitor: 'Vessels = Mitre Peak I and Mitre Peak II' },
        { ch: '6', color: 'bg-green-400 text-black', name: 'Fiordland Discovery', monitor: 'Vessel = Fiordland Jewel' },
        { ch: '68', color: 'bg-gray-500 text-white', name: 'Pure Milford / Jucy Cruise', monitor: 'Vessel = Gem of the Sound and Maiden of Milford' },
        { ch: '10', color: 'bg-purple-500 text-white', name: "Rosco's Kayaks", monitor: 'Only Kayak company, Guides all have VHFs' },
        { ch: '13', color: 'bg-blue-500 text-white', name: 'Descend Dive', monitor: 'Dive Tour Operator with Bright Orange Boats' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold text-fiordland-900">VHF Channels</h1>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <Radio className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-fiordland-800">Milford Sound VHF Channels</h2>
                        <p className="text-sm text-gray-500">2023/2024 Season</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-4 py-3 font-semibold text-gray-700 w-16">Ch</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                                <th className="px-4 py-3 font-semibold text-gray-700">Monitored By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {channels.map((c, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-2 py-2">
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm", c.color)}>
                                            {c.ch}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900 align-top">
                                        {c.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 align-top whitespace-pre-wrap">
                                        {c.monitor}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Emergency Contacts - Kept as smaller secondary info */}
                <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white rounded-lg text-red-600 shadow-sm">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-red-900">Emergency Contacts</h2>
                    </div>

                    <ul className="space-y-3 text-red-800">
                        <li className="flex justify-between border-b border-red-100 pb-2">
                            <span>Maritime Radio</span>
                            <span className="font-mono font-bold">VHF Ch 16</span>
                        </li>
                        <li className="flex justify-between border-b border-red-100 pb-2">
                            <span>Police (Emergency)</span>
                            <span className="font-mono font-bold">111</span>
                        </li>
                        <li className="flex justify-between border-b border-red-100 pb-2">
                            <span>Coastguard</span>
                            <span className="font-mono font-bold">*500</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-fiordland-900 rounded-2xl p-8 text-white">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Anchor className="w-5 h-5 text-brand-gold" />
                        Navigation Notes
                    </h2>
                    <div className="prose prose-invert max-w-none text-sm">
                        <p>All vessels entering Fiordland must adhere to the Environment Southland Passage Plan requirements.</p>
                        <p>Ensure all biosecurity checks are completed prior to entry. Any hull pests must be reported immediately.</p>
                        <p className="mt-4 text-fiordland-300 font-medium">Always maintain a continuous listening watch on VHF Channel 16.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
