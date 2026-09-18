import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import api from '../utils/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try { const token = await user.getIdToken(); api.defaults.headers.Authorization = `Bearer ${token}`; } catch {}
            } else delete api.defaults.headers.Authorization;
            setLoading(false);
        });
        if (auth.onIdTokenChanged) {
            auth.onIdTokenChanged(async (user) => {
                if (user) {
                    try { const token = await user.getIdToken(); api.defaults.headers.Authorization = `Bearer ${token}`; } catch {}
                } else delete api.defaults.headers.Authorization;
            });
        }
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            setAuthError(null);
            const result = await signInWithEmailAndPassword(auth, email, password);
            try { await result.user.getIdToken(true); } catch (e) { console.warn('Could not refresh ID token immediately after login', e); }
            setCurrentUser(result.user);
            return result.user;
        } catch (error) { setAuthError(error.message || "Login failed"); throw error; }
    };

    const register = async (email, password) => {
        try {
            setAuthError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            try { await result.user.getIdToken(true); } catch (e) { console.warn('Could not refresh ID token immediately after register', e); }
            setCurrentUser(result.user);
            return result.user;
        } catch (error) { setAuthError(error.message || "Registration failed"); throw error; }
    };

    const logout = async () => { try { setAuthError(null); await signOut(auth); } catch (error) { console.error("Logout error", error); throw error; } };

    const value = { currentUser, login, register, logout, loading, authError };
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
