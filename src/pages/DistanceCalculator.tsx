import { useState, useMemo } from 'react';
import { Navigation, ArrowRight, Calculator, Clock, Gauge } from 'lucide-react';

interface RouteData {
    from: string;
    to: string;
    distance: number;
}

const DISTANCE_DATA: RouteData[] = [
    { from: 'Milford Sound', to: 'Thompson Sound', distance: 47.0 },
    { from: 'Milford Sound', to: 'Breaksea Sound', distance: 78.0 },
    { from: 'Milford Sound', to: 'Dusky Sound', distance: 98.0 },
    { from: 'Milford Sound', to: 'Ackers Lt.(Stewart Is.)', distance: 211.0 },
    { from: 'Milford Sound', to: 'Port Chalmers Pilot', distance: 336.0 },
    { from: 'Milford Sound', to: 'Lyttelton Pilot', distance: 525.0 },
    { from: 'Dusky Sound', to: 'Bluff', distance: 116.0 },
    { from: 'Dusky Sound', to: 'Ackers Lt.', distance: 113.0 },
    { from: 'Dusky Sound', to: 'Port Chalmers Pilot', distance: 238.0 },
    { from: 'Dusky Sound', to: 'Lyttelton Pilot', distance: 427.0 },
    { from: 'Dusky Sound', to: 'Wellington (via East Coast)', distance: 572.0 },
    { from: 'Doubtful Sound', to: 'Port Chalmers Pilot', distance: 280.0 },
    { from: 'Doubtful Sound', to: 'Lyttelton Pilot', distance: 469.0 },
    { from: 'Bench Island (St.Is)', to: 'Port Chalmers Pilot', distance: 136.0 },
    { from: 'Bench Island (St.Is)', to: 'Lyttelton Pilot', distance: 325.0 },
    { from: 'Wellington', to: 'Milford(via West Coast)', distance: 465.0 },
    { from: 'Wellington', to: 'Dusky (via West Coast)', distance: 560.0 },
    { from: 'Picton', to: 'Milford(via West Coast)', distance: 440.0 },
    { from: 'Picton', to: 'Dusky (via West Coast)', distance: 535.0 },
    { from: 'Milford Sound', to: 'Sydney Pilot', distance: 1000.0 },
    { from: 'Milford Sound', to: 'Hobart Pilot', distance: 890.0 },
    { from: 'Dusky Sound', to: 'Sydney Pilot', distance: 1000.0 },
    { from: 'Dusky Sound', to: 'Hobart Pilot', distance: 840.0 },
];

export default function DistanceCalculator() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [speed, setSpeed] = useState<string>('');
    const [calculatedValues, setCalculatedValues] = useState<{ distance: number, time: number } | null>(null);

    // Get unique origins
    const origins = useMemo(() => {
        return Array.from(new Set(DISTANCE_DATA.map(d => d.from))).sort();
    }, []);

    // Get destinations based on selected origin
    const availableDestinations = useMemo(() => {
        if (!origin) return [];
        return DISTANCE_DATA
            .filter(d => d.from === origin)
            .map(d => d.to)
            .sort();
    }, [origin]);

    const calculate = () => {
        if (!origin || !destination) return;

        const route = DISTANCE_DATA.find(d => d.from === origin && d.to === destination);

        if (route) {
            let time = 0;
            const spd = parseFloat(speed);
            if (!isNaN(spd) && spd > 0) {
                time = route.distance / spd;
            }
            setCalculatedValues({ distance: route.distance, time });
        }
    };

    const formatTime = (hours: number) => {
        if (hours === 0) return '-';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);

        // Format as Days Hours Minutes if > 24h
        if (h >= 24) {
            const d = Math.floor(h / 24);
            const remH = h % 24;
            return `${d}d ${remH}h ${m}m`;
        }

        return `${h}h ${m}m`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-fiordland-900">Distance Calculator</h1>
                <p className="text-fiordland-500">Calculate distances and transit times between pilot stations.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

                {/* Speed Input Section */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-brand-teal" />
                        Vessel Speed (knots)
                    </label>
                    <div className="max-w-xs relative">
                        <input
                            type="number"
                            value={speed}
                            onChange={(e) => setSpeed(e.target.value)}
                            placeholder="Enter speed..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none font-medium text-lg"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">kn</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Origin</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <select
                                value={origin}
                                onChange={(e) => {
                                    setOrigin(e.target.value);
                                    setDestination(''); // Reset destination on origin change
                                    setCalculatedValues(null);
                                }}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                            >
                                <option value="">Select start point</option>
                                {origins.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="hidden md:flex justify-center pb-4">
                        <div className="p-2 bg-gray-50 rounded-full">
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Destination</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <select
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    setCalculatedValues(null);
                                }}
                                disabled={!origin}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">Select destination</option>
                                {availableDestinations.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={calculate}
                    disabled={!origin || !destination}
                    className="w-full bg-brand-teal text-white font-medium py-3 rounded-xl hover:bg-brand-teal/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-teal/20"
                >
                    <Calculator className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {calculatedValues && (
                <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-teal/30 transition-colors">
                        <div>
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider block mb-1">Total Distance</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-fiordland-900">{calculatedValues.distance}</span>
                                <span className="text-gray-500 font-medium">NM</span>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                            <Navigation className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-teal/30 transition-colors">
                        <div>
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider block mb-1">Estimated Time</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-fiordland-900">
                                    {calculatedValues.time > 0 ? formatTime(calculatedValues.time) : '--'}
                                </span>
                            </div>
                            {calculatedValues.time === 0 && (
                                <span className="text-xs text-orange-500 mt-1 block">Enter speed for time estimate</span>
                            )}
                        </div>
                        <div className={`p-4 rounded-xl transition-colors ${calculatedValues.time > 0 ? 'bg-green-50 text-green-600 group-hover:bg-green-100' : 'bg-gray-50 text-gray-400'}`}>
                            <Clock className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center text-xs text-gray-400">
                Data provided by Fiordland Pilot Services
            </div>
        </div>
    );
}

function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
