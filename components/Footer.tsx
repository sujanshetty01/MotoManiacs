import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">MotoManiacs</p>
                    <div className="flex mt-4 sm:mt-0 space-x-6">
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-300">About Us</a>
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-300">Sponsors</a>
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-300">Contact Us</a>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 dark:border-gray-700" />
                <p className="text-center text-gray-500 dark:text-gray-500">© 2024 MotoManiacs. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;