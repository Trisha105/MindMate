import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Calendar, Mic } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const prompts = ["What made you smile today?", "Describe a moment where you felt at peace.", "What is one thing you are grateful for right now?", "How did you handle a challenge today?", "What qualities do you value most in yourself?"];

const Editor = ({ onSave, onCancel, initialData }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState(initialData?.content || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [prompt] = useState(() => initialData ? '' : prompts[Math.floor(Math.random() * prompts.length)]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim() && !title.trim()) return;
        onSave({ title: title || new Date().toLocaleDateString(), content, date: initialData?.date || new Date().toISOString(), emotion: 'Neutral' });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onCancel} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" />Back to Journal</button>
                <Button onClick={handleSubmit} disabled={!content.trim()}><Save className="w-4 h-4 mr-2" />{t('save')}</Button>
            </div>
            <Card className="min-h-[60vh] p-8 flex flex-col relative">
                {prompt && <div className="mb-6 p-4 bg-primary-50 dark:bg-slate-800/50 rounded-lg text-primary-700 dark:text-primary-300 italic">Thinking Prompt: "{prompt}"</div>}
                <input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 mb-4 w-full text-gray-900 dark:text-white" />
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6"><Calendar className="w-4 h-4 mr-2" />{new Date().toLocaleString()}</div>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing..." className="flex-1 w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-lg leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-700" />
                <button className="absolute bottom-8 right-8 p-3 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:text-primary-600 transition-colors" title="Voice Note (Coming Soon)"><Mic className="w-5 h-5" /></button>
            </Card>
        </motion.div>
    );
};
export default Editor;
