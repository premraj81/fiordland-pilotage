import React, { createContext, useContext, useEffect, useState } from 'react';

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
    signInWithEmail: (email: string) => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>; // This will act as our "Login" or "Register" final step
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
    const [tempEmail, setTempEmail] = useState('');

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

    const signInWithGoogle = async () => {
        alert("Google Login not supported in Offline Server mode yet.");
    };

    const signInWithEmail = async (email: string) => {
        // Just store the email for the next steps
        setTempEmail(email);
        // We could call an API to check if user exists, but we'll assume yes/new for simplicity
        return;
    };

    const verifyOtp = async (email: string, token: string) => {
        // Mock OTP verification
        if (token === '888888' || token === '123456') {
            // verified
            return;
        }
        throw new Error("Invalid Auth Code");
    };

    const updatePassword = async (password: string) => {
        // This is where we actually authenticate/create the user with the backend
        if (!tempEmail) throw new Error("No email found");

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: tempEmail, password })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Login Failed");
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('fiordland_user', JSON.stringify(data.user));
        } catch (e: any) {
            console.error(e);
            throw new Error(e.message || "Connection Error");
        }
    };

    const signOut = async () => {
        localStorage.removeItem('fiordland_user');
        setUser(null);
        setTempEmail('');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, verifyOtp, updatePassword, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
