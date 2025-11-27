import React, { useState } from 'react';
import { signIn, signUp, setUserRole, signOutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SeedAdminPage: React.FC = () => {
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const seedAdmin = async () => {
        setStatus('Starting seed process...');
        const email = 'admin@motomaniacs.com';
        const password = 'admin123';

        try {
            // Try to sign in first
            setStatus('Attempting to sign in...');
            try {
                const user = await signIn(email, password);
                setStatus(`Signed in as ${user.email}. Checking role...`);
                if (user.role !== 'admin') {
                    setStatus('User exists but is not admin. Updating role...');
                    await setUserRole(user.id, 'admin');
                    setStatus('Role updated to admin.');
                } else {
                    setStatus('User is already admin.');
                }
            } catch (signInError: any) {
                // If sign in fails, try to sign up
                // Note: The error message check depends on what authService throws.
                // authService throws "No account found with this email." or "Invalid email or password."
                
                setStatus(`Sign in failed: ${signInError.message}. Attempting to create user...`);

                try {
                    const newUser = await signUp(email, password);
                    setStatus('User created. Setting admin role...');
                    await setUserRole(newUser.id, 'admin');
                    setStatus('Admin user created successfully.');
                } catch (signUpError: any) {
                     if (signUpError.message.includes('already exists')) {
                         setStatus('User exists but password might be wrong. Cannot reset password programmatically without email. Please delete user from Firebase Console or use Forgot Password.');
                     } else {
                         setStatus(`Sign up failed: ${signUpError.message}`);
                     }
                }
            }
            
            setStatus('Seed process completed. Redirecting to login...');
            await signOutUser();
            setTimeout(() => navigate('/login'), 3000);

        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Seed Admin User</h1>
            <button 
                onClick={seedAdmin}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Start Seed Process
            </button>
            <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-md text-center">
                <p>{status}</p>
            </div>
        </div>
    );
};

export default SeedAdminPage;
