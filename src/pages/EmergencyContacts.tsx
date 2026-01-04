import { Phone, Mail, ShieldAlert, Anchor, Ship, PlusSquare, MapPin } from 'lucide-react';

export default function EmergencyContacts() {
    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-fiordland-900">Emergency Contacts</h1>
                <p className="text-fiordland-500">Official contact list for Fiordland Pilotage, Shipping Agents, and Emergency Services.</p>
            </div>

            {/* Section 1: Pilotage & Tourism */}
            <Section title="Fiordland Pilotage Contact Numbers" icon={<Anchor className="w-6 h-6 text-brand-teal" />}>
                <div className="grid md:grid-cols-2 gap-6">
                    <ContactGroup title="Milford Sound Tourism Ltd">
                        <ContactItem label="Milford Harbour Control" value="Ch 14" isHighlight />
                        <ContactItem label="MSTL Office Admin" value="+64 3 249 9003" href="tel:+6432499003" />
                        <div className="pt-2">
                            <p className="text-sm font-semibold text-gray-700">Manager – Tony Woodham</p>
                            <div className="space-y-1 mt-1">
                                <a href="tel:+6432499229" className="block text-brand-teal hover:underline text-sm">+64 3 249 9229</a>
                                <a href="tel:+6432499002" className="block text-brand-teal hover:underline text-sm">+64 3 249 9002</a>
                                <a href="tel:+6421512699" className="block text-brand-teal hover:underline text-sm">+64 21 512 699</a>
                            </div>
                        </div>
                    </ContactGroup>
                    <ContactGroup title="Stewart Island Promotions">
                        <div className="space-y-3">
                            <ContactItem label="Aaron Joy" value="+64 27 433 0397" href="tel:+64274330397" />
                            <ContactItem label="Email" value="Aaron.joy2012@gmail.com" href="mailto:Aaron.joy2012@gmail.com" icon={<Mail className="w-3 h-3" />} />
                        </div>
                    </ContactGroup>
                </div>
            </Section>

            {/* Section 2: Shipping Agents */}
            <Section title="Shipping Agents" icon={<Ship className="w-6 h-6 text-blue-600" />}>
                <div className="grid md:grid-cols-2 gap-6">
                    <ContactGroup title="ISS-McKay">
                        <ContactItem label="Office" value="+64 9 309 4266" href="tel:+6493094266" />
                        <div className="pt-2">
                            <p className="text-sm font-semibold text-gray-700">Richard Carvalho</p>
                            <div className="space-y-1 mt-1">
                                <a href="tel:+64274959314" className="block text-brand-teal hover:underline text-sm">+64 27 495 9314</a>
                                <a href="tel:+6493740372" className="block text-brand-teal hover:underline text-sm">+64 9 374 0372</a>
                                <a href="tel:+64272046634" className="block text-brand-teal hover:underline text-sm">+64 27 204 6634</a>
                            </div>
                        </div>
                    </ContactGroup>
                    <ContactGroup title="Wilhelmsen Ships Service">
                        <ContactItem label="Primary" value="+64 9 849 4783" href="tel:+6498494783" />
                        <ContactItem label="Ship Agency Manager - Nigel Smith" value="+64 21 743 900" href="tel:+6421743900" />
                    </ContactGroup>
                </div>
            </Section>

            {/* Section 3: Incident / Accident */}
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
                        <ContactItem label="Zak Smith (DHM)" value="+64 21 355 133" href="tel:+6421355133" />
                    </ContactGroup>
                </div>
            </Section>

            {/* Section 4: Medical */}
            <Section title="Medical Emergency / Pax Transfers" icon={<PlusSquare className="w-6 h-6 text-green-600" />}>
                <div className="grid md:grid-cols-2 gap-6">
                    <ContactGroup title="Medical Evacuation / Milford Reps">
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Cruise Milford</p>
                        <ContactItem label="Lisa Goersch" value="+64 27 601 1248" href="tel:+64276011248" />
                        <ContactItem label="Peter Egerton" value="+64 27 433 2245" href="tel:+64274332245" />
                        <ContactItem label="Hamish Egerton" value="+64 21 229 6062" href="tel:+64212296062" />
                        <ContactItem label="Email" value="hamish@cruisemilfordnz.com" href="mailto:hamish@cruisemilfordnz.com" icon={<Mail className="w-3 h-3" />} />
                    </ContactGroup>
                    <ContactGroup title="Helicopter Medivac">
                        <ContactItem label="Primary" value="+64 3 489 7322" href="tel:+6434897322" />
                        <ContactItem label="Otago Rescue" value="+64 274 333 036" href="tel:+64274333036" />
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
