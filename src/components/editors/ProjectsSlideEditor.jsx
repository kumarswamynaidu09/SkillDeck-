import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Plus, Trash2, X, Link as LinkIcon } from 'lucide-react';

export default function ProjectsSlideEditor({ data, onUpdate, bottomNav }) {
    const projects = data.projects || [];
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newProject, setNewProject] = useState({ title: '', link: '', description: '' });

    const handleAdd = () => {
        if (!newProject.title || !newProject.description) return alert("Title and Description are required");
        if (newProject.title.length > 50) return alert("Title must be 50 characters or less");
        if (newProject.description.length > 700) return alert("Description must be 700 characters or less");

        const updated = [...projects, { ...newProject, id: Date.now() }];
        onUpdate({ projects: updated });

        setNewProject({ title: '', link: '', description: '' });
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        onUpdate({ projects: projects.filter(p => p.id !== id) });
    };

    return (
        <div className="relative w-full max-w-md h-[68vh] rounded-[2.5rem] bg-black/10 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
                <h3 className="text-emerald-100 font-semibold text-lg">Edit <span className="text-emerald-400">Projects</span></h3>
            </div>

            {/* CONTENT LIST */}
            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20 [&::-webkit-scrollbar]:hidden">

                {/* EMPTY STATE */}
                {!isAdding && projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-600 border-2 border-dashed border-white/10 rounded-2xl mb-4">
                        <FolderGit2 className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs">Add your featured projects</p>
                    </div>
                )}

                {/* LIST */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {projects.map((proj) => (
                            <motion.div
                                key={proj.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 border border-white/5 p-4 rounded-xl relative group flex flex-col gap-2"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1 flex-shrink-0">
                                        <FolderGit2 className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm pr-6 leading-tight mb-1">{proj.title}</h4>
                                        {proj.link && (
                                            <div className="flex items-center gap-1 text-emerald-400 text-[10px] mb-2">
                                                <LinkIcon className="w-3 h-3" />
                                                <span className="truncate max-w-[200px]">{proj.link}</span>
                                            </div>
                                        )}
                                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{proj.description}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(proj.id)}
                                    className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors p-1 bg-slate-900/80 rounded-full"
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
                                <span className="text-xs font-bold text-emerald-400 uppercase">New Project</span>
                                <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-slate-500" /></button>
                            </div>

                            <div className="relative">
                                <input
                                    placeholder="Project Title (max 50 chars)"
                                    value={newProject.title}
                                    onChange={e => { if (e.target.value.length <= 50) setNewProject({ ...newProject, title: e.target.value }) }}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                                />
                                <span className="absolute right-2 top-2 text-[10px] text-slate-500">{newProject.title.length}/50</span>
                            </div>

                            <div className="relative">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500">
                                    <LinkIcon className="w-4 h-4" />
                                </div>
                                <input
                                    placeholder="Project Link (e.g. https://github.com/...)"
                                    value={newProject.link}
                                    onChange={e => setNewProject({ ...newProject, link: e.target.value })}
                                    className="w-full pl-8 bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                                />
                            </div>

                            <div className="relative">
                                <textarea
                                    placeholder="Describe your project (max 700 chars)..."
                                    value={newProject.description}
                                    onChange={e => { if (e.target.value.length <= 700) setNewProject({ ...newProject, description: e.target.value }) }}
                                    rows={4}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none resize-none"
                                />
                                <span className="absolute bottom-2 right-2 text-[10px] text-slate-500">{newProject.description.length}/700</span>
                            </div>

                            <button onClick={handleAdd} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2">
                                <Plus className="w-3 h-3" /> Save Project
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
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                )}
            </div>

            {bottomNav}
        </div>
    );
}
