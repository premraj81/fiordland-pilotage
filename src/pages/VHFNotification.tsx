import { useState } from 'react';
import { BellRing, Mic, Anchor, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const NOTIFICATIONS = [
    {
        id: 'milford',
        label: 'Milford Sound',
        title: 'Milford Sound Notification',
        transitInfo: 'Transit time at 10 - 12kts = 1hr 50m approx',
        requirement: 'Require time abeam of St Annes Lt to get exit time at St Annes Lt',
        script: [
            "ALL STATIONS x 3",
            "THIS IS THE CRUISE VESSEL \"[GIVE NAME]\"",
            "PLEASE BE ADVISED THAT THIS VESSEL WILL BE ABEAM OF ST ANNES POINT LIGHT AT THE ENTRANCE TO MILFORD SOUND AT \"[GIVE TIME]\"",
            "IT IS OUR INTENTION TO TRANSIT MILFORD SOUND AND TURN THE VESSEL IN THE AREA OF HARRISONS COVE. EXITING MILFORD SOUND AT APPROXIMATELY \"[GIVE TIME]\"",
            "ALL VESSELS PLEASE BE AWARE OF OUR PASSAGE AND THE VESSELS LIMITATIONS WHEN TURNING AT DALE POINT AND OFF HARRISONS COVE. IT IS OUR INTENTION TO MAINTAIN A TRACK APPROXIMATELY IN THE CENTRE OF THE SOUND, AND IT WOULD BE APPRECIATED IF YOU COULD ADVISE US OF YOUR INTENTIONS.",
            "THIS IS THE \"[GIVE SHIPS NAME]\" LISTENING OUT ON CHANNEL 16",
            "OVER."
        ]
    },
    {
        id: 'thompson-doubtful',
        label: 'Thompson Entrance',
        title: 'Thompson Sound - Doubtful Sound',
        transitInfo: 'Transit time at 15-16kts = 1hr 30m approx',
        requirement: 'Require time abeam of Colonial Head to get exit time at Doubtful Sound',
        script: [
            "ALL STATIONS x 3",
            "THIS IS THE CRUISE VESSEL \"[GIVE NAME]\"",
            "PLEASE BE ADVISED THAT THIS VESSEL WILL BE ABEAM OF COLONIAL HEAD AT THE ENTRANCE TO THOMPSON SOUND AT \"[GIVE TIME]\"",
            "IT IS OUR INTENTION TO TRANSIT THOMPSON SOUND THROUGH SEYMOURS ISLAND TO DOUBTFUL SOUND, EXITING DOUBTFUL SOUND AT APPROXIMATELY \"[GIVE TIME]\"",
            "ANY VESSELS ALONG THIS ROUTE PLEASE BE AWARE OF OUR PASSAGE AND IT WOULD BE APPRECIATED IF YOU COULD ADVISE US OF YOUR INTENTIONS.",
            "THIS IS THE \"[GIVE SHIPS NAME]\" LISTENING OUT ON CHANNEL 16",
            "OVER."
        ]
    },
    {
        id: 'doubtful-thompson',
        label: 'Doubtful Entrance',
        title: 'Doubtful Sound - Thompson Sound',
        transitInfo: 'Transit time at 15-16kts = 1hr 30m approx',
        requirement: 'Require time abeam of Hares Ears Point to get exit time at Thompson Sound',
        script: [
            "ALL STATIONS x 3",
            "THIS IS THE CRUISE VESSEL \"[GIVE NAME]\"",
            "PLEASE BE ADVISED THAT THIS VESSEL WILL BE ABEAM OF HARES EARS AT THE ENTRANCE TO DOUBTFUL SOUND AT \"[GIVE TIME]\"",
            "IT IS OUR INTENTION TO TRANSIT DOUBTFUL SOUND THROUGH TO SEYMOURS ISLAND THEN THROUGH THOMPSON SOUND, EXITING THOMPSON SOUND AT APPROXIMATELY \"[GIVE TIME]\"",
            "ANY VESSELS ALONG THIS ROUTE PLEASE BE AWARE OF OUR PASSAGE AND IT WOULD BE APPRECIATED IF YOU COULD ADVISE US OF YOUR INTENTIONS.",
            "THIS IS THE \"[GIVE SHIPS NAME]\" LISTENING OUT ON CHANNEL 16",
            "OVER."
        ]
    },
    {
        id: 'breaksea-dusky',
        label: 'Breaksea Entrance',
        title: 'Breaksea Sound - Dusky Sound',
        transitInfo: 'Transit time at 15-16kts = 1hr 30m approx',
        requirement: 'Require time abeam of Breaksea Island to get exit time at Dusky Sound',
        script: [
            "ALL STATIONS x 3",
            "THIS IS THE CRUISE VESSEL \"[GIVE NAME]\"",
            "PLEASE BE ADVISED THAT THIS VESSEL WILL BE ABEAM OF BREAKSEA ISLAND AT THE ENTRANCE TO BREAKSEA SOUND AT \"[GIVE TIME]\"",
            "IT IS OUR INTENTION TO TRANSIT BREAKSEA SOUND THROUGH THE ACHERON PASSAGE THEN THE BOWEN CHANNEL NORTH OF LONG ISLAND, EXITING DUSKY SOUND AT APPROXIMATELY \"[GIVE TIME]\"",
            "ANY VESSELS ALONG THIS ROUTE PLEASE BE AWARE OF OUR PASSAGE AND IT WOULD BE APPRECIATED IF YOU COULD ADVISE US OF YOUR INTENTIONS.",
            "THIS IS THE \"[GIVE SHIPS NAME]\" LISTENING OUT ON CHANNEL 16",
            "OVER."
        ]
    },
    {
        id: 'dusky-breaksea',
        label: 'Dusky Entrance',
        title: 'Dusky Sound - Breaksea Sound',
        transitInfo: 'Transit time at 15-16kts = 1hr 30m approx',
        requirement: 'Require time abeam of South Point to get exit time at Breaksea Sound',
        script: [
            "ALL STATIONS x 3",
            "THIS IS THE CRUISE VESSEL \"[GIVE NAME]\"",
            "PLEASE BE ADVISED THAT THIS VESSEL WILL BE ABEAM OF SOUTH POINT AT THE ENTRANCE TO DUSKY SOUND AT \"[GIVE TIME]\"",
            "IT IS OUR INTENTION TO TRANSIT DUSKY SOUND NORTH OF LONG ISLAND THROUGH THE BOWEN CHANNEL THEN THE ACHERON PASSAGE, EXITING BREAKSEA SOUND AT APPROXIMATELY \"[GIVE TIME]\"",
            "ANY VESSELS ALONG THIS ROUTE PLEASE BE AWARE OF OUR PASSAGE AND IT WOULD BE APPRECIATED IF YOU COULD ADVISE US OF YOUR INTENTIONS.",
            "THIS IS THE \"[GIVE SHIPS NAME]\" LISTENING OUT ON CHANNEL 16",
            "OVER."
        ]
    }
];

export default function VHFNotification() {
    const [selectedId, setSelectedId] = useState(NOTIFICATIONS[0].id);
    const activeData = NOTIFICATIONS.find(n => n.id === selectedId) || NOTIFICATIONS[0];

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-fiordland-900">VHF Notification</h1>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                        {NOTIFICATIONS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                className={cn(
                                    "w-full text-left px-4 py-3 rounded-lg font-medium transition-all mb-1 last:mb-0 flex items-center justify-between",
                                    selectedId === item.id
                                        ? "bg-brand-teal text-white shadow-md relative overflow-hidden"
                                        : "hover:bg-gray-50 text-gray-700"
                                )}
                            >
                                {selectedId === item.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-800/20" />
                                )}
                                <span>{item.label}</span>
                                {selectedId === item.id && <BellRing className="w-4 h-4 text-teal-100" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-fiordland-800 mb-4 flex items-center gap-3">
                            <Anchor className="w-6 h-6 text-brand-gold" />
                            {activeData.title}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Transit Time
                                </h3>
                                <p className="text-blue-800">{activeData.transitInfo}</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <h3 className="text-sm font-semibold text-amber-900 mb-1">Requirement</h3>
                                <p className="text-amber-800">{activeData.requirement}</p>
                            </div>
                        </div>
                    </div>

                    {/* Script Card */}
                    <div className="bg-fiordland-900 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Mic className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-fiordland-700 pb-4">
                                <div className="p-2 bg-brand-gold rounded-lg text-fiordland-900">
                                    <Mic className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-gold">Radio Script</h3>
                            </div>

                            <div className="space-y-4 font-mono text-lg leading-relaxed">
                                {activeData.script.map((line, idx) => (
                                    <p key={idx} className={cn(
                                        "pl-4 border-l-4",
                                        line.startsWith("THIS IS THE") ? "border-brand-gold text-brand-gold font-bold" : "border-fiordland-700 text-gray-200"
                                    )}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
