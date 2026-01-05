import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Ship, FileText, Info, Menu, X, Wifi, WifiOff, BellRing, Compass, Phone, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useOnlineStatus } from '../lib/hooks';

export default function Layout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const isOnline = useOnlineStatus();

    return (
        <div className="flex h-screen bg-fiordland-50 overflow-hidden">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static z-50 w-64 h-full bg-fiordland-900 text-white transition-transform duration-300 ease-in-out shadow-xl overflow-y-auto",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6 border-b border-fiordland-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Ship className="w-8 h-8 text-brand-teal" />
                        <h1 className="text-xl font-bold tracking-tight">Fiordland/Steward Is.<br /><span className="text-brand-gold">Pilotage</span></h1>
                    </div>
                    <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
                </div>

                <nav className="p-4 space-y-2">
                    <NavItem to="/" icon={<FileText />} label="MPX" onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/info" icon={<Info />} label="VHF Channels" onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/vhf-notification" icon={<BellRing />} label="VHF Notification" onClick={() => setSidebarOpen(false)} />

                    <NavGroup
                        label="Passage Plan"
                        icon={<FileText />}
                        basePath="/passage-plan"
                        items={[
                            { to: "/passage-plan", label: "PDF Plan" },
                            { to: "/passage-plan/milford", label: "Milford Sound" },
                            { to: "/passage-plan/thompson-doubtful", label: "Thompson / Doubtful" },
                            { to: "/passage-plan/breaksea-dusky", label: "Breaksea / Dusky" }
                        ]}
                    />

                    <NavItem to="/medical-evacuation" icon={<Ship />} label="Medical Evacuation Procedure" onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/distance-calculator" icon={<Compass />} label="Distance Calculator" onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/emergency-contacts" icon={<Phone />} label="Emergency Contacts" onClick={() => setSidebarOpen(false)} />
                </nav>

                <div className="p-4 border-t border-fiordland-700 mt-auto">
                    <p className="text-xs text-fiordland-500 text-center">Version 1.0.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-fiordland-700 lg:hidden">
                            <Menu />
                        </button>
                        <span className="font-semibold text-fiordland-800 lg:hidden">Fiordland Pilotage</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        {isOnline ? (
                            <>
                                <Wifi className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-fiordland-700 hidden sm:inline">Online</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-medium text-red-600 hidden sm:inline">Offline Mode</span>
                            </>
                        )}
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) {
    return (
        <NavLink
            to={to}
            end
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                    ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                    : "text-fiordland-300 hover:bg-fiordland-800 hover:text-white"
            )}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </NavLink>
    )
}

function NavGroup({ label, icon, basePath, items }: { label: string, icon: React.ReactNode, basePath: string, items: { to: string, label: string }[] }) {
    const location = useLocation();
    const isActive = location.pathname.startsWith(basePath);
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => {
        if (isActive) setIsOpen(true);
    }, [isActive]);

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive ? "text-white" : "text-fiordland-300 hover:bg-fiordland-800 hover:text-white"
                )}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="pl-11 pr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) => cn(
                                "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand-teal text-white shadow-sm"
                                    : "text-fiordland-400 hover:bg-fiordland-800 hover:text-white"
                            )}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}
