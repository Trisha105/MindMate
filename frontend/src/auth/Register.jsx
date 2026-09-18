import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setAuthError('');
            await registerUser(data.email, data.password);
            navigate('/');
        } catch (error) {
            setAuthError('Failed to create account. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text mb-2">MindMate</h1>
                    <p className="text-gray-600 dark:text-gray-400">Start your mental wellness journey</p>
                </div>
                <Card className="p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('register')}</h2>
                    {authError && (<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">{authError}</div>)}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input label={t('email')} type="email" placeholder="you@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })} error={errors.email} />
                        <Input label={t('password')} type="password" placeholder="••••••••" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} error={errors.password} />
                        <Input label="Confirm Password" type="password" placeholder="••••••••" {...register("confirmPassword", { required: "Please confirm your password", validate: (val) => { if (watch('password') != val) return "Your passwords do wait match"; } })} error={errors.confirmPassword} />
                        <Button type="submit" className="w-full mt-2" isLoading={loading}>{t('register')}</Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">Already have an account?{' '}<Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">{t('login')}</Link></div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
