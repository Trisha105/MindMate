import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { BookOpen, Smile, MessageCircle, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const quotes = [
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
    { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
    { text: "Breathe. It’s just a bad day, not a bad life.", author: "Unknown" },
];

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
    const [streak, setStreak] = useState(0);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                setStreak(res.data.data.streak);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        if (currentUser) fetchStats();
    }, [currentUser]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const menuItems = [
        { title: 'Daily Journal', description: 'Capture your thoughts.', icon: BookOpen, to: '/journal', gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/30' },
        { title: 'Mood Tracker', description: 'Log your feelings.', icon: Smile, to: '/mood', gradient: 'from-purple-500 to-pink-400', shadow: 'shadow-purple-500/30' },
        { title: 'AI Companion', description: 'Chat with a friend.', icon: MessageCircle, to: '/chat', gradient: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/30' },
        { title: 'Support & Calm', description: 'Find your peace.', icon: Heart, to: '/support', gradient: 'from-orange-500 to-amber-400', shadow: 'shadow-orange-500/30' }
    ];

    const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="space-y-10 pb-10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-indigo-100 mb-2 font-medium"><Sparkles className="w-5 h-5" /><span>Make today count</span></div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{getGreeting()}, <span className="text-white/90">{currentUser?.email?.split('@')[0]}</span></h1>
                        <p className="text-lg md:text-xl text-indigo-100 max-w-xl">"{quote.text}" — <span className="opacity-75">{quote.author}</span></p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center space-x-4 border border-white/20">
                        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-xl shadow-lg"><TrendingUp className="w-6 h-6 text-white" /></div>
                        <div><div className="text-sm text-indigo-100">Mindful Streak</div><div className="text-2xl font-bold">{streak} Days</div></div>
                    </div>
                </div>
            </motion.div>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-primary-500" />Your Toolkit</h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                </div>
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((menu) => (
                        <motion.div key={menu.to} variants={item} whileHover={{ y: -8, scale: 1.02 }} className="h-full">
                            <Link to={menu.to} className="block group h-full">
                                <div className={`h-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl ${menu.shadow} relative overflow-hidden`}>
                                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${menu.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${menu.gradient} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}><menu.icon className="w-7 h-7" /></div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:translate-x-1 transition-transform">{menu.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">{menu.description}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
