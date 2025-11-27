import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">{label}</label>
        <input 
            {...props} 
            className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" 
        />
    </div>
);

export default InputField;
