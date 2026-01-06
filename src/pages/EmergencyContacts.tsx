import { Mail, ShieldAlert, Anchor, Ship, PlusSquare } from 'lucide-react';

export default function EmergencyContacts() {
    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-fiordland-900">Emergency Contacts</h1>
                <p className="text-fiordland-500">Official contact list for Fiordland Pilotage, Shipping Agents, and Emergency Services.</p>
            </div>

            {/* Section 1: Pilotage Providers */}
            <Section title="Fiordland Pilotage Providers" icon={<Anchor className="w-6 h-6 text-brand-teal" />}>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* South Port */}
                    <ContactGroup title="South Port (Bluff)">
                        <ContactItem label="South Port (24hrs)" value="+64 3 212 8159" href="tel:+6432128159" icon={<Ship className="w-4 h-4" />} />
                        <ContactItem label="Email" value="pilots@southport.co.nz" href="mailto:pilots@southport.co.nz" icon={<Mail className="w-4 h-4" />} />

                        <div className="mt-4 space-y-3">
                            <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-1">Pilots</h4>
                            <Person name="Bob Coote" phone="+64 27 891 6874" email="bobcomp@xtra.co.nz" />
                            <Person name="Steve Gilkison" phone="+64 27 6166130" email="sagilkison@yahoo.co.nz" note="(Contract Pilot)" />
                            <Person name="Mark Saunders" phone="+64 21 405 551" email="msaunders@southport.co.nz" />
                            <Person name="Paul James" phone="+64 21 132 8887" email="pjames@southport.co.nz" />
                            <Person name="Ray Tull" phone="+64 21 02749284" email="rtull@southport.co.nz" />
                            <Person name="Brad Goldsworthy" phone="+64 27 7809673" email="bgoldsworthy@southport.co.nz" />
                        </div>
                    </ContactGroup>

                    {/* Port Otago */}
                    <ContactGroup title="Fiordland Pilotage Services (Port Otago)">
                        <ContactItem label="Office" value="+64 3 472 9883" href="tel:+6434729883" icon={<Ship className="w-4 h-4" />} />
                        <div className="flex gap-2 text-xs overflow-hidden">
                            <a href="mailto:fiordland.services@portotago.co.nz" className="text-brand-teal hover:underline truncate">fiordland.services@portotago.co.nz</a>
                            <span className="text-gray-400">|</span>
                            <a href="mailto:pilots@portotago.co.nz" className="text-brand-teal hover:underline truncate">pilots@portotago.co.nz</a>
                        </div>

                        <div className="mt-4 space-y-3">
                            <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-1">Pilots</h4>
                            <Person name="Lawrence Clark" phone="+64 21 510 594" email="lclark@portotago.co.nz" />
                            <Person name="Josh Osborne" phone="+64 21 0323624" email="josbornesd@yahoo.com" />
                            <Person name="Sumanth Surendran" phone="+64 21 481716" email="ssurendran@portotago.co.nz" />
                            <Person name="Wayne Turner" phone="+64 21 992963" email="wayne.turner@portotago.co.nz" />
                            <Person name="Premraj Pillai" phone="+64 21 549518" email="ppillai@portotago.co.nz" />
                            <Person name="Scott Young" phone="+64 21 2405784" email="scott.young@portotago.co.nz" />
                            <Person name="Tony Lawrence" phone="+64 21 2298924" email="tlawrence@portotago.co.nz" />
                            <Person name="Julien Charpentier" phone="+64 21 705932" email="jcharpentier@portotago.co.nz" />
                        </div>
                    </ContactGroup>
                </div>
            </Section>

            {/* Section 2: General / Radio */}
            <Section title="Pilot Vessel & Radio" icon={<Ship className="w-6 h-6 text-blue-600" />}>
                <div className="grid md:grid-cols-2 gap-6">
                    <ContactGroup title="Pilot Vessel - Paerata (Port Otago)">
                        <Person name="Skipper - Fjord Ellis" phone="+64 2102207931" email="fjord@shipandshoreservices.co.nz" />
                    </ContactGroup>
                    <ContactGroup title="Radio & Traffic">
                        <ContactItem label="Milford General Traffic" value="VHF Ch 62" />
                        <ContactItem label="Milford Traffic Phone" value="+64 274 360396" href="tel:+64274360396" />
                        <hr className="my-2 border-dashed border-gray-200" />
                        <ContactItem label="Bluff Fishermen's Radio" value="+64 3 212 7281" href="tel:+6432127281" />
                        <ContactItem label="Fiordland Fishermen's" value="+64 3 249 7402" href="tel:+6432497402" />
                    </ContactGroup>
                </div>
            </Section>

            {/* Section 3: Key Contacts */}
            <Section title="Key Contacts & Agents" icon={<PlusSquare className="w-6 h-6 text-purple-600" />}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ContactGroup title="Milford Sound Tourism Ltd">
                        <ContactItem label="Harbour Control" value="Ch 14" isHighlight />
                        <ContactItem label="Office Admin" value="+64 3 249 9003" href="tel:+6432499003" />
                        <div className="pt-2">
                            <p className="text-sm font-semibold text-gray-700">Manager – Callum Webber</p>
                            <div className="space-y-1 mt-1">
                                <a href="tel:+6432499229" className="block text-brand-teal hover:underline text-sm">+64 3 249 9229</a>
                                <a href="tel:+6432499002" className="block text-brand-teal hover:underline text-sm">+64 3 249 9002</a>
                                <a href="tel:+64272384401" className="block text-brand-teal hover:underline text-sm">+64 27 2384401</a>
                            </div>
                        </div>
                    </ContactGroup>

                    <ContactGroup title="Shipping Agents">
                        <div className="space-y-4">
                            <div>
                                <h5 className="font-bold text-gray-800 text-sm mb-1">Inchcape Shipping Services</h5>
                                <ContactItem label="Office" value="+64 9 309 4266" href="tel:+6493094266" className="text-xs" />
                                <div className="ml-2 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                                    <Person name="Richard Carvalho" phone="+64 9 3740372" email="" compact />
                                    <Person name="Katja Mewes" phone="+64 21 02530782" email="" compact />
                                    <Person name="Andrew Smith" phone="+64 27 8804453" email="" compact />
                                </div>
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-800 text-sm mb-1">Wilhelmsen Ships Service</h5>
                                <ContactItem label="Office" value="+64 9 849 4783" href="tel:+6498494783" className="text-xs" />
                                <Person name="Nigel Smith (Manager)" phone="+64 21 743 900" email="" compact />
                            </div>
                        </div>
                    </ContactGroup>
                    <ContactGroup title="Stewart Island Promotions">
                        <Person name="Aaron Joy" phone="+64 27 4330397" email="Aaron.joy2012@gmail.com" />
                    </ContactGroup>
                </div>
            </Section>


            {/* Section 4: Incident / Accident */}
            <Section title="Shipping Incident or Accident (Incl Oil Spill)" icon={<ShieldAlert className="w-6 h-6 text-red-600" />}>
                <div className="grid md:grid-cols-3 gap-6">
                    <ContactGroup title="Police" className="bg-red-50 border-red-100">
                        <ContactItem label="Emergency" value="111" href="tel:111" isHighlight className="text-red-600 text-xl" />
                        <ContactItem label="Invercargill Police" value="+64 3 211 0400" href="tel:+6432110400" />
                        <ContactItem label="Te Anau Police" value="+64 3 249 7600" href="tel:+6432497600" />
                        <ContactItem label="Stewart Island Police" value="+64 3 219 0020" href="tel:+6432190020" />
                    </ContactGroup>
                    <ContactGroup title="Maritime New Zealand">
                        <div className="mb-2">
                            <p className="text-sm font-bold text-gray-800">Rescue Co-ordination Centre NZ</p>
                            <div className="space-y-1 mt-1">
                                <a href="tel:+64508472269" className="block text-brand-teal hover:underline text-sm font-medium">Emergency: +64 508 472 269</a>
                                <a href="tel:+6445778030" className="block text-brand-teal hover:underline text-sm">+64 4 577 8030</a>
                            </div>
                        </div>
                        <ContactItem label="Accident Reporting" value="+64 508 222 433" href="tel:+64508222433" />
                    </ContactGroup>
                    <ContactGroup title="Harbourmaster (Env. Southland)">
                        <ContactItem label="Office" value="+64 3 211 5115" href="tel:+6432115115" />
                        <ContactItem label="Free Phone (Southland)" value="0800 768 845" href="tel:0800768845" />
                        <ContactItem label="Lyndon Cleaver (HM)" value="+64 21 673 043" href="tel:+6421673043" />
                        <ContactItem label="Conrad Adams (DHM)" value="+64 27 3747402" href="tel:+64273747402" />
                    </ContactGroup>
                </div>
            </Section>

            {/* Section 5: Medical */}
            <Section title="Medical Emergency / Pax Transfers" icon={<PlusSquare className="w-6 h-6 text-green-600" />}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ContactGroup title="Helicopter Medivac">
                        <ContactItem label="Primary" value="+64 3 489 7322" href="tel:+6434897322" />
                        <hr className="my-2 border-dashed border-gray-200" />
                        <div className="mt-2">
                            <h5 className="font-bold text-gray-800 text-sm">Southern Lakes Helicopters</h5>
                            <Person name="Michael Hayes (CEO)" phone="+64 3 2497167" email="michael@slheli.co.nz" />
                            <a href="tel:+64273748140" className="block text-brand-teal hover:underline text-xs ml-1">+64 27 3748140</a>
                        </div>
                    </ContactGroup>
                    <ContactGroup title="Medical Services">
                        <ContactItem label="Otago Rescue" value="+64 274 333 036" href="tel:+64274333036" />
                        <hr className="my-2 border-dashed border-gray-200" />
                        <div>
                            <h5 className="font-bold text-gray-800 text-sm mb-1">St John</h5>
                            <Person name="Katrina Andrew" phone="+64 27 2915462" email="katrina.andrew@stjohn.org.nz" />
                        </div>
                    </ContactGroup>
                    <ContactGroup title="Stewart Is Health Centre">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Nurses</p>
                            <p className="text-sm text-gray-600">Martin Pepers / Deborah Dillon</p>
                            <ContactItem label="Phone" value="+64 219 1098" href="tel:+642191098" />
                        </div>
                    </ContactGroup>
                </div>
            </Section>

            <div className="text-center text-xs text-gray-400 pt-8">
                Data provided by Fiordland Pilot Services
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <div className="p-6">
                {children}
            </div>
        </section>
    );
}

function ContactGroup({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) {
    return (
        <div className={`p-5 rounded-xl border border-gray-100 ${className ? className : 'bg-white'}`}>
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

function ContactItem({ label, value, href, icon, isHighlight = false, className = "" }: { label: string, value: string, href?: string, icon?: React.ReactNode, isHighlight?: boolean, className?: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                {icon} {label}
            </span>
            {href ? (
                <a
                    href={href}
                    className={`font-semibold hover:underline ${isHighlight ? 'text-brand-teal text-lg' : 'text-brand-teal/90'} ${className}`}
                >
                    {value}
                </a>
            ) : (
                <span className={`font-semibold text-gray-900 ${isHighlight ? 'text-lg' : ''} ${className}`}>
                    {value}
                </span>
            )}
        </div>
    );
}

function Person({ name, phone, email, note, compact = false }: { name: string, phone: string, email: string, note?: string, compact?: boolean }) {
    return (
        <div className={compact ? "text-sm py-1" : "py-2 border-b border-gray-50 last:border-0"}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <span className="font-medium text-gray-800">
                    {name} <span className="text-gray-400 text-xs font-normal">{note}</span>
                </span>
                <span className="text-gray-600 font-mono text-sm">{phone}</span>
            </div>
            {email && (
                <a href={`mailto:${email}`} className="text-xs text-brand-teal hover:underline block mt-0.5">
                    {email}
                </a>
            )}
        </div>
    );
}
