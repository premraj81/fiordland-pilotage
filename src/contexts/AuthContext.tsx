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
    signInWithEmail: (email: string) => Promise<void>; // Magic Link or Mock
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
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
            alert("Supabase not configured. Cannot use Google Login. Using Mock Login instead.");
            // Mock Login for demo
            const mockUser = {
                id: 'mock-user-1',
                email: 'pilot@fiordland.co.nz',
                full_name: 'Mock Pilot'
            };
            localStorage.setItem('mock_user', JSON.stringify(mockUser));
            setUser(mockUser);
            window.location.reload();
        }
    };

    const signInWithEmail = async (email: string) => {
        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            alert('Check your email for the login link!');
        } else {
            // Mock Login
            const mockUser = {
                id: `mock-${email}`,
                email: email,
                full_name: email.split('@')[0]
            };
            localStorage.setItem('mock_user', JSON.stringify(mockUser));
            setUser(mockUser);
            // Force refresh to update DB context if needed, or just state
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
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
