import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Toast = () => {
    const { notifications, removeNotification } = useNotification();

    const getStyles = (type) => {
        switch (type) {
            case 'success': return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-300', icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> };
            case 'error': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-300', icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" /> };
            case 'warning': return { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-300', icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" /> };
            case 'info':
            default: return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-300', icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" /> };
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => {
                    const styles = getStyles(notification.type);
                    return (
                        <motion.div key={notification.id} initial={{ opacity: 0, x: 400 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 400 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`${styles.bg} ${styles.border} ${styles.text} mb-3 p-4 rounded-lg border flex items-center gap-3 pointer-events-auto shadow-lg max-w-sm`}>
                            {styles.icon}
                            <span className="flex-1 text-sm font-medium">{notification.message}</span>
                            <button onClick={() => removeNotification(notification.id)} className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
export default Toast;
