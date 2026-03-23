import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Plus, Trash2, Check, X, ChevronDown } from 'lucide-react';

const YEARS = ['Pursuing', ...Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() + 5 - i).toString())]; // Includes future grad years

// --- HELPER: CUSTOM SELECT ---
const SelectBox = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors focus:outline-none focus:border-emerald-500/50"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors ${value === opt ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-300'}`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function EducationSlideEditor({ data, onUpdate, bottomNav }) {
  const education = data.education || [];
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', year: '' });

  const handleAdd = () => {
    if (!newEdu.school || !newEdu.degree) return alert("School and Degree are required");

    const updated = [...education, { ...newEdu, id: Date.now() }];
    onUpdate({ education: updated });

    setNewEdu({ school: '', degree: '', year: '' });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    onUpdate({ education: education.filter(edu => edu.id !== id) });
  };

  return (
    <div className="relative w-full max-w-md h-[68vh] rounded-[2.5rem] bg-black/10 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
        <h3 className="text-emerald-100 font-semibold text-lg">Edit <span className="text-emerald-400">Education</span></h3>
      </div>

      {/* CONTENT LIST */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20 [&::-webkit-scrollbar]:hidden">

        {/* EMPTY STATE */}
        {!isAdding && education.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-600 border-2 border-dashed border-white/10 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Add your education</p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3">
          <AnimatePresence>
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 border border-white/5 p-4 rounded-xl relative group flex items-start gap-3"
              >
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1">
                  <GraduationCap className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{edu.school}</h4>
                  <p className="text-emerald-400 text-xs font-medium">{edu.degree}</p>
                  <p className="text-slate-500 text-[10px] mt-1">{edu.year === 'Pursuing' ? 'Pursuing' : `Class of ${edu.year}`}</p>
                </div>

                <button
                  onClick={() => handleDelete(edu.id)}
                  className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ADD FORM */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-slate-800/50 border border-emerald-500/30 p-4 rounded-xl space-y-3 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">New School</span>
                <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-slate-500" /></button>
              </div>

              <input
                placeholder="School / University"
                value={newEdu.school}
                onChange={e => setNewEdu({ ...newEdu, school: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
              />
              <input
                placeholder="Degree (e.g. B.S. Computer Science)"
                value={newEdu.degree}
                onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
              />

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Graduation Year:</span>
                <div className="w-32">
                  <SelectBox
                    options={YEARS}
                    value={newEdu.year}
                    onChange={(val) => setNewEdu({ ...newEdu, year: val })}
                    placeholder="Year"
                  />
                </div>
              </div>

              <button onClick={handleAdd} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" /> Add Education
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ADD BUTTON */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 py-3 border border-dashed border-white/20 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        )}
      </div>

      {/* REPLACED SAVE BUTTON WITH NAV BAR */}
      {bottomNav}

    </div>
  );
}