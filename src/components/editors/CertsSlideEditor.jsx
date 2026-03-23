import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Plus, Trash2, X, Camera } from 'lucide-react';

export default function CertsSlideEditor({ data, onUpdate, bottomNav }) {
    const certs = data.certs || [];
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newCert, setNewCert] = useState({ image: '', description: '' });
    const fileInputRef = useRef(null);

    const handleAdd = () => {
        if (!newCert.image || !newCert.description) return alert("Image and Description are required");
        if (newCert.description.length > 100) return alert("Description must be 100 characters or less");

        const updated = [...certs, { ...newCert, id: Date.now() }];
        onUpdate({ certs: updated });

        setNewCert({ image: '', description: '' });
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        onUpdate({ certs: certs.filter(c => c.id !== id) });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCert({ ...newCert, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative w-full max-w-md h-[68vh] rounded-[2.5rem] bg-black/10 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
                <h3 className="text-emerald-100 font-semibold text-lg">Edit <span className="text-emerald-400">Certs</span></h3>
            </div>

            {/* CONTENT LIST */}
            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20 [&::-webkit-scrollbar]:hidden">

                {/* EMPTY STATE */}
                {!isAdding && certs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-600 border-2 border-dashed border-white/10 rounded-2xl mb-4">
                        <Award className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs">Add your certificates</p>
                    </div>
                )}

                {/* LIST */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {certs.map((cert) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 border border-white/5 p-4 rounded-xl relative group flex flex-col gap-3"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-12 bg-black/50 rounded flex-shrink-0 overflow-hidden border border-white/10 relative">
                                        <img src={cert.image} alt="cert" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-300 text-xs leading-relaxed break-words">{cert.description}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(cert.id)}
                                    className="absolute top-2 right-2 text-slate-600 hover:text-red-400 transition-colors p-1 bg-slate-900/80 rounded-full"
                                >
                                    <Trash2 className="w-3 h-3" />
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
                                <span className="text-xs font-bold text-emerald-400 uppercase">New Certificate</span>
                                <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-slate-500" /></button>
                            </div>

                            <div className="relative group cursor-pointer border-2 border-dashed border-white/20 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors bg-black/20" onClick={() => fileInputRef.current.click()}>
                                {newCert.image ? (
                                    <div className="relative h-32 w-full">
                                        <img src={newCert.image} className="w-full h-full object-contain bg-black/50" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-bold">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-32 flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-400">
                                        <Camera className="w-8 h-8 mb-2 opacity-70" />
                                        <span className="text-xs font-bold uppercase">Upload Certificate Image</span>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>

                            <div className="relative">
                                <textarea
                                    placeholder="Short description (max 100 chars)..."
                                    value={newCert.description}
                                    onChange={e => { if (e.target.value.length <= 100) setNewCert({ ...newCert, description: e.target.value }) }}
                                    rows={2}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none resize-none"
                                />
                                <span className="absolute bottom-2 right-2 text-[10px] text-slate-500">{newCert.description.length}/100</span>
                            </div>

                            <button onClick={handleAdd} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2">
                                <Plus className="w-3 h-3" /> Save Certificate
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
                        <Plus className="w-4 h-4" /> Add Certificate
                    </button>
                )}
            </div>

            {bottomNav}
        </div>
    );
}
