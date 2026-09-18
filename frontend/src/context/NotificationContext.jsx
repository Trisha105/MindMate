import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const removeNotification = useCallback((id) => setNotifications(prev => prev.filter(notif => notif.id !== id)), []);
    const addNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        if (duration > 0) setTimeout(() => removeNotification(id), duration);
        return id;
    }, [removeNotification]);
    const showSuccess = useCallback((message, duration) => addNotification(message, 'success', duration), [addNotification]);
    const showError = useCallback((message, duration) => addNotification(message, 'error', duration), [addNotification]);
    const showWarning = useCallback((message, duration) => addNotification(message, 'warning', duration), [addNotification]);
    const showInfo = useCallback((message, duration) => addNotification(message, 'info', duration), [addNotification]);
    const value = { notifications, addNotification, removeNotification, showSuccess, showError, showWarning, showInfo };
    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
