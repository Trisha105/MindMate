import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Clock, Lightbulb, Play, Pause, RotateCcw } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const BreathingExercise = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('Inhale');

    const toggleExercise = () => {
        if (isActive) { setIsActive(false); setPhase('Ready'); }
        else setIsActive(true);
    };

    useEffect(() => {
        if (!isActive) return;
        const cycle = [
            { name: 'Inhale', duration: 4000 },
            { name: 'Hold', duration: 2000 },
            { name: 'Exhale', duration: 4000 }
        ];
        let currentIndex = 0;
        let timeoutId;
        const runPhase = () => {
            const current = cycle[currentIndex];
            setPhase(current.name);
            timeoutId = setTimeout(() => { currentIndex = (currentIndex + 1) % cycle.length; runPhase(); }, current.duration);
        };
        runPhase();
        return () => clearTimeout(timeoutId);
    }, [isActive]);

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <div className="relative flex items-center justify-center w-64 h-64">
                <motion.div animate={{ scale: isActive ? (phase === 'Inhale' ? 1.5 : phase === 'Hold' ? 1.5 : 1) : 1, opacity: isActive ? 0.8 : 0.3 }} transition={{ duration: phase === 'Inhale' || phase === 'Exhale' ? 4 : 0 }} className="absolute inset-0 bg-primary-200 dark:bg-primary-900 rounded-full blur-xl" />
                <motion.div animate={{ scale: isActive ? (phase === 'Inhale' ? 1.2 : phase === 'Hold' ? 1.2 : 1) : 1 }} transition={{ duration: phase === 'Inhale' || phase === 'Exhale' ? 4 : 0 }} className="w-40 h-40 bg-primary-500 rounded-full flex items-center justify-center shadow-lg relative z-10">
                    <span className="text-white text-xl font-bold">{phase}</span>
                </motion.div>
            </div>
            <Button onClick={toggleExercise}>{isActive ? 'Stop' : 'Start Breathing'}</Button>
            <p className="text-gray-500 text-sm">Inhale for 4s, Hold for 2s, Exhale for 4s</p>
        </div>
    );
};

const MeditationTimer = () => {
    const [timeLeft, setTimeLeft] = useState(300);
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        let interval;
        if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        else if (timeLeft === 0) setIsActive(false);
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    return (
        <div className="text-center p-8">
            <div className="text-6xl font-mono font-bold text-gray-800 dark:text-white mb-8">{formatTime(timeLeft)}</div>
            <div className="flex justify-center gap-4">
                <Button onClick={() => setIsActive(!isActive)}>{isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}{isActive ? 'Pause' : 'Start'}</Button>
                <Button variant="outline" onClick={() => { setIsActive(false); setTimeLeft(300); }}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            </div>
        </div>
    );
};

const TipsList = () => {
    const tips = [
        { title: "Sleep Schedule", content: "Try to go to bed and wake up at the same time every day.", icon: Clock },
        { title: "Mindfulness", content: "Spend 5 minutes focusing solely on your breathing when stressed.", icon: Wind },
        { title: "Gratitude", content: "Write down three things you are grateful for each morning.", icon: Lightbulb },
    ];
    return <div className="space-y-4">{tips.map((tip, idx) => (<Card key={idx} className="p-4 flex items-start space-x-4"><div className="p-3 bg-primary-50 dark:bg-slate-800 rounded-lg"><tip.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" /></div><div><h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3><p className="text-sm text-gray-600 dark:text-gray-400">{tip.content}</p></div></Card>))}</div>;
};

const Support = () => {
    const [activeTab, setActiveTab] = useState('breathing');
    const tabs = [
        { id: 'breathing', label: 'Breathing', icon: Wind },
        { id: 'meditation', label: 'Meditation', icon: Clock },
        { id: 'tips', label: 'Self Care', icon: Lightbulb },
    ];
    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support & Guidance</h1><p className="text-gray-600 dark:text-gray-400">Tools to help you find calm</p></div>
            <div className="flex space-x-2 border-b border-gray-200 dark:border-slate-800">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}><tab.icon className="w-4 h-4 mr-2" />{tab.label}</button>))}</div>
            <div className="min-h-[400px]"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><Card className="p-6 bg-white dark:bg-slate-900">{activeTab === 'breathing' && <BreathingExercise />}{activeTab === 'meditation' && <MeditationTimer />}{activeTab === 'tips' && <TipsList />}</Card></motion.div></AnimatePresence></div>
        </div>
    );
};

export default Support;
