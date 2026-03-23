import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Settings, LogOut, Sparkles, User, ChevronRight, Briefcase, Zap, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { auth } from '@/lib/firebase';


// --- THEME COMPONENT (Copied from Home.jsx) ---
const GlowOrb = ({ color, size, x, y }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useOutletContext() || {};
  // If no user context, don't break
  const safeUser = user || null;

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (!safeUser) return <div className="h-full bg-slate-950" />;

  return (
    // UPDATED: Added Gradient Background
    <div className="h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col relative overflow-hidden font-sans text-white">
      
      {/* UPDATED: Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <GlowOrb color="rgba(16, 185, 129, 0.2)" size="500px" x="50%" y="-20%" />

      {/* HEADER */}
      <div className="relative z-10 pt-4 px-6 pb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button onClick={handleSignOut} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <LogOut className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="px-6 space-y-6 relative z-10 flex-1 overflow-y-auto pb-6">
        
        {/* --- 1. THE HERO CARD (CLICK TO EDIT) --- */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/deck-editor')} 
          className="w-full relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-emerald-950/50 to-slate-900 border border-emerald-500/30 p-6 text-left shadow-2xl"
        >
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 border border-emerald-500/30 rounded-[2rem]" />
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
              <Edit3 className="w-3 h-3" /> Edit Deck
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img 
              src={safeUser.avatar_url || "https://github.com/shadcn.png"} 
              className="w-16 h-16 rounded-2xl border-2 border-white/10 object-cover bg-slate-800"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{safeUser.full_name || "Your Name"}</h2>
              <p className="text-emerald-400 text-sm">{safeUser.title || "No Title Set"}</p>
            </div>
          </div>

          {/* Mini Preview Chips */}
          <div className="flex gap-2 mb-2">
             <div className="h-2 w-16 rounded-full bg-emerald-500/20" />
             <div className="h-2 w-12 rounded-full bg-white/10" />
             <div className="h-2 w-8 rounded-full bg-white/10" />
          </div>
          <p className="text-slate-500 text-xs">Tap to update your photos, bio, skills, and more.</p>
        </motion.button>

        {/* --- 2. SETTINGS LIST --- */}
        <div className="space-y-2">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2 mb-2">Account Settings</h3>
          
          {[
            { label: 'Notifications', icon: Sparkles, action: () => {} },
            { label: 'Privacy & Security', icon: User, action: () => {} },
            { label: 'Settings', icon: Settings, action: () => navigate('/settings') },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-slate-200 font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400" />
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}