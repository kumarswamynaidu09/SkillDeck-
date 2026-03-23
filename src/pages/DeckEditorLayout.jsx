import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, Save, Check, AlertCircle, X } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { User, Zap, Briefcase, GraduationCap, Award, Languages, FolderGit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileSlideEditor from '@/components/editors/ProfileSlideEditor';
import SkillsSlideEditor from '@/components/editors/SkillsSlideEditor';
import CompanySlideEditor from '@/components/editors/CompanySlideEditor';
import ExperienceSlideEditor from '@/components/editors/ExperienceSlideEditor';
import EducationSlideEditor from '@/components/editors/EducationSlideEditor';
import CertsSlideEditor from '@/components/editors/CertsSlideEditor';
import LanguagesSlideEditor from '@/components/editors/LanguagesSlideEditor';
import ProjectsSlideEditor from '@/components/editors/ProjectsSlideEditor';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certs', label: 'Certs', icon: Award },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'projects', label: 'Projects', icon: FolderGit2 }
];

const GlowOrb = ({ color, size, x, y }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl border pointer-events-none
      ${type === 'success'
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        : 'bg-red-500/10 border-red-500/20 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
      }`}
  >
    <div className={`p-1.5 rounded-full ${type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
      {type === 'success' ? <Check size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-red-400" />}
    </div>
    <span className="font-medium text-sm tracking-wide pr-2">{message}</span>
  </motion.div>
);

// --- NEW: UNSAVED CHANGES MODAL ---
const UnsavedModal = ({ onSave, onDiscard, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
      className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
    >
      <GlowOrb color="rgba(239, 68, 68, 0.2)" size="300px" x="50%" y="-50%" />

      <h3 className="text-2xl font-bold text-white mb-2">Unsaved Changes</h3>
      <p className="text-slate-400 text-sm mb-8 leading-relaxed">
        You have unsaved edits. If you leave now, your changes will be lost forever.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onDiscard}
          className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold rounded-xl text-sm transition-colors"
        >
          Discard
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
        >
          Save
        </button>
      </div>

      <button onClick={onCancel} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white bg-white/5 rounded-full transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  </motion.div>
);

export default function DeckEditorLayout() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // --- DIRTY STATE TRACKING ---
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) setUserData(snap.data());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  // When user types, mark as dirty
  const handleLocalUpdate = (partialData) => {
    if (partialData._error) {
      showToast('error', partialData._error);
      return;
    }
    setUserData(prev => ({ ...prev, ...partialData }));
    setIsDirty(true);
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveToDb = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...userData,
        deck_created: true,
        updated_at: new Date()
      }, { merge: true });

      setIsDirty(false); // Clean state after save
      setTimeout(() => setIsSaving(false), 800);
      showToast('success', 'Deck Saved Successfully');
      return true; // Return success
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      showToast('error', 'Failed to Save Deck');
      return false; // Return failure
    }
  };

  // --- NAVIGATION INTERCEPTOR ---
  const handleBack = () => {
    if (isDirty) {
      setPendingNavigation(() => () => navigate('/profile'));
      setShowUnsavedModal(true);
    } else {
      navigate('/profile');
    }
  };

  const confirmSave = async () => {
    const success = await handleSaveToDb();
    if (success) {
      setShowUnsavedModal(false);
      if (pendingNavigation) pendingNavigation();
    }
  };

  const confirmDiscard = () => {
    setShowUnsavedModal(false);
    setIsDirty(false); // Force clean so navigation works
    if (pendingNavigation) pendingNavigation();
  };

  const handleTabChange = (direction) => {
    const currentIndex = TABS.findIndex(tab => tab.id === activeTab);
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, TABS.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    setActiveTab(TABS[newIndex].id);
  };

  const renderBottomNav = () => (
    <div className="h-16 bg-transparent border-t border-white/10 flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden flex-none z-30" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="w-6 flex-shrink-0" />
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[54px] h-14 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/5'}`}>
            <tab.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span className="text-[9px] font-medium tracking-wide">{tab.label}</span>
            {isActive && <div className="w-1 h-1 rounded-full bg-white mt-1" />}
          </button>
        );
      })}
      <div className="w-6 flex-shrink-0" />
    </div>
  );

  const renderEditor = () => {
    const safeData = userData || {};
    const props = {
      data: safeData,
      onUpdate: handleLocalUpdate,
      onSave: handleSaveToDb,
      bottomNav: renderBottomNav()
    };

    if (safeData.user_type === 'recruiter' && activeTab === 'profile') return <CompanySlideEditor {...props} />;

    switch (activeTab) {
      case 'profile': return <ProfileSlideEditor {...props} />;
      case 'skills': return <SkillsSlideEditor {...props} />;
      case 'experience': return <ExperienceSlideEditor {...props} />;
      case 'education': return <EducationSlideEditor {...props} />;
      case 'certs': return <CertsSlideEditor {...props} />;
      case 'languages': return <LanguagesSlideEditor {...props} />;
      case 'projects': return <ProjectsSlideEditor {...props} />;
      default: return <div className="text-slate-500 pt-20">Coming Soon</div>;
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>;

  const currentTabLabel = TABS.find(t => t.id === activeTab)?.label;
  const isFirstTab = TABS.findIndex(t => t.id === activeTab) === 0;
  const isLastTab = TABS.findIndex(t => t.id === activeTab) === TABS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <GlowOrb color="rgba(16, 185, 129, 0.2)" size="500px" x="50%" y="-20%" />

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
        {/* RENDER MODAL */}
        {showUnsavedModal && (
          <UnsavedModal
            onSave={confirmSave}
            onDiscard={confirmDiscard}
            onCancel={() => setShowUnsavedModal(false)}
          />
        )}
      </AnimatePresence>

      <div className="h-16 px-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 z-20">
        <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
        <div className="text-center">
          <h2 className="text-white font-bold capitalize">{currentTabLabel} Deck</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tap arrows to navigate</p>
        </div>
        <button onClick={handleSaveToDb} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <button onClick={() => handleTabChange('prev')} className={`absolute left-2 md:left-8 p-3 rounded-full transition-all z-20 ${isFirstTab ? 'opacity-0 pointer-events-none' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110'}`}>
          <ChevronLeft className="w-8 h-8" />
        </button>

        {renderEditor()}

        <button onClick={() => handleTabChange('next')} className={`absolute right-2 md:right-8 p-3 rounded-full transition-all z-20 ${isLastTab ? 'opacity-0 pointer-events-none' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110'}`}>
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}