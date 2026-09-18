import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {currentUser && <Navbar />}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
