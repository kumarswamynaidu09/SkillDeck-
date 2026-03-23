import React, { useState, useRef } from 'react';
import { Building2, MapPin, DollarSign, Camera, Pencil, Users } from 'lucide-react';

export default function CompanySlideEditor({ initialData, onSave }) {
  // DEBUG: Check what data we are getting
  console.log("Company Editor Data:", initialData);

  const [formData, setFormData] = useState({
    avatar_url: initialData?.avatar_url || '',
    full_name: initialData?.full_name || '', // This acts as Company Name
    title: initialData?.title || '', // This acts as Job Title
    location: initialData?.location || '',
    salary: initialData?.salary || '', // New field for Recruiters
    bio: initialData?.bio || '' // Acts as Job Description
  });

  const [previewUrl, setPreviewUrl] = useState(initialData?.avatar_url);
  const fileInputRef = useRef(null);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Note: In a real app, upload 'file' to Firebase Storage here
    }
  };

  return (
    <div className="relative w-full max-w-md h-full max-h-[68vh] rounded-[2.5rem] overflow-hidden bg-black/10 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col">

      {/* HEADER */}
      <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
        <h3 className="text-purple-100 font-semibold tracking-wide text-lg">
          Edit <span className="text-purple-400">Company & Job</span>
        </h3>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col items-center text-center space-y-6">

          {/* 1. COMPANY LOGO */}
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

            {previewUrl ? (
              <img
                src={previewUrl}
                className="relative w-36 h-36 rounded-2xl object-cover border-4 border-white/10 shadow-2xl group-hover:border-purple-500/50 transition-colors bg-slate-800"
                alt="Logo"
              />
            ) : (
              <div className="relative w-36 h-36 rounded-2xl border-4 border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-400 group-hover:border-purple-500/50 group-hover:text-purple-300 transition-all">
                <Building2 className="w-10 h-10 mb-2 opacity-70" />
                <span className="text-xs font-bold uppercase tracking-wide">Upload Logo</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* 2. COMPANY DETAILS */}
          <div className="space-y-3 w-full">
            {/* Company Name */}
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Company Name"
              className="text-3xl font-bold text-white tracking-tight bg-transparent text-center w-full focus:outline-none focus:border-b border-purple-500/50 pb-1 placeholder:text-slate-600"
            />

            {/* Location */}
            <div className="relative flex items-center justify-center gap-1.5 text-slate-400 text-sm max-w-[70%] mx-auto">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="HQ Location (e.g. Remote)"
                className="bg-transparent text-center w-full focus:outline-none focus:text-white focus:border-b border-slate-500/50 pb-1 placeholder:text-slate-600"
              />
              <Pencil className="absolute right-0 w-3 h-3 text-slate-400 opacity-50 pointer-events-none" />
            </div>
          </div>

          {/* 3. JOB DETAILS CARD */}
          <div className="w-full bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">The Role</span>
            </div>

            {/* Job Title */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title (e.g. Senior React Dev)"
              className="w-full bg-transparent text-lg font-bold text-white placeholder:text-slate-500 focus:outline-none border-b border-white/10 pb-1"
            />

            {/* Salary Range */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary (e.g. $100k - $150k)"
                className="w-full bg-transparent text-sm font-mono text-emerald-300 placeholder:text-emerald-500/40 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. DESCRIPTION */}
          <div className="w-full">
            <label className="block text-left text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-2">
              Job Description
            </label>
            <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5 focus-within:border-purple-500/30 focus-within:bg-white/10 transition-all">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the role, the team culture, and what you are building..."
                className="w-full bg-transparent text-slate-300 text-sm leading-relaxed resize-none focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

        </div>
      </div>

      {/* SAVE BUTTON (Sticky) */}
      <div className="p-4 bg-transparent border-t border-white/10 z-20">
        <button
          onClick={() => onSave(formData)}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 active:scale-95 transition-all"
        >
          Save Company Profile
        </button>
      </div>

    </div>
  );
}