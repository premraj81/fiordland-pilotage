import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Ship, FileText, Info, Menu, X, Wifi, WifiOff, BellRing, Compass, Phone, ChevronDown, CloudRain, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { useOnlineStatus } from '../lib/hooks';

export default function Layout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const isOnline = useOnlineStatus();


    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const result = await installPrompt.userChoice;
            if (result.outcome === 'accepted') {
                setInstallPrompt(null);
            }
        } else if (isIOS) {
            alert("To install this app on your iPad/iPhone:\n\n1. Tap the Share button (square with arrow) in your browser toolbar.\n2. Scroll down and select 'Add to Home Screen'.");
        }
    };

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
                        <Ship className="w-10 h-10 text-brand-teal" />
                        <h1 className="text-4xl font-bold tracking-tighter flex gap-0">
                            <span className="text-emerald-400">F</span>
                            <span className="text-white">P</span>
                            <span className="text-emerald-400">S</span>
                        </h1>
                        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-brand-teal ml-1 opacity-80" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 12C4.5 9 7.5 9 10 12C12.5 15 15.5 15 18 12C20.5 9 23.5 9 26 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M6 6C8.5 3 11.5 3 14 6C16.5 9 19.5 9 22 6C24.5 3 27.5 3 30 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            <path d="M2 18C4.5 15 7.5 15 10 18C12.5 21 15.5 21 18 18C20.5 15 23.5 15 26 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                        </svg>
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
                    <NavItem to="/weather" icon={<CloudRain />} label="Weather" onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/documents" icon={<FileText />} label="Important Documents" onClick={() => setSidebarOpen(false)} />
                </nav>

                <div className="p-4 border-t border-fiordland-700 mt-auto">
                    <p className="text-xs text-fiordland-500 text-center">Version 1.0.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-fiordland-900 border-b border-fiordland-800 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0 relative">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-white lg:hidden">
                            <Menu />
                        </button>
                    </div>

                    {/* Centered Title */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full md:w-auto px-12 md:px-0">
                        <h1 className="text-xl md:text-2xl font-bold text-emerald-400 truncate">
                            Fiordland / Stewart Island Pilotage
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        {(installPrompt || (isIOS && !isStandalone)) && (
                            <button
                                onClick={handleInstallClick}
                                className="flex items-center gap-2 bg-brand-teal text-white px-3 py-1.5 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm text-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Install</span>
                            </button>
                        )}

                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            {isOnline ? (
                                <>
                                    <Wifi className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-medium text-fiordland-700 hidden sm:inline">Online</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-5 h-5 text-red-500" />
                                    <span className="text-sm font-medium text-red-600 hidden sm:inline">Offline</span>
                                </>
                            )}
                        </div>
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
