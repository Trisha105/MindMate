import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Plus, MessageSquare, Menu, LogOut, Settings } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const INITIAL_MESSAGE = {
    id: 'intro',
    text: "Hi there. I'm MindMate, your safe space to talk. I'm here to listen without judgment. How are you feeling today?",
    sender: 'ai',
    timestamp: new Date().toISOString()
};

const SUGGESTIONS = [
    { id: 'anxiety', label: 'I\'m feeling anxious', prompt: 'I am feeling anxious right now. Can you help me calm down?' },
    { id: 'sleep', label: 'Trouble sleeping', prompt: 'I am having trouble sleeping. Do you have any tips?' },
    { id: 'sad', label: 'Feeling down', prompt: 'I am feeling a bit down today. I need some motivation.' },
    { id: 'stress', label: 'Stressed out', prompt: 'I am feeling very stressed with work/study. How can I manage it?' },
    { id: 'lonely', label: 'Feeling lonely', prompt: 'I am feeling lonely. Can we just talk?' },
];

const Chatbot = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            fetchConversations();
        }
    }, [currentUser, isDemoMode]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            if (res.data.data.conversations) {
                setConversations(res.data.data.conversations);
            }
        } catch (err) {
            console.error('Failed to load conversations:', err);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    const loadConversation = async (conversationId) => {
        if (currentConversationId === conversationId) {
            setShowSidebar(false);
            return;
        }

        try {
            setIsLoadingHistory(true);
            setCurrentConversationId(conversationId);
            setError(null);

            const res = await api.get(`/chat/messages/${conversationId}`);
            if (res.data.data.messages) {
                const formattedMessages = res.data.data.messages.map(msg => ({
                    id: msg._id,
                    text: msg.message,
                    sender: msg.sender,
                    timestamp: msg.createdAt
                }));
                setMessages(formattedMessages);
            }
            setShowSidebar(false);
        } catch (err) {
            console.error('Failed to load messages:', err);
            setError('Failed to load conversation history');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [inputText]);

    const handleSendMessage = async (textOverride) => {
        const textToSend = textOverride || inputText;
        if (!textToSend.trim() || isTyping) return;

        const userMessage = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);
        setError(null);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            let aiResponseData;

            if (isDemoMode) {
                await new Promise(r => setTimeout(r, 1500));
                const mockResponses = [
                    "I hear you, and it's completely valid to feel that way.",
                    "That sounds tough. I'm here for you.",
                    "Can you tell me more about what's going on?",
                    "Remember to take deep breaths. You're doing great.",
                    "I'm listening. Please continue if it helps to talk about it."
                ];
                const randomRes = mockResponses[Math.floor(Math.random() * mockResponses.length)];
                aiResponseData = {
                    _id: Date.now() + 1,
                    message: randomRes,
                    createdAt: new Date().toISOString()
                };
            } else {
                const endpoint = '/chat/message';
                const payload = {
                    message: textToSend,
                    conversationId: currentConversationId
                };

                const res = await api.post(endpoint, payload);
                aiResponseData = res.data.data.aiMessage;

                if (res.data.data.conversationId && res.data.data.conversationId !== currentConversationId) {
                    setCurrentConversationId(res.data.data.conversationId);
                    fetchConversations();
                }
            }

            const aiMessage = {
                id: aiResponseData._id,
                text: aiResponseData.message,
                sender: 'ai',
                timestamp: aiResponseData.createdAt
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Failed to send message:', err);
            const errorMsg = err.response?.data?.message || 'Failed to get response. Please try again.';

            if (err.response?.status === 429) {
                setError('quota_exceeded');
            } else {
                setError(errorMsg);
            }
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const startNewChat = () => {
        setMessages([INITIAL_MESSAGE]);
        setCurrentConversationId(null);
        setShowSidebar(false);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-6 bg-slate-50 dark:bg-slate-900 md:rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative">

            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="absolute inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 md:relative md:block shadow-xl md:shadow-none"
                    >
                        <div className="p-4 h-full flex flex-col">
                            <button
                                onClick={startNewChat}
                                className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl transition-colors shadow-sm mb-6"
                            >
                                <Plus size={20} />
                                <span className="font-medium">New Chat</span>
                            </button>

                            <div className="flex-1 overflow-y-auto">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Recent Chats</h3>
                                {isLoadingConversations ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {conversations.length === 0 ? (
                                            <p className="text-sm text-slate-400 px-2 italic">No earlier history</p>
                                        ) : (
                                            conversations.map((conv) => (
                                                <button
                                                    key={conv._id}
                                                    onClick={() => loadConversation(conv._id)}
                                                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors flex items-center gap-3 truncate border
                                                        ${currentConversationId === conv._id
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                                                            : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                        }
                                                    `}
                                                >
                                                    <MessageSquare size={16} className={`flex-shrink-0 ${currentConversationId === conv._id ? 'text-emerald-500' : 'text-slate-400'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate font-medium">{conv.title}</p>
                                                        <p className="truncate text-xs text-slate-400 mt-0.5">{new Date(conv.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                        {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{currentUser?.email}</p>
                                    </div>
                                </div>
                                {isDemoMode && (
                                    <div className="mt-2 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200 text-center">
                                        Running in Demo Mode
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showSidebar && (
                <div
                    className="absolute inset-0 bg-black/20 z-20 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            <div className="flex-1 flex flex-col w-full bg-slate-50 dark:bg-slate-900 relative">

                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base">MindMate AI</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
                    {messages.length === 0 && !isLoadingHistory && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <Bot size={32} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">Start a conversation...</p>
                        </div>
                    )}

                    {isLoadingHistory && (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                        </div>
                    )}

                    {!isLoadingHistory && (
                        <AnimatePresence initial={false}>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 md:gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`
                                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm
                                        ${message.sender === 'ai'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}
                                    `}>
                                        {message.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </div>

                                    <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`
                                            py-3 px-4 rounded-2xl text-[15px] leading-relaxed shadow-sm
                                            ${message.sender === 'user'
                                                ? 'bg-emerald-600 text-white rounded-tr-sm'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'}
                                        `}>
                                            {message.text}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mt-1 shadow-sm">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-4 px-5 rounded-2xl rounded-tl-sm shadow-sm flex items-center">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center w-full">
                            {error === 'quota_exceeded' ? (
                                <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800 max-w-md text-center shadow-sm">
                                    <p className="text-amber-800 dark:text-amber-200 font-medium mb-2 flex items-center justify-center gap-2">
                                        <AlertCircle size={18} />
                                        <span>AI Service Limit Reached</span>
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                                        The AI service is currently unavailable due to quota limits. You can switch to Demo Mode to continue testing the interface.
                                    </p>
                                    <div className="flex gap-2 justify-center">
                                        <button onClick={() => setIsDemoMode(true)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors">
                                            Switch to Demo Mode
                                        </button>
                                        <button onClick={() => setError(null)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-red-200 dark:border-red-800 shadow-sm">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                    <button onClick={() => { setError(null); handleSendMessage(); }} className="ml-2 underline font-medium hover:text-red-800 dark:hover:text-red-300">
                                        Retry
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {!isTyping && !error && messages.length < 3 && !isLoadingHistory && (
                    <div className="px-4 md:px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient">
                        {SUGGESTIONS.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleSendMessage(suggestion.prompt)}
                                className="flex-shrink-0 bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 text-xs py-2 px-3 rounded-full transition-all duration-200 shadow-sm whitespace-nowrap"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                        <textarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="w-full max-h-32 resize-none bg-transparent border-0 focus:ring-0 p-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 min-h-[44px] text-sm"
                            rows={1}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputText.trim() || isTyping}
                            className={`
                                p-3 rounded-xl transition-all duration-200 flex-shrink-0 mb-[1px]
                                ${!inputText.trim() || isTyping
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transform hover:scale-105 active:scale-95'}
                            `}
                        >
                            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                    <div className="text-center mt-2 flex justify-between items-center px-1">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mx-auto">
                            MindMate AI is supportive, but not a replacement for professional help.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
