export const CHECKLISTS = {
    'combined': {
        title: 'Fiordland Pilotage Form',
        sections: [
            {
                id: 'header',
                title: 'Vessel Details',
                fields: [
                    { id: 'vesselName', label: 'Vessel Name', type: 'text' },
                    { id: 'plannedRoute', label: 'Planned Route / Embark / Disembark', type: 'route-selector' },
                    { id: 'previousPort', label: 'Previous Port', type: 'text' },
                    { id: 'nextPort', label: 'Next Port', type: 'text' },
                ]
            },
            {
                id: 'vessel-elements',
                title: 'Vessel Elements',
                items: [
                    "Ship's pilot card presented",
                    "Steering mode established",
                    "Desired maximum rate of turn established",
                    "Thrusters available",
                    "Main engine ready for use",
                    "Any deficiencies of ship that may influence the passage"
                ]
            },
            {
                id: 'navigation-elements',
                title: 'Navigation Elements',
                items: [
                    "Navigation equipment identified",
                    "Radar and ECDIS for pilot use set-up & vector/predictor length confirmed",
                    "Agreement on passage plan, incl. turning in Milford Sound",
                    "General alert on VHF channel 16",
                    "VHF channels 16/14/10 to be monitored",
                    "Critical points of transit discussed",
                    "Weather conditions discussed, incl. expected visibility and wind",
                    "Traffic likely to be encountered discussed",
                    "Need for stabilisers discussed"
                ]
            },
            {
                id: 'brm-elements',
                title: 'BRM Elements',
                items: [
                    "Responsibilities defined",
                    "Deviations from plan to be challenged"
                ]
            },
            {
                id: 'briefings',
                title: 'Briefings completed for each fiord',
                items: [
                    "Milford",
                    "Doubtful / Thompson",
                    "Breaksea / Dusky",
                    "Other"
                ]
            },
            {
                id: 'notes',
                title: 'Notes',
                fields: [
                    { id: 'exchangeNotes', label: 'Master / Pilot Exchange Notes', type: 'textarea' }
                ]
            }
        ],
        signatures: ['Master', 'Pilot'],
        finalSections: [
            {
                id: 'pre-entry',
                title: "Fiordland Pilot's Pre-Entry Checklist",
                description: "Entry into any of the Fiords is NOT to be attempted if any of the below navigational factors are present.",
                instruction: 'Check box if factor is PRESENT (Entry Prohibited) or leave empty if verify ABSENT.',
                items: [
                    "Wind speed in excess of 40+ knots, in particular Copper Point, Milford Sound",
                    "Copper Point weather station down and wind strength is unable to be assessed",
                    "Arriving vessel has not downloaded the approved Environment Southland Passage Plan/s",
                    "Conflicting outbound traffic from Milford Sound",
                    "No preferred safe vessel passing point within the fiord"
                ]
            }
        ],
        finalSignatures: ['Pilot (Pre-Entry)']
    }
}
