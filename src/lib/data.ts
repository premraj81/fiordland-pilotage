export const CHECKLISTS = {
    'combined': {
        title: 'Passage Plan Checklist EMPX - Fiordland',
        sections: [
            {
                id: 'header',
                title: 'Vessel Details',
                fields: [
                    { id: 'vesselName', label: 'Vessel Name', type: 'text' },
                    { id: 'plannedRoute', label: 'Planned Route', type: 'route-selector' },
                    // { id: 'previousPort', label: 'Previous Port', type: 'text' }, // Already Added by user previously? No, I need to check if I added it. Wait, I added it in my THOUGHTS but did I execute?
                    // I will check the file content again or just add them now to be safe.
                    // Actually, the previous VIEW showed lines 1-85 and I didn't see Previous Port. So I missed adding it in step 1147!
                    // I will add them now.
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
                    "Stewart Island",
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
    },
    'stewart-island': {
        title: 'Passage Plan Checklist EMPX - Stewart Island',
        sections: [
            {
                id: 'header',
                title: 'Vessel Details',
                fields: [
                    { id: 'vesselName', label: 'Vessel Name', type: 'text' },
                    // Route selector might need specific Stewart Island routes, but I'll leave the generic structure
                    { id: 'plannedRoute', label: 'Planned Route', type: 'route-selector' },
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
                    "Agreement on passage plan",
                    "General alert on VHF channel 16",
                    "VHF channels 16/14 to be monitored",
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
                title: 'Briefings completed',
                items: [
                    "Paterson Inlet",
                    "Port Pegasus",
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
                title: "Stewart Island Pilot's Pre-Entry Checklist",
                description: "Entry is NOT to be attempted if any of the below navigational factors are present.",
                instruction: 'Check box if factor is PRESENT (Entry Prohibited) or leave empty if verify ABSENT.',
                items: [
                    "Wind speed in excess of limits",
                    "Weather conditions unsuitable",
                    "Conflicting traffic",
                    "No preferred safe vessel passing point"
                ]
            }
        ],
        finalSignatures: ['Pilot (Pre-Entry)']
    },
    'more-precise': {
        title: 'Passage Plan Checklist (More Precise) - Optional',
        sections: [
            {
                id: 'header',
                title: 'Vessel Details',
                fields: [
                    { id: 'vesselName', label: 'Vessel Name', type: 'text' },
                    { id: 'date', label: 'Date', type: 'text' }, // Adding Date as per image header
                    { id: 'master', label: 'Master', type: 'text' }, // Adding Master as per image header
                    { id: 'drafts', label: 'Drafts', type: 'text' }, // Adding Drafts as per image header
                ]
            },
            {
                id: 'vessel-elements',
                title: 'Vessel Elements',
                items: [
                    "Pilot Card Presented (Including Ship Particulars/Main Engine Info/Wheel House Poster Sighted)",
                    "Steering Mode Established/Multiple Units Running/Steering Tests Completed",
                    "Rudder(s): Number, Type, Maximum Angles & ROT Established",
                    "ER Manned/ME(s) Ready/Astern Test Completed/Type (RH Fixed, CPP Direction & Default, etc.)",
                    "Thrusters: Number, Type and Availability",
                    "Sufficient Trim/Propeller(s) Submerged at Present Draft",
                    "Anchors Cleared Away",
                    "Recent or Planned Repairs or Maintenance to Critical Machinery",
                    "Sufficient Start Air (In Particular if Coming From Anchorage)",
                    "Vessel Deficiencies or Unusual or Ship-Specific Maneuvering Characteristics"
                ]
            },
            {
                id: 'navigation-elements',
                title: 'Navigation Elements',
                items: [
                    "Navigation Equipment Identified: RAI/ROT/RPM/Pitch Indicators, Echo Sounder, Speed Log, VHF's",
                    "Radar & ECDIS Designated for Pilot Use (See Reverse)",
                    "Gyro Error Reported and Confirmed as Able/ Repeaters Synchronized to Main Gyro",
                    "Discussion of Passage Plan, Including Turn in Milford Sound, Expected Speeds, XTE & ROT",
                    "Abort Points, Deviation Options, Emergency Anchorages and Safe Grounding Areas Discussed",
                    "ES Deed of Agreement Restrictions on Navigation/Emissions/Discharges/Tendering",
                    "Minimum Depth Beneath Keel (Static and Dynamic)",
                    "Weather Conditions Including Forecast Wind and Visibility",
                    "Tidal & Current Information Including Current at Significant Angle to Track",
                    "VHF 16/14/10/62 (Fiordland), 16/65/71 (S.I.); Safety Call VHF Channel 16 (Pos/Intent/ETA/ETD)",
                    "Expected Traffic to be Encountered",
                    "Critical Points of Transit",
                    "Passenger Disembark/Tender Name & ETA/Maneuver Discussed"
                ]
            },
            {
                id: 'brm-elements',
                title: 'BRM Elements',
                items: [
                    "Bridge Team Members Identified and Responsibilities Defined: Monitor Helm/Engine Commands, Monitor Passage Plan, Announce Wheel-Over Points, Dedicated Look-Out Duties",
                    "Master Familiarity with Transit/Port?",
                    "Bridge Team Members Rested & Fit for Duty/Additional Resources Available as Needed?",
                    "On-board Emergency: Responsibilities Discussed",
                    "Pilot to be Advised immediately of any Problems with Steering or Delays with Engine Maneuvers",
                    "Closed-Loop Communications",
                    "English as Designated Language",
                    "Pilot to Welcome and Respond to Any Concerns, Questions and Challenges"
                ]
            },
            {
                id: 'pilots-radar',
                title: "Pilot's Radar",
                items: [
                    "North Up, Relative Motion",
                    "GNSS Stabilization (Navigation) or Water Track Stabilization (Collision Avoidance) and How to Toggle",
                    "Relative Vectors/True Trails (Long: 90 or 180 seconds) and How to Toggle",
                    "Short Pulse Width",
                    "OOW to Demonstrate or Perform ARPA, P.I. and Trial Maneuver Functions as Requested",
                    "2/3 Offset, 1 x EBL & VRM Active",
                    "E.I.U. (ECDIS Interface Underlay) on but set to Minimal Brightness",
                    "S-Band/X-Band Interchange?",
                    "Performance Monitor (Checks Performed Regularly)?",
                    "Auto or Manual Tune, and How to Toggle",
                    "Auto or Manual Filters, and How to Toggle",
                    "TMC (Transmitting Magnetic Compass) input Available in Event of Gyro Dropout?",
                    "Blind Sectors Noted?"
                ]
            },
            {
                id: 'pilots-ecdis',
                title: "Pilot's ECDIS",
                items: [
                    "North Up, Relative Motion",
                    "GNSS Input Verified, No Offsets, Correct Datum",
                    "Approved/Corrected ENC's",
                    "Latest Software Updates",
                    "Back-up Source (Redundant ECDIS or Paper Charts)",
                    "R.I.O. (Radar Interface Overlay) on but set to Minimal Brightness",
                    "AIS Input with Correct Dynamic, Voyage and Navigation Status",
                    "Heading Line/Course Vector (6 min Recommended)",
                    "Vessel Outline Predictor On (180 Seconds), Curved Heading Line Off",
                    "Agreed Route with Wheel-Over Points and XTE Margins Displayed",
                    "Safety Parameters: Shallow Contour (= Vsl Draft), Safety Contour (1.5 x Vsl Draft), Safety Depth (1.5 x Vsl Draft), Deep Contour (2 x Vsl Draft), Spot Soundings (4 x Vsl Draft)"
                ]
            }
        ],
        signatures: ['Master', 'Pilot']
    },
    'peer-review': {
        title: 'Pilot Assessment Peer Review',
        sections: [
            {
                id: 'header',
                title: 'Assessment Details',
                fields: [
                    { id: 'trainee', label: 'Trainee Pilot / Pilot', type: 'text' },
                    { id: 'vesselName', label: 'Vessel', type: 'text' },
                    { id: 'area', label: 'Pilotage area', type: 'text' },
                    { id: 'grt_loa', label: 'GRT/LOA', type: 'text' },
                    { id: 'assessor', label: 'Assessor', type: 'text' },
                    { id: 'master_name', label: 'Master', type: 'text' },
                    { id: 'qualified_pilot', label: 'Qualified Fiordland Pilot', type: 'text' },
                    { id: 'wx_sea', label: 'Weather - Sea', type: 'text', width: 'quarter' },
                    { id: 'wx_swell', label: 'Swell', type: 'text', width: 'quarter' },
                    { id: 'wx_wind', label: 'Wind', type: 'text', width: 'quarter' },
                    { id: 'wx_vis', label: 'Vis', type: 'text', width: 'quarter' },
                ]
            },
            {
                id: 'assessment',
                title: 'Assessment Tasks',
                type: 'grading',
                items: [
                    { id: 'radio', task: 'Radio Contact', subtext: 'Correct Radio procedure adhered to' },
                    { id: 'embarkation', task: 'Pilot embarkation', subtext: 'Ensure good lee and speed for transfer' },
                    { id: 'exchange', task: 'Master/Pilot Exchange', subtext: 'Allow sufficient time and conduct in an open friendly manner!' },
                    { id: 'plan', task: 'Passage Plan', subtext: 'Discuss route, "no go" areas, thrusters, expected wx, areas, manoeuvrability, etc' },
                    { id: 'brm', task: 'BRM', subtext: 'Integrate into the bridge team, closed loop communications' },
                    { id: 'navigation', task: 'Navigation of Vessel', subtext: 'Maintain Vessel in safe position at all times, maintain good communications with Bridge team' },
                    { id: 'awareness', task: 'Positional Awareness', subtext: 'Maintain awareness of vessel position when manoeuvring' },
                    { id: 'manoeuvre', task: 'Manoeuvre Vessel', subtext: 'Maintain control of vessel at all times when manoeuvring' },
                    { id: 'debrief', task: 'Debrief', subtext: 'Conduct a debrief with the Master /Bridge team' },
                    { id: 'disembark', task: 'Disembarking', subtext: 'Provide good lee and speed for transfer' },
                ]
            },
            {
                id: 'scoring',
                title: 'Scoring Table',
                type: 'info',
                text: [
                    "1 - Results achieved exceeded a standard for consistent safe operation",
                    "2 - Results achieved meet the requirements and exceeded requirements in some aspects",
                    "3 - Results achieved meet a standard for consistent safe operation",
                    "4 - Results achieved meet the requirements but deficient in some aspects – not acceptable",
                    "5 - Results achieved did not meet the standard for consistent safe operation – not acceptable"
                ]
            }
        ],
        signatures: ['Reviewer', 'Trainee Pilot/Pilot']
    }
}
