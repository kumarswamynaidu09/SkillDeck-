import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search, Briefcase, Zap, MessageSquare, Send, Users, Sparkles, UserPlus } from 'lucide-react';

// --- FIREBASE ---
import { base44 } from '@/api/base44Client';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp, onSnapshot } from 'firebase/firestore';


import SwipeDeck from '@/components/decks/SwipeDeck';
import CompanyDeck from '@/components/decks/CompanyDeck';

// --- THEME COMPONENTS ---
const GlowOrb = ({ color, size, x, y }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ background: color, width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

// --- MATCH POPUP ---
const MatchOverlay = ({ professional, onClose, onChat }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-6"
  >
    <GlowOrb color="rgba(16, 185, 129, 0.4)" size="300px" x="50%" y="50%" />
    <motion.div
      initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="relative mb-8"
    >
      <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
      <img src={professional.avatar_url} className="relative w-32 h-32 rounded-full border-4 border-emerald-400 object-cover shadow-2xl" />
    </motion.div>
    <h2 className="text-4xl font-black text-white text-center mb-2 italic">IT'S A MATCH!</h2>
    <p className="text-slate-400 text-center mb-8 max-w-xs">You and <span className="text-emerald-400 font-bold">{professional.full_name}</span> like each other.</p>
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <button onClick={onChat} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
        <Send className="w-5 h-5" /> Send Message
      </button>
      <button onClick={onClose} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl">Keep Swiping</button>
    </div>
  </motion.div>
);

// --- NEW: CREATE DECK MODAL ---
const CreateDeckModal = ({ onClose, onGoToProfile }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6"
  >
    <motion.div
      initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
      className="bg-slate-900 border border-emerald-500/30 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-300" />
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <UserPlus className="w-10 h-10 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Create Your Deck</h2>
      <p className="text-slate-400 mb-8 leading-relaxed">
        You need a profile deck before you can match with others. It only takes a minute!
      </p>
      <button
        onClick={onGoToProfile}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
      >
        Build My Deck
      </button>
      <button onClick={onClose} className="mt-4 text-slate-500 text-sm hover:text-white transition-colors">
        Take a look around first
      </button>
    </motion.div>
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();
  const { user, viewMode, setViewMode, incomingLikes } = useOutletContext() || {};
  // If no user context (ex: standalone testing or fast refresh error), don't break
  const safeUser = user || null;

  // --- STATE & REFS ---
  const swipedSet = useRef(new Set()); // Tracks IDs we swiped
  const [swipedIds, setSwipedIds] = useState([]); // Triggers re-render when we swipe

  const [activeTab, setActiveTab] = useState('home');
  const [matchPopup, setMatchPopup] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);


  // 2. FETCH HISTORY (This Fixes the Refresh Bug)
  useEffect(() => {
    if (!safeUser) return;

    const fetchHistory = async () => {
      try {
        // A. Who liked me?
        const incomingQ = query(
          collection(db, "swipes"),
          where("to", "==", user.id),
          where("type", "==", "like")
        );

        // B. Who did I already swipe? (THIS IS THE KEY PART)
        const mySwipesQ = query(
          collection(db, "swipes"),
          where("from", "==", user.id)
        );

        const [incomingSnap, mySwipesSnap] = await Promise.all([
          getDocs(incomingQ),
          getDocs(mySwipesQ)
        ]);

        // Process Incoming
        const likedBy = incomingSnap.docs.map(doc => doc.data().from);
        setIncomingLikes(likedBy);

        // Process My Past Swipes
        const mySwipedIds = mySwipesSnap.docs.map(doc => doc.data().to);

        // Add to our strict filter list
        mySwipedIds.forEach(id => swipedSet.current.add(id));
        setSwipedIds(prev => [...prev, ...mySwipedIds]); // Update React state
        setIsHistoryLoading(false);

      } catch (error) {
        console.error("Error loading history:", error);
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [safeUser]);

  // 3. REAL-TIME DATA LISTENER (Relaxed Logic for Instant Review)
  useEffect(() => {
    if (!safeUser) return;

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const seenContent = new Set();

      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => {
          // Rule 1: Remove Myself
          if (doc.id === user.id) return false;

          // Rule 2: Filter by Role
          const targetRole = user.user_type === 'seeker' ? 'recruiter' : 'seeker';
          if (doc.user_type !== targetRole) return false;

          // REMOVED Rule 3: We do NOT filter swiped IDs here anymore.
          // This allows the "Review" button to work instantly.

          // Rule 4: CONTENT DEDUPLICATION (Fixes "Ghost" Duplicates)
          const uniqueKey = `${doc.full_name || ''}-${doc.title || ''}`.toLowerCase().trim();
          if (seenContent.has(uniqueKey)) return false;

          seenContent.add(uniqueKey);
          return true;
        });

      setProfessionals(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 4. UI FILTER (This does the actual hiding)
  const filteredProfessionals = safeUser ? professionals
    .filter(prof => prof.id !== safeUser.id)
    .filter(prof => !swipedIds.includes(prof.id))
    .filter(prof => {
      const targetRole = user.user_type === 'seeker' ? 'recruiter' : 'seeker';
      if (prof.user_type !== targetRole) return false;

      if (viewMode === 'applicants') {
        return incomingLikes.includes(prof.id);
      } else {
        // Exclude people who already liked you from the standard "Discover" feed
        if (incomingLikes.includes(prof.id)) return false;

        const userIndustry = user.industry || 'Any';
        if (userIndustry === 'Any') return true;
        return prof.industry === userIndustry;
      }
    }) : [];

  const handleSwipe = async (action, professional) => {
    // 1. BLOCK IMMEDIATELY (Local)
    swipedSet.current.add(professional.id);
    setSwipedIds(prev => [...prev, professional.id]);

    // We do NOT remove from 'professionals' state anymore.
    // We let 'filteredProfessionals' handle the hiding.

    if (!safeUser) return;

    const myId = safeUser.id;
    const theirId = professional.id;

    try {
      await setDoc(doc(db, "swipes", `${myId}_${theirId}`), {
        from: myId, to: theirId, type: action, timestamp: serverTimestamp()
      });

      if (action === 'like') {
        const reverseSwipeRef = doc(db, "swipes", `${theirId}_${myId}`);
        const reverseSnap = await getDoc(reverseSwipeRef);

        if (viewMode === 'applicants' || (reverseSnap.exists() && reverseSnap.data().type === 'like')) {
          const matchId = [myId, theirId].sort().join('_');
          await setDoc(doc(db, "matches", matchId), {
            users: [myId, theirId],
            user_details: {
              [myId]: { name: user.full_name, avatar: user.avatar_url },
              [theirId]: { name: professional.full_name, avatar: professional.avatar_url }
            },
            timestamp: serverTimestamp(),
            last_message: "New Match!"
          });
          setMatchPopup(professional);
        }
      }
    } catch (error) {
      console.error("Swipe error:", error);
    }
  };

  if (!safeUser || isLoading || isHistoryLoading) {
    return (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-emerald-500/50 mt-4 text-sm font-medium animate-pulse">Syncing SkillDeck...</p>
      </div>
    );
  }

  const isRecruiter = safeUser.user_type === 'recruiter';
  const isDeckReady = safeUser.deck_created === true;

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 relative overflow-hidden font-sans text-white flex flex-col">
      <AnimatePresence>
        {matchPopup && <MatchOverlay professional={matchPopup} onClose={() => setMatchPopup(null)} onChat={() => { setMatchPopup(null); navigate('/chat'); }} />}

        {showDeckModal && (
          <CreateDeckModal
            onClose={() => setShowDeckModal(false)}
            onGoToProfile={() => navigate('/profile')}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <GlowOrb color="rgba(16, 185, 129, 0.2)" size="500px" x="50%" y="-20%" />

      {/* HEADER */}
      <div className="relative pt-4 px-6 pb-4 z-40 flex justify-between items-center max-w-md mx-auto w-full flex-none">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent theme-logo-text">SkillDeck</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            {isRecruiter ? 'Find Talent' : 'Find Work'}
          </p>
        </div>
        <button onClick={() => navigate('/profile')} className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur group-hover:bg-emerald-500/40 transition-all" />
          <img src={safeUser.avatar_url} className="w-10 h-10 rounded-full border border-white/20 relative z-10 bg-slate-900 object-cover" />
        </button>
      </div>

      {/* VIEW TOGGLE REMOVED - MOVED TO BOTTOM NAV */}

      {/* MAIN CARD STACK */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 pb-6 w-full max-w-md mx-auto overflow-hidden">
        <AnimatePresence mode='wait'>
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((prof, index) => {
              if (index > 1) return null;

              if (isRecruiter) {
                return (
                  <SwipeDeck
                    key={prof.id}
                    professional={prof}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                    stackIndex={index}
                    isLocked={!isDeckReady}
                    onAttemptSwipe={() => setShowDeckModal(true)}
                  />
                );
              } else {
                return (
                  <CompanyDeck
                    key={prof.id}
                    company={prof}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                    stackIndex={index}
                    isLocked={!isDeckReady}
                    onAttemptSwipe={() => setShowDeckModal(true)}
                  />
                );
              }
            }).reverse()
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 max-w-sm backdrop-blur-xl bg-white/[0.03] border border-white/[0.1] rounded-3xl">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative bg-slate-900 border border-emerald-500/30 w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <Search className="w-12 h-12 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {viewMode === 'applicants' ? 'No New Interest' : 'All Caught Up!'}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {isRecruiter ? "No more candidates in this area." : "No more jobs match your criteria."}
              </p>
              <button
                onClick={() => {
                  const idsToKeep = swipedIds.filter(id => {
                    if (viewMode === 'applicants') {
                      return !incomingLikes.includes(id);
                    } else {
                      return incomingLikes.includes(id);
                    }
                  });
                  swipedSet.current = new Set(idsToKeep);
                  setSwipedIds(idsToKeep);
                }}
                className="w-full py-3 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] rounded-xl text-emerald-300 text-sm font-medium transition-all"
              >
                Review Passed Profiles
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}