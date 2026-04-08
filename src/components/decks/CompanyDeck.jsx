import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Building2, Briefcase, Code2, DollarSign, Gift,
  MapPin, Globe, CheckCircle2, Users, Rocket
} from 'lucide-react';


// --- TABS FOR COMPANIES ---
const TABS = [
  { id: 'overview', label: 'Company', icon: Building2 },
  { id: 'role', label: 'The Role', icon: Briefcase },
  { id: 'stack', label: 'Tech Stack', icon: Code2 },
  { id: 'perks', label: 'Perks', icon: Gift },
];

export default function CompanyDeck({
  company,
  onSwipe,
  isTop = false,
  stackIndex = 0,
  // NEW PROPS FOR LOCKING
  isLocked = false,
  onAttemptSwipe
}) {
  const [activeTab, setActiveTab] = useState(0);

  // --- PHYSICS ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-15, 0, 15]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);

  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500; // Trigger swipe on quick flicks

    const isSwipeRight = info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold;
    const isSwipeLeft = info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold;

    if (isSwipeRight) {
      setExitX(1000);
      onSwipe?.('like', company);
    } else if (isSwipeLeft) {
      setExitX(-1000);
      onSwipe?.('pass', company);
    }
  };

  const handleTap = (direction) => {
    if (direction === 'next') {
      setActiveTab((prev) => (prev < TABS.length - 1 ? prev + 1 : prev));
    } else {
      setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  if (!company) return null;

  // --- MOCK DATA (Until Recruiter fills their profile) ---
  const companyName = company.full_name ? `${company.full_name}'s Team` : "Stealth Startup";
  const jobTitle = "Full Stack Engineer";
  const salary = "$100k - $140k";

  const renderContent = () => {
    switch (TABS[activeTab].id) {

      // --- 1. COMPANY OVERVIEW ---
      case 'overview':
        return (
          <div className="flex flex-col items-center pt-8 text-center space-y-4 h-full overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <img
                src={company.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${companyName}`}
                className="relative w-32 h-32 rounded-2xl object-cover border-4 border-white/10 shadow-2xl bg-slate-800"
                alt="Logo"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">{companyName}</h2>
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-sm">
                <MapPin className="w-3 h-3" />
                {company.location || "Remote / Hybrid"}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-sm font-bold mt-2">
                <Users className="w-3 h-3" />
                10-50 Employees
              </div>
            </div>

            <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-slate-300 text-sm leading-relaxed">
                "We are building the future of {company.industry || 'Tech'}. Join a fast-paced team that values innovation, ownership, and shipping code that matters."
              </p>
            </div>
          </div>
        );

      // --- 2. THE ROLE (JOB) ---
      case 'role':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-400" /> The Role
            </h3>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-6">
              <h2 className="text-xl font-bold text-white">{jobTitle}</h2>
              <div className="flex items-center gap-2 text-emerald-300 font-mono mt-1">
                <DollarSign className="w-4 h-4" /> {salary}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold">What you'll do</h4>
              {[
                "Build scalable APIs using Node.js and Firebase",
                "Design beautiful, responsive UIs with React",
                "Collaborate with the founding team on product direction",
                "Optimize application performance for mobile"
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <p className="text-slate-300 text-sm leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // --- 3. TECH STACK ---
      case 'stack':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-emerald-400" /> Tech Stack
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['React', 'Node.js', 'Firebase', 'Tailwind', 'AWS', 'TypeScript'].map((tech, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'}`} />
                  <span className="text-slate-200 font-medium text-sm">{tech}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Our Engineering Culture</h4>
              <p className="text-slate-300 text-sm">
                We ship fast. We use CI/CD. We believe in code reviews and automated testing, but we don't let process slow us down.
              </p>
            </div>
          </div>
        );

      // --- 4. PERKS ---
      case 'perks':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-emerald-400" /> Benefits
            </h3>
            <div className="space-y-3">
              {[
                { icon: Globe, label: "Remote-First", desc: "Work from anywhere in the world." },
                { icon: Rocket, label: "Equity", desc: "Early stage stock options." },
                { icon: Users, label: "Retreats", desc: "Annual company fly-outs." },
                { icon: Building2, label: "Co-working", desc: "Stipend for your home office." }
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
                    <perk.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{perk.label}</h4>
                    <p className="text-slate-400 text-xs">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : undefined,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? cardOpacity : 1,
        zIndex: 100 - stackIndex,
        scale: 1 - stackIndex * 0.05,
        top: 0,
        touchAction: isTop ? 'none' : 'auto'
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      dragMomentum={false}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      dragDirectionLock
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
      exit={{
        x: exitX,
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3 }
      }}
    >
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-white/10 flex flex-col">

        {/* HEADER */}
        <div className="pt-6 pb-2 text-center bg-gradient-to-b from-black/40 to-transparent flex-none">
          <h3 className="text-purple-100 font-semibold tracking-wide text-lg">
            <span className="text-purple-400">{TABS[activeTab].label}</span> Deck
          </h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tap sides to navigate</p>
        </div>

        {/* TAP ZONES */}
        {isTop && (
          <>
            <div className="absolute top-20 bottom-24 left-0 w-[25%] z-20" onClick={() => handleTap('prev')} />
            <div className="absolute top-20 bottom-24 right-0 w-[25%] z-20" onClick={() => handleTap('next')} />
          </>
        )}

        {/* CONTENT */}
        <div className="flex-1 relative z-10 overflow-hidden">
          {renderContent()}
        </div>



        {/* BOTTOM NAV (Centered perfectly for 4 items) */}
        <div
          className="h-16 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center justify-evenly gap-1 px-2 flex-none w-full"
        >
          {TABS.map((tab, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                onClick={(e) => { e.stopPropagation(); setActiveTab(index); }}
                className={`flex-1 flex flex-col items-center justify-center h-14 rounded-xl transition-all duration-300 ${isActive ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:bg-white/5'}`}
              >
                <tab.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-[10px] sm:text-xs font-medium tracking-wide">{tab.label}</span>
                {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white mt-1" />}
              </button>
            )
          })}
        </div>

        {/* OVERLAYS */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 -rotate-12 border-4 border-green-400 rounded-xl px-4 py-2 z-50 bg-black/50 backdrop-blur-md pointer-events-none">
          <span className="text-green-400 font-bold text-4xl tracking-widest uppercase">APPLY</span>
        </motion.div>
        <motion.div style={{ opacity: passOpacity }} className="absolute top-10 right-10 rotate-12 border-4 border-red-500 rounded-xl px-4 py-2 z-50 bg-black/50 backdrop-blur-md pointer-events-none">
          <span className="text-red-500 font-bold text-4xl tracking-widest uppercase">PASS</span>
        </motion.div>

      </div>
    </motion.div>
  );
}