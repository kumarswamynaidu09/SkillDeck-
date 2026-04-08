import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import {
  User, Zap, Briefcase, GraduationCap, Award,
  Languages, FolderGit2, MapPin, Mail, Phone,
  Linkedin, Github, Building2, Calendar
} from 'lucide-react';


const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certs', label: 'Certs', icon: Award },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
];

export default function SwipeDeck({
  professional,
  onSwipe,
  isTop = false,
  stackIndex = 0,
  isLocked = false,
  onAttemptSwipe
}) {

  const [activeTab, setActiveTab] = useState(0);
  const [zoomedCert, setZoomedCert] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

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
      onSwipe?.('like', professional);
    } else if (isSwipeLeft) {
      setExitX(-1000);
      onSwipe?.('pass', professional);
    }
  };

  const handleTap = (direction) => {
    if (direction === 'next') {
      setActiveTab((prev) => (prev < TABS.length - 1 ? prev + 1 : prev));
    } else {
      setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  if (!professional) return null;

  const renderContent = () => {
    switch (TABS[activeTab].id) {
      case 'profile':
        return (
          <div className="flex flex-col items-center pt-8 text-center space-y-4 h-full overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <img src={professional.avatar_url || "https://github.com/shadcn.png"} className="relative w-32 h-32 rounded-2xl object-cover border-4 border-white/10 shadow-2xl bg-slate-800" alt="Profile" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">{professional.full_name}</h2>
              <p className="text-emerald-400 font-medium text-lg">{professional.title || "Software Engineer"}</p>
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-sm"><MapPin className="w-3 h-3" /> {professional.location || "San Francisco, CA"}</div>
            </div>
            <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5"><p className="text-slate-300 text-sm leading-relaxed">{professional.bio || "Passionate professional with expertise in full-stack development and cloud technologies."}</p></div>
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              {[{ label: 'Email', icon: Mail, color: 'text-emerald-400' }, { label: 'Phone', icon: Phone, color: 'text-emerald-400' }, { label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' }, { label: 'GitHub', icon: Github, color: 'text-purple-400' }].map((item, i) => (
                <button key={i} className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-medium hover:bg-white/10 transition-colors"><item.icon className={`w-3 h-3 ${item.color}`} /> {item.label}</button>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Zap className="w-6 h-6 text-emerald-400" /> Skills</h3>
            <div className="flex flex-wrap gap-3">
              {(professional.skills || []).map((skill, i) => {
                // SAFETY CHECK: If skill is null, skip it
                if (!skill) return null;

                const isObj = typeof skill === 'object';
                const name = isObj ? skill.name : skill;
                const level = isObj ? skill.level : 'Basic';

                // SECOND SAFETY CHECK: If name is missing, skip
                if (!name) return null;

                const style = level === 'Advanced' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : level === 'Intermediate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                    : 'bg-white/5 border-white/10 text-slate-300';

                return <div key={i} className={`px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${style}`}>{name}<span className="text-[10px] opacity-60 uppercase tracking-wider">• {level}</span></div>;
              })}
              {(!professional.skills || professional.skills.length === 0) && <p className="text-slate-500 text-sm">No skills added yet.</p>}
            </div>
          </div>
        );

      case 'languages':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Languages className="w-6 h-6 text-emerald-400" /> Languages</h3>
            <div className="flex flex-wrap gap-3">
              {(professional.languages || []).map((lang, i) => {
                if (!lang) return null;
                const name = typeof lang === 'object' ? lang.name : lang;
                const level = typeof lang === 'object' ? lang.level : 'Basic';
                if (!name) return null;

                const style = level === 'Advanced' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : level === 'Intermediate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                    : 'bg-white/5 border-white/10 text-slate-300';

                return <div key={i} className={`px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${style}`}>{name}<span className="text-[10px] opacity-60 uppercase tracking-wider">• {level}</span></div>;
              })}
              {(!professional.languages || professional.languages.length === 0) && <p className="text-slate-500 text-sm">No languages added yet.</p>}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-emerald-400" /> Projects
            </h3>
            <div className="space-y-4">
              {(professional.projects && professional.projects.length > 0) ? (
                professional.projects.map((proj, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                    >
                      <h4 className="font-bold text-white text-sm pr-4 line-clamp-1 flex-1 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        {proj.title}
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedProject === proj.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6" /></svg>
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {expandedProject === proj.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-black/20"
                        >
                          <div className="p-4 pt-0 border-t border-white/5 text-sm text-slate-300 leading-relaxed font-light">
                            <div className="mt-3 relative whitespace-pre-wrap">{proj.description}</div>
                            {proj.link && (
                              <div className="mt-4 flex">
                                <a
                                  href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onPointerDown={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition-colors border border-emerald-500/20"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                  View Project
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
                  <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-slate-500 text-xs">No projects added yet.</p>
                </div>
              )}
            </div>
          </div >
        );

      case 'experience':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-400" /> Experience
            </h3>
            <div className="space-y-4">
              {(professional.experience && professional.experience.length > 0) ? (
                professional.experience.map((exp, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white">{exp.role}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-full">{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-3">
                      <Building2 className="w-3 h-3" /> {exp.company}
                    </div>
                    {exp.description && (
                      <p className="text-slate-400 text-xs leading-relaxed border-t border-white/5 pt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">No experience added yet.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-400" /> Education
            </h3>
            <div className="space-y-4">
              {(professional.education && professional.education.length > 0) ? (
                professional.education.map((edu, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{edu.school}</h4>
                      <p className="text-emerald-400 text-xs font-medium">{edu.degree}</p>
                      <p className="text-slate-500 text-[10px] mt-1">{edu.year}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
                  <GraduationCap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">No education added yet.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'certs':
        return (
          <div className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" /> Certificates
            </h3>
            <div className="space-y-4">
              {(professional.certs && professional.certs.length > 0) ? (
                professional.certs.map((cert, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl relative">
                    <div className="relative w-full h-32 rounded-xl overflow-hidden group mb-3 bg-black/40 border border-white/5">
                      <img src={cert.image} alt="cert" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setZoomedCert(cert.image)}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="px-6 py-2 bg-white/10 hover:bg-emerald-500/90 text-white font-bold text-sm tracking-widest rounded-lg backdrop-blur-md transition-all border border-white/20 hover:border-transparent z-10 block pointer-events-auto"
                        >
                          VIEW
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 break-words">{cert.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
                  <Award className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-slate-500 text-xs">No certificates added yet.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              {/* This renders the icon safely */}
              {TABS[activeTab] && React.createElement(TABS[activeTab].icon, { className: "w-8 h-8 opacity-50" })}
            </div>
            <p className="text-sm font-medium">Coming Soon</p>
          </div>
        );
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
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-white/10 flex flex-col">
        <div className="pt-6 pb-2 text-center bg-gradient-to-b from-black/40 to-transparent flex-none">
          <h3 className="text-emerald-100 font-semibold tracking-wide text-lg"><span className="text-emerald-400">{TABS[activeTab].label}</span> Deck</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tap sides to navigate</p>
        </div>
        {isTop && (<><div className="absolute top-20 bottom-24 left-0 w-[25%] z-20" onClick={() => handleTap('prev')} /><div className="absolute top-20 bottom-24 right-0 w-[25%] z-20" onClick={() => handleTap('next')} /></>)}
        <div className="flex-1 relative z-10 overflow-hidden">
          {renderContent()}
          <AnimatePresence>
            {zoomedCert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-4 flex flex-col pointer-events-auto"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="flex-none flex justify-end mb-2">
                  <button onClick={() => setZoomedCert(null)} className="p-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 rounded-full transition-colors border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 bg-black/40">
                  <motion.img
                    drag
                    dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                    dragElastic={0.2}
                    whileTap={{ scale: 1.5 }}
                    src={zoomedCert}
                    alt="Zoomed"
                    className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing rounded-xl"
                  />
                </div>
                <p className="text-center text-slate-500 text-[10px] mt-3 uppercase tracking-widest flex-none">Drag to move • Tap & hold to zoom</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        <div className="h-16 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden flex-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="w-6 flex-shrink-0" />
          {TABS.map((tab, index) => {
            const isActive = activeTab === index;
            return <button key={tab.id} onClick={(e) => { e.stopPropagation(); setActiveTab(index); }} className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[54px] h-14 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/5'}`}><tab.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} /><span className="text-[9px] font-medium tracking-wide">{tab.label}</span>{isActive && <div className="w-1 h-1 rounded-full bg-white mt-1" />}</button>
          })}
          <div className="w-6 flex-shrink-0" />
        </div>
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 -rotate-12 border-4 border-green-400 rounded-xl px-4 py-2 z-50 bg-black/50 backdrop-blur-md pointer-events-none"><span className="text-green-400 font-bold text-4xl tracking-widest uppercase">HIRE</span></motion.div>
        <motion.div style={{ opacity: passOpacity }} className="absolute top-10 right-10 rotate-12 border-4 border-red-500 rounded-xl px-4 py-2 z-50 bg-black/50 backdrop-blur-md pointer-events-none"><span className="text-red-500 font-bold text-4xl tracking-widest uppercase">PASS</span></motion.div>
      </div>
    </motion.div>
  );
}