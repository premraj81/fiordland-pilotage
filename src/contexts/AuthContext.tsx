import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface User {
    id: string;
    email: string;
    avatar_url?: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string) => Promise<void>; // Sends OTP
    verifyOtp: (email: string, token: string) => Promise<void>; // Verifies OTP
    updatePassword: (password: string) => Promise<void>; // Sets new password
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    verifyOtp: async () => { },
    updatePassword: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for session
        if (isSupabaseConfigured && supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        avatar_url: session.user.user_metadata?.avatar_url,
                        full_name: session.user.user_metadata?.full_name
                    });
                }
                setLoading(false);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        avatar_url: session.user.user_metadata?.avatar_url,
                        full_name: session.user.user_metadata?.full_name
                    });
                } else {
                    setUser(null);
                }
                setLoading(false);
            });

            return () => subscription.unsubscribe();
        } else {
            // Local Mock Mode
            const storedUser = localStorage.getItem('mock_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }
    }, []);

    const signInWithGoogle = async () => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } else {
            // Mock Google Login
            const mockUser = {
                id: 'mock-google-user',
                email: 'pilot@fiordland.co.nz',
                full_name: 'Google Pilot'
            };
            localStorage.setItem('mock_user', JSON.stringify(mockUser));
            setUser(mockUser);
            window.location.reload();
        }
    };

    const signInWithEmail = async (email: string) => {
        if (isSupabaseConfigured && supabase) {
            // Send OTP
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
        } else {
            // Mock Mode: Simulate sending OTP
            console.log(`Mock OTP sent to ${email}`);
            // We don't log in yet. We wait for verifyOtp.
        }
    };

    const verifyOtp = async (email: string, token: string) => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
            if (error) throw error;
        } else {
            // Mock Mode: Verify OTP
            // Accept any token for demo purposes, or '123456'
            if (token === '123456' || token.length > 0) {
                const mockUser = {
                    id: `mock-${email}`,
                    email: email,
                    full_name: email.split('@')[0]
                };
                localStorage.setItem('mock_user', JSON.stringify(mockUser));
                setUser(mockUser);
            } else {
                throw new Error("Invalid code");
            }
        }
    };

    const updatePassword = async (password: string) => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
        } else {
            // Mock Mode: Do nothing
            console.log("Password updated (mock)");
        }
    };

    const signOut = async () => {
        if (isSupabaseConfigured && supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('mock_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, verifyOtp, updatePassword, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
