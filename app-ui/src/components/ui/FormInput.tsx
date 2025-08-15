import React, { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  startContent?: ReactNode;
}

export function FormInput({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  className = '',
  icon,
  startContent,
}: FormInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {startContent && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startContent}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed ${icon || startContent ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
}
