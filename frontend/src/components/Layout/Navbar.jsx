import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Home, BookOpen, Smile, MessageCircle, Settings, LogOut, HeartHandshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Navbar = () => {
    const { t } = useTranslation();
    const { currentUser, logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navItems = [
        { to: '/', icon: Home, label: t('welcome') },
        { to: '/journal', icon: BookOpen, label: t('journal') },
        { to: '/mood', icon: Smile, label: t('mood_tracker') },
        { to: '/chat', icon: MessageCircle, label: t('chatbot') },
        { to: '/support', icon: HeartHandshake, label: "Support" },
        { to: '/settings', icon: Settings, label: t('settings') },
    ];

    if (!currentUser) return null;

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">MindMate</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                                <item.icon className="w-4 h-4 mr-2" />{item.label}
                            </NavLink>
                        ))}
                        <button onClick={handleLogout} className="ml-4 p-2 text-gray-500 hover:text-red-500 transition-colors" title={t('logout')}><LogOut className="w-5 h-5" /></button>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none">{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                                <item.icon className="w-5 h-5 mr-3" />{item.label}
                            </NavLink>
                        ))}
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-800"><LogOut className="w-5 h-5 mr-3" />{t('logout')}</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
