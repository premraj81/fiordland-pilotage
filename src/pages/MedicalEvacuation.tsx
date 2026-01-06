import { Phone, Mail, AlertTriangle, Info, MapPin, Clock } from 'lucide-react';

export default function MedicalEvacuation() {
    return (
        <div className="max-w-4xl mx-auto pb-12 space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Port: Fiordland – Cruising Only</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Medical Evacuation Procedure</h1>
                <h2 className="text-xl text-brand-teal font-medium mt-2">From Milford Sound or Sea (If Helivac Facilities Available Onboard)</h2>
            </div>

            {/* Critical Info Card */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg shadow-sm">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                    <div className="space-y-2">
                        <h3 className="font-bold text-amber-900">Important Context</h3>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            Fiordland (Milford Sound) is a Non-Customs/MPI Port and quite remote with <strong>NO medical facilities</strong>.
                            The nearest medical centre is Te Anau (2.5 hrs by single lane outbound road, traffic/weather dependent).
                        </p>
                        <p className="text-amber-800 text-sm">
                            These cases are treated as an emergency. If not covered by insurance, credit card details need to be supplied.
                            Limit of that will likely need to be increased to cover cost (approx $30,000+).
                            <strong>Ship/Cruise line will be responsible for recovering charges.</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* STEPS Container */}
            <div className="space-y-8">

                {/* STEP 1 */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-fiordland-900 p-4 flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <span className="bg-brand-gold text-fiordland-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                            Contact HeliOtago EMS
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="prose prose-sm max-w-none text-gray-600">
                            <p>
                                For all emergency response, <strong>SHIPS DOCTOR</strong> is required to contact HeliOtago EMS (Otago Southland Rescue Helicopter) direct.
                                This is a 24/7 number.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Office</span>
                                <a href="tel:006434893595" className="flex items-center gap-2 text-lg font-bold text-brand-teal hover:underline">
                                    <Phone className="w-4 h-4" /> 0064-3-4893595
                                </a>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Mobile</span>
                                <a href="tel:0064274333036" className="flex items-center gap-2 text-lg font-bold text-brand-teal hover:underline">
                                    <Phone className="w-4 h-4" /> 0064-27-4333036
                                </a>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                            <p className="font-semibold text-blue-900 mb-2">Required Information:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Ship position</li>
                                <li>Sea state</li>
                                <li>Patient condition</li>
                                <li>Retrieval requirements</li>
                                <li>Insurance details / Credit card details</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* STEP 2 */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-fiordland-900 p-4 flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <span className="bg-brand-gold text-fiordland-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                            Inform Port Agents & Terminal
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <p className="text-gray-600 text-sm">
                            Please inform Lyttelton Port Agent <strong>Andrew Smith</strong> regarding tender boat transfer and terminal readiness.
                            He will coordinate the medical debark and advise accordingly. If not available, try next in order:
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                { name: "Andrew Smith", role: "Port Agent Lyttelton", phone: "0064-27-8804453" },
                                { name: "Katja Mewes", role: "Port Agent Bay of Island", phone: "0064-21-02530782" },
                                { name: "Milford Sound Terminal", role: "Office", phone: "0064-3-2499002" },
                                { name: "Richard Carvalho", role: "NZ Cruise Manager", phone: "0064-27-2046634" },
                            ].map((contact, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand-teal/50 transition-colors">
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        <Phone className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{contact.name}</div>
                                        <div className="text-xs text-gray-500">{contact.role}</div>
                                        <a href={`tel:${contact.phone.replace(/-/g, '')}`} className="text-brand-teal font-medium text-sm block mt-1">
                                            {contact.phone}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                                <Mail className="w-4 h-4" /> Follow up Emails
                            </h4>
                            <div className="grid gap-2 text-sm">
                                <a href="mailto:fio.nz@iss-shipping.com" className="text-blue-600 hover:underline">fio.nz@iss-shipping.com</a>
                                <a href="mailto:cruise.nz@iss-shipping.com" className="text-blue-600 hover:underline">cruise.nz@iss-shipping.com</a>
                                <a href="mailto:heli@heliotago.co.nz" className="text-blue-600 hover:underline">heli@heliotago.co.nz</a>
                                <a href="mailto:paramedictl@heliotago.co.nz" className="text-blue-600 hover:underline">paramedictl@heliotago.co.nz</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Critical Warnings Footer */}
            <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5" /> Critical Requirements
                    </h3>
                    <ul className="space-y-3 text-red-700 text-sm">
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span>
                                <strong>MILFORD DEVELOPMENT AUTHORITY</strong> will NOT allow the patient ashore without a proper MEDICAL HANDOVER to a trained paramedic.
                                The ship MUST wait until paramedics have done a proper assessment/transfer.
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span>
                                <strong>NOT INFORMING US</strong> could result in NZ Govt Authorities withdrawing permission for vessels calling Fiordland as first ports of call.
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-brand-teal" /> Travel Times
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li><strong>1.5 hours</strong> by Helicopter from Dunedin/Invercargill</li>
                            <li><strong>2 hours</strong> for Ambulance to arrive from Te Anau</li>
                        </ul>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-brand-teal" /> Logistics
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>Luggage: Carry bag only. No suitcases.</li>
                            <li>Patient Passport required.</li>
                            <li>Nurses may need to return to ship after handover.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-sm">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-brand-teal" /> Deep Cove Helipad
                    </h4>
                    <p className="text-gray-600">
                        For Fiordland other than Milford Sound, there is a pontoon with Helipad at Doubtful Sound - Deep Cove.
                        <br />
                        <strong>Coordinates: 45°27'45"S 167°09'19"E</strong>
                    </p>
                </div>
            </div>

            {/* Milford Sound Berths Map */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-fiordland-900">Milford Sound Berths Layout</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200">
                        Berth 5: Medical Evacuation
                    </span>
                </div>

                <MilfordBerthMap />

                <p className="text-center text-sm text-gray-500 mt-4 italic">
                    Berth 5 is the designated transfer point for medical evacuations.
                </p>
            </div>
        </div>
    );
}

function MilfordBerthMap() {
    return (
        <div className="w-full overflow-hidden bg-blue-50/50 rounded-xl border border-blue-100 p-4">
            <svg viewBox="0 0 800 450" className="w-full h-auto" style={{ maxHeight: '500px' }}>
                {/* Shoreline */}
                <rect x="0" y="0" width="800" height="40" fill="#718096" />
                <text x="400" y="25" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold" letterSpacing="2">WHARF / SHORELINE</text>

                {/* Finger 6 (Far Left) - 13 / 17a */}
                <g transform="translate(100, 40)">
                    {/* Pontoon */}
                    <rect x="0" y="0" width="30" height="300" rx="4" fill="#4A5568" />
                    {/* Berth 13 (Left side) */}
                    <text x="-15" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">13</text>
                    {/* Berth 17a (Tip) */}
                    <text x="15" y="280" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">17a</text>
                </g>

                {/* Finger 5 - 11 / 12 */}
                <g transform="translate(200, 40)">
                    <rect x="0" y="0" width="30" height="280" rx="4" fill="#4A5568" />
                    <text x="-15" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">12</text>
                    <text x="45" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">11</text>
                </g>

                {/* Finger 4 - 9 / 10 */}
                <g transform="translate(300, 40)">
                    <rect x="0" y="0" width="30" height="280" rx="4" fill="#4A5568" />
                    <text x="-15" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">10</text>
                    <text x="45" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">9</text>
                </g>

                {/* Finger 3 - 7 / 8 */}
                <g transform="translate(400, 40)">
                    <rect x="0" y="0" width="30" height="280" rx="4" fill="#4A5568" />
                    <text x="-15" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">8</text>
                    <text x="45" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">7</text>
                </g>

                {/* Finger 2 - 5 / 6 (Medical) */}
                <g transform="translate(500, 40)">
                    {/* Pontoon */}
                    <rect x="0" y="0" width="30" height="280" rx="4" fill="#4A5568" />

                    {/* Berth 6 */}
                    <text x="-15" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">6</text>

                    {/* Berth 5 HIGHLIGHT */}
                    <g className="animate-pulse">
                        <rect x="35" y="20" width="60" height="200" fill="rgba(34, 197, 94, 0.2)" rx="4" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
                        <rect x="35" y="20" width="60" height="200" fill="transparent" stroke="#22c55e" strokeWidth="2" />
                    </g>
                    <text x="65" y="60" textAnchor="middle" fill="#22c55e" fontWeight="bold" fontSize="24">5</text>
                    <text x="65" y="120" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">MEDIVAC</text>
                </g>

                {/* Finger 1 (Far Right) - 1, 2, 3, 4 */}
                <g transform="translate(620, 40)">
                    {/* Pontoon Segment 1 */}
                    <rect x="0" y="0" width="40" height="120" rx="4" fill="#4A5568" />
                    <text x="-15" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">4</text>
                    <text x="55" y="60" textAnchor="middle" fill="#4A5568" fontWeight="bold">1</text>

                    {/* Link */}
                    <rect x="10" y="120" width="20" height="20" fill="#718096" />

                    {/* Pontoon Segment 2 */}
                    <rect x="0" y="140" width="40" height="120" rx="4" fill="#4A5568" />
                    <text x="-15" y="200" textAnchor="middle" fill="#4A5568" fontWeight="bold">3</text>
                    <text x="55" y="200" textAnchor="middle" fill="#4A5568" fontWeight="bold">2</text>
                </g>

                {/* Compass / Orientation */}
                <g transform="translate(700, 400)">
                    <circle cx="0" cy="0" r="20" fill="none" stroke="#CBD5E0" strokeWidth="2" />
                    <path d="M0,-15 L5,5 L0,0 L-5,5 Z" fill="#4A5568" />
                    <text x="0" y="-18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4A5568">N</text>
                </g>

            </svg>
        </div>
    );
}
