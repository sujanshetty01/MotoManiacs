import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAppContext } from '../hooks/useAppContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

const MotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-900 dark:text-white text-center p-4 overflow-hidden transition-colors duration-300">
             <div className="absolute top-4 right-4 z-20">
                <ThemeToggleButton />
             </div>
             <img 
                src="https://picsum.photos/seed/login-bg/1920/1080" 
                alt="Motorsport background"
                className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-all duration-300 brightness-75 dark:brightness-50"
            />
            <div className="relative z-10 w-full max-w-md bg-white/70 dark:bg-black/70 backdrop-blur-sm p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col items-center">
                    <MotoIcon />
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tighter uppercase mt-4" style={{ textShadow: '0 0 15px rgba(229, 9, 20, 0.8)' }}>
                        MotoManiacs
                    </h1>
                    <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Login to your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6 mt-8">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                     <p className="text-xs text-gray-500 dark:text-gray-500 text-center pt-4">
                        Demo User: user@example.com / password<br/>
                        Demo Admin: admin@example.com / password
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;