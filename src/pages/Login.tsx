import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Anchor, Mail, ArrowRight, Loader, Lock, ShieldAlert } from 'lucide-react';
import { isUserAllowed } from '../lib/allowedUsers';

export default function Login() {
    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (user) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Check Allowed List
            if (!isUserAllowed(email)) {
                throw new Error("Access Denied. You are not authorized. Please contact the administrator.");
            }

            // 2. Sign in with email and password
            await signIn(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-fiordland-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548576643-28f0bf608032?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-fiordland-950 to-transparent"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-300">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-brand-teal rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-teal/20 transition-transform hover:rotate-3">
                            <Anchor className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white text-center">Fiordland Pilotage</h1>
                        <p className="text-gray-300 text-center mt-2">
                            Sign in to access your Pilot Log
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-100 animate-in slide-in-from-top-2">
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
                                    placeholder="pilot@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <p className="text-xs text-gray-400 ml-1 mt-1">
                                New user? A password will be set on first login.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 disabled:opacity-70"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
