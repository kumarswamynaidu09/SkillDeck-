import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowUp, X } from 'lucide-react';

export default function SkillsSlideEditor({ data, onUpdate, bottomNav }) { // <--- Added bottomNav prop
  const skills = data.skills || [];
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('Intermediate');

  const handleAddSkill = () => {
    if (!skillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      alert("Skill already added!");
      return;
    }
    const newSkills = [...skills, { name: skillName, level }];
    onUpdate({ skills: newSkills });
    setSkillName('');
  };

  const handleRemoveSkill = (name) => {
    const newSkills = skills.filter(s => s.name !== name);
    onUpdate({ skills: newSkills });
  };

  const getLevelStyles = (lvl) => {
    if (lvl === 'Advanced') return "bg-emerald-900/60 border-emerald-500/50 text-emerald-100";
    if (lvl === 'Intermediate') return "bg-emerald-500/20 border-emerald-400/30 text-emerald-200";
    return "bg-white/10 border-white/10 text-slate-200";
  };

  return (
    <div className="relative w-full max-w-md h-[68vh] rounded-[2.5rem] bg-black/10 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">
      <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
        <h3 className="text-emerald-100 font-semibold text-lg">Edit <span className="text-emerald-400">Skills</span></h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4">
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-600 border-2 border-dashed border-white/10 rounded-2xl">
            <Zap className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Add your first skill below</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 pb-20">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.div key={skill.name} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={`px-4 py-3 rounded-xl border flex items-center gap-2 ${getLevelStyles(skill.level)}`}>
                  <div className="flex flex-col leading-none">
                    <span className="font-bold text-sm">{skill.name}</span>
                    <span className="text-[9px] uppercase opacity-60">{skill.level}</span>
                  </div>
                  <button onClick={() => handleRemoveSkill(skill.name)}><X className="w-3 h-3 opacity-50 hover:opacity-100" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="bg-transparent border-t border-white/10 p-4 space-y-3 z-20">
        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
          {['Basic', 'Intermediate', 'Advanced'].map(lvl => (
            <button key={lvl} onClick={() => setLevel(lvl)} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${level === lvl ? 'bg-emerald-500 text-black' : 'text-slate-500 hover:text-white'}`}>{lvl}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={skillName} onChange={e => setSkillName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} placeholder="Add skill..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none" />
          <button onClick={handleAddSkill} className="w-12 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-colors">
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* REPLACED SAVE BUTTON WITH NAV BAR */}
      {bottomNav}

    </div>
  );
}