import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, UserSearch } from 'lucide-react';

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-gray-900 rounded-full border border-gray-800">
      <button
        onClick={() => onRoleChange('seeker')}
        className="relative px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
      >
        {currentRole === 'seeker' && (
          <motion.div
            layoutId="roleIndicator"
            className="absolute inset-0 bg-blue-900 rounded-full border border-blue-800"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Briefcase className={`w-4 h-4 relative z-10 ${currentRole === 'seeker' ? 'text-blue-400' : 'text-gray-500'}`} />
        <span className={`text-sm font-semibold relative z-10 ${currentRole === 'seeker' ? 'text-white' : 'text-gray-500'}`}>
          Get Hired
        </span>
      </button>
      
      <button
        onClick={() => onRoleChange('recruiter')}
        className="relative px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
      >
        {currentRole === 'recruiter' && (
          <motion.div
            layoutId="roleIndicator"
            className="absolute inset-0 bg-blue-900 rounded-full border border-blue-800"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <UserSearch className={`w-4 h-4 relative z-10 ${currentRole === 'recruiter' ? 'text-blue-400' : 'text-gray-500'}`} />
        <span className={`text-sm font-semibold relative z-10 ${currentRole === 'recruiter' ? 'text-white' : 'text-gray-500'}`}>
          Hire
        </span>
      </button>
    </div>
  );
}