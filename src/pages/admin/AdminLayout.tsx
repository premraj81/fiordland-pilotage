import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Ship, ClipboardList, FileText, Settings, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Ship, label: 'Ships', path: '/admin/ships' },
        { icon: ClipboardList, label: 'Checklists', path: '/admin/checklists' },
        { icon: FileText, label: 'Documents', path: '/admin/documents' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-fiordland-900 text-white flex flex-col fixed h-full z-10 left-0 top-0 overflow-y-auto">
                <div className="p-6 border-b border-fiordland-800">
                    <h1 className="text-xl font-bold text-white tracking-wide">
                        PILOT <span className="text-brand-teal">ADMIN</span>
                    </h1>
                    <p className="text-fiordland-400 text-xs mt-1">Content Management</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-brand-teal text-fiordland-950 font-semibold shadow-lg'
                                    : 'text-gray-300 hover:bg-fiordland-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-fiordland-800 space-y-2">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-fiordland-800 hover:text-white rounded-lg w-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to App
                    </button>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
