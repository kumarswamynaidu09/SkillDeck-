import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, SkipForward } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileSlideEditor from '@/components/editors/ProfileSlideEditor';
import SkillsSlideEditor from '@/components/editors/SkillsSlideEditor';
import CompanySlideEditor from '@/components/editors/CompanySlideEditor';
import ExperienceSlideEditor from '@/components/editors/ExperienceSlideEditor';
import EducationSlideEditor from '@/components/editors/EducationSlideEditor';
import CertsSlideEditor from '@/components/editors/CertsSlideEditor';
import LanguagesSlideEditor from '@/components/editors/LanguagesSlideEditor';
import ProjectsSlideEditor from '@/components/editors/ProjectsSlideEditor';

const STEPS_SEEKER = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' }
];

const STEPS_RECRUITER = [
  { id: 'profile', label: 'Company Profile' } // Recruiters have a much shorter flow
];

const GlowOrb = ({ color, size, x, y }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const steps = userData.user_type === 'recruiter' ? STEPS_RECRUITER : STEPS_SEEKER;
  const currentStep = steps[currentStepIndex];

  const handleLocalUpdate = (partialData) => {
    if (partialData._error) return; // ignore errors for now
    setUserData(prev => ({ ...prev, ...partialData }));
  };

  const handleSaveAndContinue = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...userData,
        deck_created: true, // They've started building their deck
        updated_at: new Date()
      }, { merge: true });
      
      handleNextStep();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    handleNextStep();
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Completed last step!
      navigate('/');
    }
  };

  const renderBottomNav = () => (
    <div className="h-20 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6 flex-none z-30 w-full rounded-b-[2.5rem]">
      <button 
        onClick={handleSkip}
        className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
        disabled={isSaving}
      >
        Skip for now
        <SkipForward className="w-4 h-4" />
      </button>

      <button
        onClick={handleSaveAndContinue}
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold tracking-wide rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
        {!isSaving && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );

  const renderEditor = () => {
    const props = {
      data: userData || {},
      onUpdate: handleLocalUpdate,
      onSave: handleSaveAndContinue, // Re-use continue function for internal save triggers
      bottomNav: renderBottomNav()
    };

    if (userData.user_type === 'recruiter') {
      return <CompanySlideEditor {...props} />;
    }

    switch (currentStep?.id) {
      case 'profile': return <ProfileSlideEditor {...props} />;
      case 'skills': return <SkillsSlideEditor {...props} />;
      case 'experience': return <ExperienceSlideEditor {...props} />;
      case 'education': return <EducationSlideEditor {...props} />;
      case 'projects': return <ProjectsSlideEditor {...props} />;
      default: return null;
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <GlowOrb color="rgba(16, 185, 129, 0.2)" size="500px" x="50%" y="-20%" />

      <div className="pt-12 px-6 pb-2 text-center relative z-20">
        <h2 className="text-white font-bold text-2xl mb-1">Add {currentStep?.label}</h2>
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : idx < currentStepIndex ? 'w-4 bg-emerald-500/50' : 'w-4 bg-white/10'}`} 
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full flex justify-center items-center"
          >
            {renderEditor()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
