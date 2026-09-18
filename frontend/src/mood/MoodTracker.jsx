import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, Sun, CloudRain, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import MoodChart from './MoodChart';
import Card from '../components/Card';
import Button from '../components/Button';

const moods = [
    { value: 5, label: 'Amazing', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 4, label: 'Good', icon: Smile, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { value: 3, label: 'Okay', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 2, label: 'Bad', icon: CloudRain, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
    { value: 1, label: 'Very Sad', icon: Frown, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
];

const MoodTracker = () => {
    const { t } = useTranslation();
    const { currentUser, isDemo } = useAuth();
    const [moodHistory, setMoodHistory] = useState([]);
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { if (currentUser) fetchMoods(); }, [currentUser]);

    const fetchMoods = async () => {
        try { setIsLoading(true); const res = await api.get('/moods'); setMoodHistory(res.data.data.moods || []); }
        catch (err) { console.error('Failed to fetch moods:', err); setError('Failed to load mood history'); }
        finally { setIsLoading(false); }
    };

    const handleMoodSelect = (mood) => { setSelectedMood(mood); setError(null); };
    const handleSave = async () => {
        if (!selectedMood) return;
        try {
            setIsSaving(true); setError(null);
            if (isDemo) {
                const newEntry = { _id: Date.now(), date: new Date().toISOString(), score: selectedMood.value, mood: selectedMood.label, note };
                setMoodHistory([newEntry, ...moodHistory]);
            } else {
                const res = await api.post('/moods', { score: selectedMood.value, mood: selectedMood.label, note, date: new Date().toISOString() });
                setMoodHistory([res.data.data.mood, ...moodHistory]);
            }
            setSelectedMood(null); setNote('');
        } catch (err) { console.error('Failed to save mood:', err); setError(err.response?.data?.message || 'Failed to save mood'); }
        finally { setIsSaving(false); }
    };

    const todayEntry = moodHistory.find((entry) => new Date(entry.date).toDateString() === new Date().toDateString());
    if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('mood_tracker')}</h1><p className="text-gray-600 dark:text-gray-400">Track your emotional well-being</p></div>
            {isDemo && <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3"><AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} /><div><p className="text-amber-800 dark:text-amber-300 font-medium">Demo Mode</p><p className="text-amber-700 dark:text-amber-400 text-sm">Moods are saved locally. Sign in to sync with the server.</p></div></div>}
            {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3"><AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} /><div><p className="text-red-800 dark:text-red-300 font-medium">Error</p><p className="text-red-700 dark:text-red-400 text-sm">{error}</p></div></div>}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{todayEntry ? 'Today\'s Mood' : 'How are you feeling?'}</h2>
                        {todayEntry ? (
                            <div className="text-center py-6">
                                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-primary-50 dark:bg-slate-800 mb-4">{(() => { const mood = moods.find(m => m.value === todayEntry.score) || moods[2]; return <mood.icon className={`w-10 h-10 ${mood.color}`} />; })()}</div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{todayEntry.mood}</h3><p className="text-gray-500">{todayEntry.note}</p>
                                <Button variant="outline" className="mt-4 w-full" onClick={() => { setSelectedMood(moods.find(m => m.value === todayEntry.score)); setNote(todayEntry.note || ''); }}>Update Mood</Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-5 gap-2 mb-6">{moods.map((mood) => (<button key={mood.value} onClick={() => handleMoodSelect(mood)} className={`flex flex-col items-center p-2 rounded-lg transition-all ${selectedMood?.value === mood.value ? `${mood.bg} ring-2 ring-primary-500 scale-110` : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}><mood.icon className={`w-8 h-8 ${mood.color} mb-1`} /><span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:block">{mood.label}</span></button>))}</div>
                                <AnimatePresence>{selectedMood && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4"><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)..." className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none text-sm" rows="3" /><Button onClick={handleSave} className="w-full" isLoading={isSaving} disabled={isSaving}>Update Mood</Button></motion.div>}</AnimatePresence>
                            </>
                        )}
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white"><h3 className="font-semibold mb-2">Did you know?</h3><p className="text-sm opacity-90">Tracking your mood helps identify triggers and patterns in your emotional health.</p></Card>
                </div>
                <div className="lg:col-span-2"><MoodChart data={moodHistory} /></div>
            </div>
        </div>
    );
};
export default MoodTracker;
