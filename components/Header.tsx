import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Button from './Button';
import ThemeToggleButton from './ThemeToggleButton';

const MotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);


const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            setIsOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
            // Still navigate even if logout fails
            navigate('/');
            setIsOpen(false);
        }
    };

    const handleLogin = () => {
        navigate('/');
        setIsOpen(false);
    }

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block py-2 pr-4 pl-3 uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`;
    
    return (
        <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/home" className="flex items-center space-x-2">
                    <MotoIcon />
                    <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">MotoManiacs</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <NavLink to="/home" className={navLinkClasses}>Home</NavLink>
                    <NavLink to="/events" className={navLinkClasses}>Events</NavLink>
                    {currentUser && <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>}
                    {currentUser?.role === 'admin' && <NavLink to="/admin/dashboard" className={navLinkClasses}>Admin</NavLink>}
                    {currentUser ? (
                        <Button onClick={handleLogout} size="sm" variant="secondary" className="flex items-center">
                            <span>Way Out</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Button>
                    ) : (
                        <Button onClick={handleLogin} size="sm">Login</Button>
                    )}
                    <ThemeToggleButton />
                </div>

                <div className="md:hidden flex items-center space-x-4">
                     <ThemeToggleButton />
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 p-2">
                    <NavLink to="/home" className={navLinkClasses} onClick={()=>setIsOpen(false)}>Home</NavLink>
                    <NavLink to="/events" className={navLinkClasses} onClick={()=>setIsOpen(false)}>Events</NavLink>
                    {currentUser && <NavLink to="/dashboard" className={navLinkClasses} onClick={()=>setIsOpen(false)}>Dashboard</NavLink>}
                    {currentUser?.role === 'admin' && <NavLink to="/admin/dashboard" className={navLinkClasses} onClick={()=>setIsOpen(false)}>Admin</NavLink>}
                    {currentUser ? (
                        <div className="p-2">
                            <Button onClick={handleLogout} size="sm" variant="secondary" className="w-full flex items-center justify-center">
                                <span>Way Out</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Button>
                        </div>
                    ): (
                        <div className="p-2">
                            <Button onClick={handleLogin} size="sm" className="w-full">Login</Button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;