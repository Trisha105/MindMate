import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe, Shield, Bell } from 'lucide-react';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

const Toggle = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const Settings = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const changeLanguage = (lang) => i18n.changeLanguage(lang);
    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1><p className="text-gray-600 dark:text-gray-400">Customize your experience</p></div>
            <Card className="p-6 divide-y divide-gray-200 dark:divide-gray-800">
                <div className="flex items-center justify-between py-4 first:pt-0"><div className="flex items-center space-x-3"><div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">{theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</div><div><h3 className="font-medium text-gray-900 dark:text-white">{t('dark_mode')}</h3><p className="text-sm text-gray-500 dark:text-gray-400">Reduce eye strain</p></div></div><Toggle enabled={theme === 'dark'} onChange={toggleTheme} /></div>
                <div className="flex items-center justify-between py-4"><div className="flex items-center space-x-3"><div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Globe className="w-5 h-5" /></div><div><h3 className="font-medium text-gray-900 dark:text-white">{t('language')}</h3><p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p></div></div><div className="flex space-x-2"><button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>English</button><button onClick={() => changeLanguage('bn')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${i18n.language === 'bn' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>বাংলা</button></div></div>
                <div className="flex items-center justify-between py-4 disabled opacity-50 cursor-not-allowed"><div className="flex items-center space-x-3"><div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg"><Bell className="w-5 h-5" /></div><div><h3 className="font-medium text-gray-900 dark:text-white">Daily Reminders (Premium)</h3><p className="text-sm text-gray-500 dark:text-gray-400">Get notified to journal</p></div></div><Toggle enabled={false} onChange={() => { }} /></div>
                <div className="flex items-center justify-between py-4 last:pb-0"><div className="flex items-center space-x-3"><div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><Shield className="w-5 h-5" /></div><div><h3 className="font-medium text-gray-900 dark:text-white">{t('privacy_policy')}</h3><p className="text-sm text-gray-500 dark:text-gray-400">Your data stays on your device</p></div></div><a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-medium">Read</a></div>
            </Card>
            <div className="text-center pt-8 text-sm text-gray-400"><p>MindMate v1.0.0</p><p>Designed with ❤️ for mental awareness</p></div>
        </div>
    );
};
export default Settings;
