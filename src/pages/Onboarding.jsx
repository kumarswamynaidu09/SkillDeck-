import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Search, ChevronRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export default function Onboarding() {
  const navigate = useNavigate();

  const selectRole = async (role) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      // FIX: Added 'industry: "Any"' so the Home Feed doesn't filter everything out
      await updateDoc(userRef, {
        user_type: role,
        industry: 'Any', // <--- THE KEY FIX
        onboarding_completed: true,
        deck_created: false 
      });

      navigate('/onboarding-wizard');
    } catch (error) {
      console.error("Error saving role:", error);
    } 
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-2">Welcome to SkillDeck</h1>
        <p className="text-slate-400 text-center mb-10">Choose your path to get started.</p>

        <div className="grid gap-4">
          <button
            onClick={() => selectRole('seeker')}
            className="group relative flex items-center p-6 bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all hover:bg-white/10"
          >
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl mr-5 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white">Find Work</h3>
              <p className="text-sm text-slate-400">I am looking for job opportunities.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => selectRole('recruiter')}
            className="group relative flex items-center p-6 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl transition-all hover:bg-white/10"
          >
            <div className="p-4 bg-purple-500/20 text-purple-400 rounded-xl mr-5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-white">Hire Talent</h3>
              <p className="text-sm text-slate-400">I want to hire professionals.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// skilldeck
