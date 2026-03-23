import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, Building2, Award, Target, Rocket, Star,
  Mail, Lock, User, ArrowRight, Sparkles, TrendingUp, Zap, Globe
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- ANIMATION COMPONENTS ---
// eslint-disable-next-line no-unused-vars
const FloatingIcon = ({ Icon, delay, duration, x, y, size = 24 }) => (
  <motion.div
    className="absolute text-white/10"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      opacity: [0, 0.15, 0.15, 0],
      scale: [0, 1, 1, 0],
      rotate: [0, 10, -10, 0]
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <Icon size={size} />
  </motion.div>
);

const GlowOrb = ({ color, size, x, y, delay }) => (
  <motion.div
    className="absolute rounded-full blur-3xl"
    style={{ background: color, width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // --- LOGIC 1: GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        navigate('/'); // Old user -> Home
      } else {
        // New user -> Create Profile -> Onboarding
        await setDoc(userRef, {
          id: user.uid,
          email: user.email,
          full_name: user.displayName,
          avatar_url: user.photoURL,
          user_type: 'seeker', // Default
          onboarding_completed: false,
          created_at: new Date().toISOString()
        });
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC 2: EMAIL/PASSWORD LOGIN & SIGNUP ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // LOGIN LOGIC
        await signInWithEmailAndPassword(auth, email, password);
        // If successful, AuthObserver in Home.jsx will handle redirect, 
        // but we can force it here too:
        navigate('/');
      } else {
        // SIGN UP LOGIC
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Create Profile in Database
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          email: user.email,
          full_name: name, // From the input field
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`, // Generate avatar
          user_type: 'seeker',
          onboarding_completed: false,
          created_at: new Date().toISOString()
        });
        navigate('/onboarding');
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const floatingIcons = [
    { Icon: Briefcase, delay: 0, duration: 8, x: '10%', y: '20%', size: 32 },
    { Icon: Users, delay: 1, duration: 10, x: '80%', y: '15%', size: 28 },
    { Icon: Building2, delay: 2, duration: 9, x: '15%', y: '70%', size: 36 },
    { Icon: Award, delay: 0.5, duration: 11, x: '85%', y: '60%', size: 30 },
    { Icon: Rocket, delay: 2.5, duration: 12, x: '25%', y: '85%', size: 34 },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <GlowOrb color="rgba(16, 185, 129, 0.4)" size="400px" x="-10%" y="-10%" delay={0} />
      <GlowOrb color="rgba(5, 150, 105, 0.35)" size="350px" x="60%" y="-20%" delay={2} />
      
      {floatingIcons.map((props, index) => <FloatingIcon key={index} {...props} />)}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent">
              SkillDeck
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Connect with your dream career</p>
          </div>

          {/* Glass Card */}
          <div className="relative backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-8 shadow-2xl shadow-emerald-500/10">
            
            {/* Toggle Switch */}
            <div className="relative flex rounded-xl bg-white/[0.05] p-1 mb-8">
              <motion.div
                className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500"
                initial={false}
                animate={{ left: isLogin ? '4px' : '50%', width: 'calc(50% - 8px)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button onClick={() => setIsLogin(true)} className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${isLogin ? 'text-white' : 'text-slate-400'}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors ${!isLogin ? 'text-white' : 'text-slate-400'}`}>Sign Up</button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label className="text-slate-300 text-sm font-medium ml-1">Full Name</label>
                    <div className="relative mt-1 group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        required={!isLogin}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 h-12 bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-slate-300 text-sm font-medium ml-1">Email Address</label>
                <div className="relative mt-1 group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 h-12 bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
                <div className="relative mt-1 group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 h-12 bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.1]" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/50 backdrop-blur px-4 text-slate-500">Or continue with</span></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* GOOGLE BUTTON (Active) */}
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:bg-white/[0.1] hover:border-white/[0.2] hover:text-white transition-all"
              >
                <Globe className="w-5 h-5" />
              </motion.button>
              
              {/* Other buttons (Visual only for now) */}
              <div className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-500 cursor-not-allowed opacity-50">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-500 cursor-not-allowed opacity-50">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}