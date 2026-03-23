import React from 'react';

export const Button = ({ children, className, variant, ...props }) => (
  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${className} ${variant === 'outline' ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`} {...props}>
    {children}
  </button>
);

export const Input = ({ className, ...props }) => (
  <input className={`w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
);

export const Textarea = ({ className, ...props }) => (
  <textarea className={`w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
);

export const Label = ({ children, className }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`}>{children}</label>
);

export const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>{children}</span>
);

export const Select = ({ children, onValueChange, value }) => (
  <div className="relative">
    <select 
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white appearance-none"
    >
      {children}
    </select>
  </div>
);
export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectValue = () => null;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;