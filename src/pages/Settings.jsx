import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Type, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const GlowOrb = ({ color, size, x, y }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'base');

  useEffect(() => {
    // 1. Theme Logic
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-reading');
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);

    // 2. Font Size Logic (Using standard Tailwind/Custom scale)
    const sizeMap = {
      'small': '14px',
      'base': '16px',
      'large': '18px',
      'xlarge': '20px'
    };
    root.style.fontSize = sizeMap[fontSize];
    localStorage.setItem('fontSize', fontSize);

  }, [theme, fontSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col relative overflow-hidden font-sans text-white pb-24">
      
      {/* Background FX (Matching Profile.jsx) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <GlowOrb color="rgba(16, 185, 129, 0.2)" size="500px" x="50%" y="-20%" />

      {/* HEADER */}
      <div className="relative z-10 pt-12 px-6 pb-6 flex items-center gap-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
        <button onClick={() => navigate('/profile')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="p-6 space-y-8 max-w-md mx-auto relative z-10 w-full">

        {/* --- APPEARANCE SECTION --- */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Appearance</h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm">
            <button 
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center justify-between p-5 border-b border-white/5 transition-colors ${theme === 'dark' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-300'}`}>Dark Mode (Default)</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-emerald-500' : 'border-slate-600'}`}>
                {theme === 'dark' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
              </div>
            </button>

            <button 
              onClick={() => setTheme('reading')}
              className={`w-full flex items-center justify-between p-5 border-b border-white/5 transition-colors ${theme === 'reading' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <BookOpen className={`w-5 h-5 ${theme === 'reading' ? 'text-emerald-400' : 'text-amber-600'}`} />
                <span className={`font-medium ${theme === 'reading' ? 'text-white' : 'text-slate-300'}`}>Reading Mode</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'reading' ? 'border-emerald-500' : 'border-slate-600'}`}>
                {theme === 'reading' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
              </div>
            </button>

            <button 
              onClick={() => setTheme('light')}
              className={`w-full flex items-center justify-between p-5 transition-colors ${theme === 'light' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className={`font-medium ${theme === 'light' ? 'text-white' : 'text-slate-300'}`}>Light Mode</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-emerald-500' : 'border-slate-600'}`}>
                {theme === 'light' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
              </div>
            </button>
          </div>
        </section>

        {/* --- ACCESSIBILITY SECTION --- */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Reading Size</h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8 px-2">
              <span className="text-xs font-medium text-slate-400">A</span>
              <span className="text-xl font-medium">A</span>
            </div>
            
            <div className="relative w-full h-1 bg-slate-700 rounded-full flex items-center justify-between px-[5px]">
              {['small', 'base', 'large', 'xlarge'].map((size, index) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className="relative z-10 w-6 h-6 -ml-3 first:ml-0 flex items-center justify-center group"
                >
                  <div className={`w-3 h-3 rounded-full transition-all ${fontSize === size ? 'bg-emerald-500 scale-150 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-500 group-hover:bg-slate-400'}`} />
                </button>
              ))}
              {/* Active Line Fill (Visual Only) */}
              <div 
                className="absolute left-0 h-full bg-emerald-500 rounded-full transition-all duration-300" 
                style={{ 
                  width: fontSize === 'small' ? '0%' : 
                         fontSize === 'base' ? '33.3%' : 
                         fontSize === 'large' ? '66.6%' : '100%' 
                }} 
              />
            </div>
            <div className="flex justify-between mt-6 px-1 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <span>Small</span>
              <span>Default</span>
              <span>Large</span>
              <span>Max</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
