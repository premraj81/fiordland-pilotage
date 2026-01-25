import { useState } from 'react';
import { cn } from '../lib/utils';

export default function StewartIslandPassage() {
    const [activeTab, setActiveTab] = useState<'eastern' | 'northern'>('eastern');

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-fiordland-900">
                        Stewart Island Passage
                    </h1>
                    <p className="text-fiordland-500">Separation Point / Paterson Inlet</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => setActiveTab('eastern')}
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                            activeTab === 'eastern'
                                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                    >
                        Eastern Approach
                    </button>
                    <button
                        onClick={() => setActiveTab('northern')}
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                            activeTab === 'northern'
                                ? "bg-brand-teal text-white shadow-md shadow-brand-teal/20"
                                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        )}
                    >
                        Northern Departure
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="w-full relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <img
                        src={activeTab === 'eastern' ? "/maps/stewart_eastern_approach.jpg" : "/maps/stewart_northern_departure.jpg"}
                        alt={activeTab === 'eastern' ? "Stewart Island Eastern Approach Map" : "Stewart Island Northern Departure Map"}
                        className="w-full h-auto object-contain"
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    <p className="text-sm font-medium text-fiordland-600 bg-fiordland-50 px-4 py-2 rounded-full border border-fiordland-100">
                        {activeTab === 'eastern' ? "Map: Stewart Island - Eastern Approach" : "Map: Stewart Island - Northern Departure"}
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
