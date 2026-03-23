import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/MegaComponents';

export default function CardDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const professional = location.state?.professional;

  if (!professional) return null;

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Full Screen Image */}
      <div className="h-[50vh] relative">
        <img 
          src={professional.avatar_url} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="px-6 -mt-12 relative z-10 pb-24">
        <h1 className="text-3xl font-bold mb-1">{professional.full_name}</h1>
        <p className="text-xl text-blue-400 font-medium mb-4">{professional.title}</p>
        
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
          <div className="flex items-center gap-1">
             <Briefcase className="w-4 h-4" /> {professional.experience_years}y Exp
          </div>
          <div className="flex items-center gap-1">
             <MapPin className="w-4 h-4" /> {professional.location}
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">About</h3>
            <p className="text-gray-300 leading-relaxed">{professional.bio}</p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {professional.skills?.map(skill => (
                <span key={skill} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <Button className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-lg rounded-2xl shadow-xl shadow-blue-900/20">
          Match Now
        </Button>
      </div>
    </div>
  );
}