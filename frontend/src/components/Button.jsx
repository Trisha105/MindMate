import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
        secondary: "bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    const variantStyles = variants[variant] || variants.primary;

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
