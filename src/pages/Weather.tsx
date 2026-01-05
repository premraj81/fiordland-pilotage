
import { useState } from 'react';
import { Wind, Camera, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

const WEATHER_STATIONS = [
    {
        id: 'st-annes',
        title: "St Anne's Point",
        tabs: [
            {
                id: 'wind',
                label: 'Wind Speed',
                icon: <Wind className="w-4 h-4" />,
                url: 'https://www.metdata.net.nz/es/stanne/'
            },
            {
                id: 'cam1',
                label: 'Camera A',
                icon: <Camera className="w-4 h-4" />,
                url: 'https://www.metdata.net.nz/es/stanne/cam1/'
            }
        ]
    }
];

export default function Weather() {
    const [activeStation] = useState(WEATHER_STATIONS[0]);
    const [activeTab, setActiveTab] = useState(activeStation.tabs[0]);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-fiordland-900">Weather Info</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-fiordland-800 flex items-center gap-2">
                        {activeStation.title}
                    </h2>

                    <div className="flex bg-gray-100 p-1 rounded-lg self-start">
                        {activeStation.tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                    activeTab.id === tab.id
                                        ? "bg-white text-brand-teal shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative bg-gray-50 h-[600px] w-full">
                    {/* Toolbar for external link fallback */}
                    <div className="absolute top-0 right-0 p-2 z-10">
                        <a
                            href={activeTab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-fiordland-600 hover:text-brand-teal shadow-sm"
                        >
                            Open in New Tab <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <iframe
                        key={activeTab.url}
                        src={activeTab.url}
                        className="w-full h-full border-0"
                        title={activeTab.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        loading="lazy"
                    />
                </div>
                <div className="bg-blue-50 p-3 text-xs text-blue-800 text-center border-t border-blue-100">
                    Note: If relevant content does not load, please use the "Open in New Tab" button.
                </div>
            </div>
        </div>
    );
}
