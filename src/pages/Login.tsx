import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Anchor, Mail, ArrowRight, Loader, Lock, Key, CheckCircle, ShieldAlert } from 'lucide-react';
import { isUserAllowed } from '../lib/allowedUsers';

type LoginStep = 'EMAIL' | 'OTP' | 'PASSWORD';

export default function Login() {
    const { signInWithEmail, verifyOtp, updatePassword, user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<LoginStep>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already logged in AND we are not in the password setting flow (which happens after login), redirect?
    // Actually, step PASSWORD happens *after* login via OTP. So we shouldn't redirect if we are in that step.
    // Ideally, we handle this state carefully.
    // If user is logged in but hasn't "completed" the flow in THIS session context, we might be confused.
    // But for simplicity: If step is EMAIL and user is loaded, redirect.
    if (user && step === 'EMAIL') {
        navigate('/');
        return null;
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Check Allowed List
            // 1. Check Allowed List
            if (!isUserAllowed(email)) {
                throw new Error("Access Denied. You are not authorized. Please contact the administrator.");
            }

            // 2. Send OTP
            await signInWithEmail(email);
            setStep('OTP');
        } catch (err: any) {
            setError(err.message || "Failed to send login code.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOtp(email, otp);
            // User is now authenticated in Supabase/Mock
            setStep('PASSWORD');
        } catch (err: any) {
            setError(err.message || "Invalid code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await updatePassword(password);
            // Done!
            navigate('/');
        } catch (err: any) {
            setError(err.message || "Failed to update password.");
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
                            {step === 'EMAIL' && "Sign in to access your Pilot Log"}
                            {step === 'OTP' && "Enter Authentication Code"}
                            {step === 'PASSWORD' && "Set New Password"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-100 animate-in slide-in-from-top-2">
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Email */}
                    {step === 'EMAIL' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 disabled:opacity-70"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Send Code <ArrowRight className="w-5 h-5" /></>}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'OTP' && (
                        <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-brand-teal/10 border border-brand-teal/20 p-4 rounded-xl mb-4">
                                <p className="text-sm text-teal-100 text-center">
                                    We sent a code to <span className="font-bold text-white">{email}</span>
                                </p>
                                <p className="text-xs text-teal-200/50 text-center mt-1">
                                    (Dev Mode: Use code <strong>888888</strong>)
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300 ml-1">Authentication Code</label>
                                <div className="relative group">
                                    <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal" />
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all tracking-widest text-lg font-mono"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-teal/20"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Verify Code <ArrowRight className="w-5 h-5" /></>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('EMAIL')}
                                className="w-full text-sm text-gray-400 hover:text-white transition-colors mt-2"
                            >
                                Change Email
                            </button>
                        </form>
                    )}

                    {/* Step 3: Set Password */}
                    {step === 'PASSWORD' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-brand-teal/10 border border-brand-teal/20 p-4 rounded-xl mb-4 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-brand-teal" />
                                <p className="text-sm text-teal-100">
                                    Identity Verified. Please set a password.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300 ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
                                        placeholder="Confirm Password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-teal/20"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Set Password & Login <ArrowRight className="w-5 h-5" /></>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
