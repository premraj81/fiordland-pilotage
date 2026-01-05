import { useState } from 'react';
import { BellRing, Mic, Anchor, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const NOTIFICATIONS = [
    {
        id: 'all',
        label: 'All Stations',
        title: 'General Notification',
        transitInfo: 'General broadcast for all vessels',
        requirement: 'Broadcast to all stations',
        script: [
            "ALL STATIONS x 3",
            "ALL VESSELS PLEASE BE AWARE OF OUR PASSAGE AND THE VESSEL'S LIMITATIONS WITH REGARDS TO TURNING AND EXTENDED STOPPING DISTANCES.",
            "IT IS OUR INTENTION TO MAINTAIN A TRACK APPROXIMATELY IN THE CENTRE OF THE SOUND(S), AND IT WOULD BE APPRECIATED IF YOU COULD ADVISE OF YOUR INTENTIONS.",
            "OVER."
        ]
    },
    {
        id: 'milford',
        label: 'Milford Sound',
        title: 'Milford Sound Notification',
        transitInfo: 'Transit at ~12 knots',
        requirement: 'St Anne Point to Head and return',
        script: [
            "SECURITE, SECURITE, SECURITE, ALL STATIONS, ALL STATIONS, ALL STATIONS",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\"",
            "WE ARE [DIST] NM FROM ST ANNE POINT, PROCEEDING INBOUND TO MILFORD SOUND.",
            "OUR INTENTION IS TO TRANSIT INBOUND MILFORD SOUND AT APPROXIMATELY 12 KNOTS, TURNING THE VESSEL AT THE HEAD OF THE SOUND (AND PERFORMING PASSENGER TRANSFER VIA TENDER EAST OF SINBAD GULLEY) AND PROCEEDING OUTBOUND (STOPPING BRIEFLY AT STIRLING FALLS FOR VIEWING).",
            "ETA TO THE ENTRANCE OF MILFORD SOUND [TIME], AT THE HEAD OF MILFORD SOUND [TIME], AND CLEARING MILFORD SOUND FOR SEA AT [TIME].",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\", LISTENING ON VHF CHANNELS 16, 14, 10, 62 (73). OUT."
        ]
    },
    {
        id: 'doubtful-thompson',
        label: 'Doubtful to Thompson',
        title: 'Doubtful Sound to Thompson Sound',
        transitInfo: 'Transit at ~16 knots',
        requirement: 'Febrero Point to Common Head/Exit',
        script: [
            "SECURITE, SECURITE, SECURITE, ALL STATIONS, ALL STATIONS, ALL STATIONS",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\"",
            "WE ARE [DIST] NM FROM FEBRERO POINT, PROCEEDING INBOUND TO DOUBTFUL SOUND.",
            "OUR INTENTION IS TO TRANSIT INBOUND DOUBTFUL SOUND AT APPROXIMATELY 16 KNOTS, ROUNDING JAMIESON HEAD, TRANSITING EAST THRU PATEA (GAOL) PASSAGE, CONTINUING SOUTH OF BAUZA ISLAND, SHAPING UP FOR PENDULO REACH, ROUNDING COMMON HEAD AND PROCEEDING NORTHBOUND THRU THOMPSON SOUND.",
            "ETA TO THE ENTRANCE OF DOUBTFUL SOUND [TIME], AT COMMON HEAD (10 NM / ½ WAY) [TIME], AND CLEARING THOMPSON SOUND FOR SEA AT APPROXIMATELY [TIME].",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\", LISTENING ON VHF CHANNELS 16, 10, (73). OUT."
        ]
    },
    {
        id: 'thompson-doubtful',
        label: 'Thompson to Doubtful',
        title: 'Thompson Sound to Doubtful Sound',
        transitInfo: 'Transit at ~16 knots',
        requirement: 'Colonial Head to Exit',
        script: [
            "ALL STATIONS, ALL STATIONS, ALL STATIONS",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\"",
            "WE ARE CURRENTLY [DIST] NM NW OF COLONIAL HEAD, PROCEEDING INBOUND TO THOMPSON SOUND.",
            "OUR INTENTION IS TO TRANSIT SOUTHBOUND THOMPSON SOUND AT APPROXIMATELY 16 KNOTS, ROUNDING COMMON HEAD WEST OF SEYMOUR ISLAND, PROCEEDING WESTBOUND THRU DOUBTFUL SOUND SOUTH OF BAUZA ISLAND, NORTHWEST THRU GAOL PASSAGE, AND HENCE TO SEA.",
            "ETA TO THE ENTRANCE OF THOMPSON SOUND [TIME], AT COMMON HEAD (10 NM / ½ WAY) [TIME], AND CLEARING DOUBTFUL SOUND FOR SEA AT APPROXIMATELY [TIME].",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\", LISTENING ON VHF CHANNELS 16, 10 (73). OUT."
        ]
    },
    {
        id: 'dusky-breaksea',
        label: 'Dusky to Breaksea',
        title: 'Dusky Sound to Breaksea Sound',
        transitInfo: 'Transit at ~16 knots',
        requirement: 'South Point to Breaksea Exit',
        script: [
            "SECURITE, SECURITE, SECURITE, ALL STATIONS, ALL STATIONS, ALL STATIONS",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\"",
            "WE ARE [DIST] NM FROM SOUTH POINT. OUR INTENTION IS TO PROCEED INBOUND TO DUSKY SOUND AT APPROXIMATELY 16 KNOTS, TRANSITING NORTH OF INDIAN AND LONG ISLANDS, THRU THE BOWEN CHANNEL, SHAPING UP FOR ACHERON PASSAGE, NORTHBOUND THRU ACHERON PASSAGE INTO BREAKSEA SOUND, PASSING WEST OF ENTRY ISLAND, AND DEPARTING BREAKSEA SOUND BETWEEN BREAKSEA ISLAND AND ROCKY POINT.",
            "ETA TO THE ENTRANCE OF DUSKY SOUND [TIME], ENTERING ACHERON PASSAGE (16 NM / 1 HR) [TIME], AND CLEARING BREAKSEA SOUND FOR SEA AT APPROXIMATELY [TIME].",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\", LISTENING ON VHF CHANNELS 16, 10 (73). OUT."
        ]
    },
    {
        id: 'breaksea-dusky',
        label: 'Breaksea to Dusky',
        title: 'Breaksea Sound to Dusky Sound',
        transitInfo: 'Transit at ~15 knots',
        requirement: 'Rocky Point to Dusky Exit',
        script: [
            "ALL STATIONS, ALL STATIONS, ALL STATIONS",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\"",
            "WE ARE CURRENTLY [DIST] NM NW OF ROCKY POINT, PROCEEDING INBOUND TO BREAKSEA SOUND.",
            "OUR INTENTION IS TO TRANSIT SOUTHBOUND BREAKSEA SOUND AT 15 KNOTS, TRANSITING WEST OF ENTRY ISLAND, SOUTH THRU ACHERON PASSAGE, WEST THRU THE BOWEN CHANNEL, SOUTH OF THRUM CAP AND NORMAN’S ISLAND, AND HENCE TO SEA.",
            "ETA TO THE ENTRANCE OF BREAKSEA SOUND [TIME], ABEAM OF PORPOISE PT (14 NM) [TIME], AND CLEARING DUSKY SOUND FOR SEA AT APPROXIMATELY [TIME].",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\", LISTENING ON VHF CHANNELS 16, 10 (73). OUT."
        ]
    },
    {
        id: 'stewart-island',
        label: 'Stewart Island',
        title: 'Stewart Island Notification',
        transitInfo: 'Inbound through Abbott Passage',
        requirement: 'Bench Island to Anchorage',
        script: [
            "SECURITE, SECURITE, SECURITE, ALL STATIONS, ALL STATIONS, ALL STATIONS",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\"",
            "WE ARE [DIST] NM FROM BENCH ISLAND. OUR INTENTION IS TO PROCEED INBOUND THROUGH ABBOTT PASSAGE TO HALF MOON BAY / PATTERSON INLET",
            "A) ANCHORING AT THE MOUTH OF HALF MOON BAY NORTHWEST OF ACKERS POINT",
            "B) ANCHORING NORTH OF ULVA ISLAND AND CONDUCTING PASSENGER TRANSIT OPERATIONS BY TENDER UNTIL APPROXIMATELY [TIME].",
            "THIS IS THE PASSENGER VESSEL \"[NAME]\", LISTENING ON VHF CHANNELS 16, 65, (71) OUT."
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
