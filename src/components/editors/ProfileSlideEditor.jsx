import React, { useRef, useState } from 'react';
import { MapPin, Camera, Pencil, Loader2 } from 'lucide-react';

export default function ProfileSlideEditor({ data, onUpdate, bottomNav }) { // <--- Added bottomNav prop
  const [previewUrl, setPreviewUrl] = useState(data.avatar_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Check max size (e.g., 1MB for base64) to avoid breaking Firestore document limits
      if (file.size > 1 * 1024 * 1024) {
        onUpdate({ _error: "Image is too large (max 1MB for direct saving)." });
        // Revert preview
        setPreviewUrl(data.avatar_url || '');
        return;
      }

      setIsUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // Update both the preview and the parent component data
        setPreviewUrl(base64String);
        onUpdate({ avatar_url: base64String });
        setIsUploading(false);
      };

      reader.onerror = () => {
        onUpdate({ _error: "Failed to read image file." });
        setIsUploading(false);
        setPreviewUrl(data.avatar_url || '');
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full max-w-md h-[68vh] rounded-[2.5rem] bg-black/10 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">

      <div className="pt-6 pb-2 text-center bg-transparent flex-none z-20 border-b border-white/10">
        <h3 className="text-emerald-100 font-semibold text-lg">Edit <span className="text-emerald-400">Profile</span></h3>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col items-center text-center space-y-6">

          <div className="relative group cursor-pointer" onClick={() => !isUploading && fileInputRef.current.click()}>
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            {previewUrl ? (
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl group-hover:border-emerald-500/50">
                <img src={previewUrl} className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : ''}`} />
                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Uploading</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-36 h-36 rounded-2xl border-4 border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-400 group-hover:border-emerald-500/50">
                {isUploading ? (
                  <>
                    <Loader2 className="w-10 h-10 mb-2 opacity-70 animate-spin text-emerald-400" />
                    <span className="text-xs font-bold uppercase text-emerald-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 mb-2 opacity-70" />
                    <span className="text-xs font-bold uppercase">Upload</span>
                  </>
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading} />
          </div>

          <div className="space-y-3 w-full">
            <input type="text" name="full_name" value={data.full_name || ''} onChange={handleChange} placeholder="Full Name" className="text-3xl font-bold text-white bg-transparent text-center w-full focus:outline-none border-b border-emerald-500/50 pb-1" />
            <div className="relative max-w-[80%] mx-auto">
              <input type="text" name="title" value={data.title || ''} onChange={handleChange} placeholder="Job Title" className="text-emerald-400 font-medium text-lg bg-transparent text-center w-full focus:outline-none border-b border-emerald-500/50 pb-1" />
              <Pencil className="absolute right-0 top-1 w-4 h-4 text-emerald-400 opacity-50" />
            </div>
            <div className="relative max-w-[70%] mx-auto flex items-center gap-2 text-slate-400">
              <MapPin className="w-3 h-3" />
              <input type="text" name="location" value={data.location || ''} onChange={handleChange} placeholder="City, Country" className="bg-transparent text-center w-full text-sm focus:outline-none border-b border-slate-500/50 pb-1" />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-left text-xs font-bold text-slate-500 uppercase mb-2 ml-2">Needs & Expectations</label>
            <textarea name="bio" value={data.bio || ''} onChange={handleChange} rows={4} placeholder="Describe your expectations..." className="w-full bg-white/5 rounded-xl border border-white/5 p-3 text-slate-300 text-sm focus:outline-none focus:bg-white/10" />
          </div>
        </div>
      </div>

      {/* REPLACED SAVE BUTTON WITH NAV BAR */}
      {bottomNav}

    </div>
  );
}