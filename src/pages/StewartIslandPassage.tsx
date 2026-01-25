import { useState } from 'react';
import { cn } from '../lib/utils';

type MapView =
    | 'eastern-approach'
    | 'eastern-departure'
    | 'eastern-departure-south-ulva'
    | 'northern-approach'
    | 'northern-departure'
    | 'northern-departure-south-ulva';

const MAPS = [
    { id: 'eastern-approach', label: 'Eastern Approach', src: '/maps/stewart_eastern_approach.jpg' },
    { id: 'eastern-departure', label: 'Eastern Departure', src: '/maps/stewart_eastern_departure.jpg' },
    { id: 'eastern-departure-south-ulva', label: 'Eastern Dep. (S of Ulva)', src: '/maps/stewart_eastern_departure_south_ulva.jpg' },
    { id: 'northern-approach', label: 'Northern Approach', src: '/maps/stewart_northern_approach.jpg' },
    { id: 'northern-departure', label: 'Northern Departure', src: '/maps/stewart_northern_departure.jpg' },
    { id: 'northern-departure-south-ulva', label: 'Northern Dep. (S of Ulva)', src: '/maps/stewart_northern_departure_south_ulva.jpg' },
] as const;

export default function StewartIslandPassage() {
    const [activeTab, setActiveTab] = useState<MapView>('eastern-approach');

    const currentMap = MAPS.find(m => m.id === activeTab) || MAPS[0];

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">
                        Stewart Island Passage
                    </h1>
                    <p className="text-fiordland-500">Separation Point / Paterson Inlet</p>
                </div>

                {/* Tabs Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-100 p-2 rounded-xl">
                    {MAPS.map((map) => (
                        <button
                            key={map.id}
                            onClick={() => setActiveTab(map.id as MapView)}
                            className={cn(
                                "px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                                activeTab === map.id
                                    ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                    : "bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900"
                            )}
                        >
                            {map.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="w-full relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <img
                        key={currentMap.src} // Force re-render for clean transition
                        src={currentMap.src}
                        alt={`Map of ${currentMap.label}`}
                        className="w-full h-auto object-contain"
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    <p className="text-sm font-medium text-fiordland-600 bg-fiordland-50 px-4 py-2 rounded-full border border-fiordland-100">
                        Map: Stewart Island - {currentMap.label}
                    </p>
                </div>
            </div>

            <NoteCard number="!" title="Disclaimer">
                These maps are for reference only. Please consult official charts and publications for navigation.
            </NoteCard>
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
