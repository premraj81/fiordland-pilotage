import React, { createContext, useContext, useEffect, useState } from 'react';
import { migrateUserRecords } from '../lib/db';

interface User {
    id: string;
    email: string;
    avatar_url?: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for session in localStorage
        const stored = localStorage.getItem('fiordland_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                localStorage.removeItem('fiordland_user');
            }
        }
        setLoading(false);
    }, []);

    const signIn = async (email: string, password: string) => {
        // preserve old user ID to check for migration
        const stored = localStorage.getItem('fiordland_user');
        let oldUser: User | null = null;
        if (stored) {
            try {
                oldUser = JSON.parse(stored);
            } catch (e) { }
        }

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Login Failed");
        }

        const data = await response.json();
        const newUser = data.user;

        // Check migration
        if (oldUser && oldUser.email === newUser.email && oldUser.id !== newUser.id) {
            console.log("User ID mismatch detected (Server reset?), migrating local records...");
            await migrateUserRecords(oldUser.id, newUser.id);
        }

        setUser(newUser);
        localStorage.setItem('fiordland_user', JSON.stringify(newUser));
    };

    const signOut = async () => {
        localStorage.removeItem('fiordland_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
