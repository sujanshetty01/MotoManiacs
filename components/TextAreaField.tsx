import React from 'react';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const TextAreaField: React.FC<TextareaFieldProps> = ({ label, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">{label}</label>
        <textarea 
            {...props} 
            className="w-full bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" 
        />
    </div>
);

export default TextAreaField;
