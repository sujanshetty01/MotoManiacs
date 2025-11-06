import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../hooks/useAppContext';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const iconVariants = {
    hidden: { opacity: 0, rotate: -90, scale: 0.5 },
    visible: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, rotate: 90, scale: 0.5, transition: { duration: 0.3 } },
};

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                    <motion.div key="sun" variants={iconVariants} initial="hidden" animate="visible" exit="exit">
                        <SunIcon />
                    </motion.div>
                ) : (
                    <motion.div key="moon" variants={iconVariants} initial="hidden" animate="visible" exit="exit">
                        <MoonIcon />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggleButton;
