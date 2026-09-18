import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: { translation: { "welcome": "Welcome back", "how_are_you": "How are you feeling today?", "journal": "Journal", "chatbot": "AI Chat", "mood_tracker": "Mood Tracker", "settings": "Settings", "logout": "Logout", "login": "Login", "register": "Register", "email": "Email", "password": "Password", "save": "Save", "cancel": "Cancel", "dark_mode": "Dark Mode", "language": "Language", "english": "English", "bangla": "Bangla", "mindmate_desc": "Your mental health companion", "privacy_policy": "Privacy Policy" } },
    bn: { translation: { "welcome": "স্বাগতম", "how_are_you": "আজ আপনি কেমন অনুভব করছেন?", "journal": "জার্নাল", "chatbot": "এআই চ্যাট", "mood_tracker": "মুড ট্র্যাকার", "settings": "সেটিংস", "logout": "লগআউট", "login": "লগইন", "register": "নিবন্ধন", "email": "ইমেইল", "password": "পাসওয়ার্ড", "save": "সংরক্ষণ", "cancel": "বাতিল", "dark_mode": "ডার্ক মোড", "language": "ভাষা", "english": "ইংরেজি", "bangla": "বাংলা", "mindmate_desc": "আপনার মানসিক স্বাস্থ্যের সঙ্গী", "privacy_policy": "গোপনীয়তা নীতি" } }
};

i18n.use(initReactI18next).init({ resources, lng: "en", interpolation: { escapeValue: false } });
export default i18n;
