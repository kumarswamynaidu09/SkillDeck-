import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, Plus, Trash2, Check, X, ChevronDown, Clock } from 'lucide-react';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() - i).toString());

// --- HELPER: CUSTOM SELECT ---
const SelectBox = ({ value, options, onChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
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

// --- HELPER: DATE PARSING ---
const parseDate = (dateStr) => {
  if (!dateStr || dateStr === 'Present') return new Date();
  const [month, year] = dateStr.split(' ');
  const monthIdx = MONTHS.indexOf(month);
  if (monthIdx === -1) return new Date();
  return new Date(parseInt(year), monthIdx);
};

// --- HELPER: CALCULATE TIME DIFFERENCE ---
const calculateDuration = (durationStr) => {
  if (!durationStr) return "";
  const [start, end] = durationStr.split(' - ');
  if (!start || !end) return "";

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();

  if (months <= 0) return "Less than a month";

  const yrs = Math.floor(months / 12);
  const mos = months % 12;

  const parts = [];
  if (yrs > 0) parts.push(`${yrs}yr${yrs > 1 ? 's' : ''}`);
  if (mos > 0) parts.push(`${mos}mo${mos > 1 ? 's' : ''}`);

  return parts.join(' ');
};

export default function ExperienceSlideEditor({ data, onUpdate, bottomNav }) {
  const experiences = useMemo(() => data.experience || [], [data.experience]);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newJob, setNewJob] = useState({ company: '', role: '', description: '' });
  const [isCurrentRole, setIsCurrentRole] = useState(false);
  const [dateSelection, setDateSelection] = useState({
    startMonth: 'Jan', startYear: new Date().getFullYear().toString(),
    endMonth: 'Jan', endYear: new Date().getFullYear().toString()
  });

  // --- 1. SMART SORTING & OVERLAP DETECTION ---
  const timelineData = useMemo(() => {
    // A. Sort: Newest (Top) to Oldest (Bottom)
    const sorted = [...experiences].sort((a, b) => {
      const [, endA] = a.duration.split(' - ');
      const [, endB] = b.duration.split(' - ');
      return parseDate(endB) - parseDate(endA);
    });

    // B. Detect Overlaps & Calculate Duration
    return sorted.map((job, index) => {
      const nextJob = sorted[index + 1];
      let isSimultaneous = false;

      if (nextJob) {
        const [currentStart] = job.duration.split(' - ');
        const [, nextEnd] = nextJob.duration.split(' - ');

        const currentStartDate = parseDate(currentStart);
        const nextEndDate = parseDate(nextEnd);

        if (nextEndDate > currentStartDate) {
          isSimultaneous = true;
        }
      }

      // Calculate string like "2yrs 3mos"
      const timeDiff = calculateDuration(job.duration);

      return { ...job, isSimultaneous, timeDiff };
    });
  }, [experiences]);

  const handleAdd = () => {
    if (!newJob.company || !newJob.role) return alert("Company and Role are required");
    const startStr = `${dateSelection.startMonth} ${dateSelection.startYear}`;
    const endStr = isCurrentRole ? "Present" : `${dateSelection.endMonth} ${dateSelection.endYear}`;
    const formattedDuration = `${startStr} - ${endStr}`;

    const updated = [...experiences, { ...newJob, duration: formattedDuration, id: Date.now() }];
    onUpdate({ experience: updated });

    // Reset
    setNewJob({ company: '', role: '', description: '' });
    setDateSelection({ startMonth: 'Jan', startYear: new Date().getFullYear().toString(), endMonth: 'Jan', endYear: new Date().getFullYear().toString() });
    setIsCurrentRole(false);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    onUpdate({ experience: experiences.filter(exp => exp.id !== id) });
  };

  return (
    <div className="relative w-full max-w-md h-[68vh] rounded-[2.5rem] bg-black/10 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
        <h3 className="text-emerald-100 font-semibold text-lg">Edit <span className="text-emerald-400">Experience</span></h3>
      </div>

      {/* CONTENT LIST */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20 [&::-webkit-scrollbar]:hidden">

        {/* EMPTY STATE */}
        {!isAdding && experiences.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-600 border-2 border-dashed border-white/10 rounded-2xl mb-4">
            <Briefcase className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Start your timeline</p>
          </div>
        )}

        {/* TIMELINE VIEW */}
        <div className="relative pl-4 space-y-0">
          <AnimatePresence>
            {timelineData.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative pb-8 pl-8 last:pb-0"
              >
                {/* --- THE FLOW LINE --- */}
                {index !== timelineData.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-6 bottom-0 w-0.5 z-0 transition-colors duration-500 
                      ${exp.isSimultaneous
                        ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : 'bg-white/10'
                      }`}
                  />
                )}

                {/* --- THE DOT --- */}
                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center transition-colors duration-500
                    ${exp.isSimultaneous ? 'bg-purple-500' : 'bg-emerald-500'}`}
                >
                  {exp.isSimultaneous && <Clock className="w-3 h-3 text-white animate-pulse" />}
                </div>

                {/* --- THE CARD --- */}
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl relative group hover:bg-white/[0.07] transition-colors">
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                    <Building2 className="w-3 h-3" /> {exp.company}
                  </div>

                  {/* Duration Badge with Calculation */}
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-mono mb-2 
                    ${exp.isSimultaneous ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}>
                    <span>{exp.duration}</span>

                    {/* The new "Time Difference" Pill */}
                    {exp.timeDiff && (
                      <span className={`opacity-60 pl-2 border-l ${exp.isSimultaneous ? 'border-purple-500/30' : 'border-white/10'}`}>
                        {exp.timeDiff}
                      </span>
                    )}

                    {exp.isSimultaneous && <span className="ml-1 font-bold text-purple-400 flex items-center gap-1">• Simultaneous</span>}
                  </div>

                  {exp.description && (
                    <p className="text-slate-300 text-xs leading-snug border-t border-white/5 pt-2 mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ADD FORM */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-slate-800/50 border border-emerald-500/30 p-4 rounded-xl space-y-3 overflow-hidden relative z-20"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">New Experience</span>
                <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-slate-500" /></button>
              </div>

              <input placeholder="Company Name" value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none" />
              <input placeholder="Role / Job Title" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none" />

              {/* DATES */}
              <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-10">From:</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <SelectBox options={MONTHS} value={dateSelection.startMonth} onChange={(val) => setDateSelection(prev => ({ ...prev, startMonth: val }))} />
                    <SelectBox options={YEARS} value={dateSelection.startYear} onChange={(val) => setDateSelection(prev => ({ ...prev, startYear: val }))} />
                  </div>
                </div>
                <div className={`flex items-center gap-2 transition-opacity ${isCurrentRole ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <span className="text-xs text-slate-400 w-10">To:</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <SelectBox options={MONTHS} value={dateSelection.endMonth} onChange={(val) => setDateSelection(prev => ({ ...prev, endMonth: val }))} disabled={isCurrentRole} />
                    <SelectBox options={YEARS} value={dateSelection.endYear} onChange={(val) => setDateSelection(prev => ({ ...prev, endYear: val }))} disabled={isCurrentRole} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isCurrentRole ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 group-hover:border-emerald-400'}`}>
                    {isCurrentRole && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <input type="checkbox" checked={isCurrentRole} onChange={(e) => setIsCurrentRole(e.target.checked)} className="hidden" />
                  <span className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">I currently work here</span>
                </label>
              </div>

              <textarea placeholder="Description..." rows={3} value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none resize-none" />
              <button onClick={handleAdd} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" /> Add Experience
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="w-full mt-8 py-3 border border-dashed border-white/20 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        )}
      </div>

      {/* REPLACED SAVE BUTTON WITH NAV BAR */}
      {bottomNav}

    </div>
  );
}