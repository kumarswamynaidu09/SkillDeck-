import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Users, Zap, MessageSquare, User } from 'lucide-react';

export default function BottomNav({ user, viewMode, setViewMode, incomingLikes = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  // If we are on the home feed, active tab is determined by the specific viewMode
  // If we are on other pages, it's determined by the URL route.
  const path = location.pathname;
  let activeTab = 'home';
  if (path.includes('/matches')) activeTab = 'matches';
  if (path.includes('/chat')) activeTab = 'chat';
  if (path.includes('/profile')) activeTab = 'profile';

  const isRecruiter = user?.user_type === 'recruiter';

  const handleFeedClick = () => {
    if (path === '/') {
      setViewMode('discover');
    } else {
      navigate('/');
    }
  };

  const handleInterestedClick = () => {
    if (path === '/') {
      setViewMode('applicants');
    } else {
      // Need a way to tell Home to open the applicants view, but for now navigate home
      navigate('/'); 
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-6 py-3 pb-safe max-w-md mx-auto">
        
        {/* Feed / Discover */}
        <button
          onClick={handleFeedClick}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' && viewMode !== 'applicants' ? 'text-emerald-400 transform -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Feed</span>
        </button>

        {/* Interested / Applicants */}
        <button
          onClick={handleInterestedClick}
          className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === 'home' && viewMode === 'applicants' ? 'text-emerald-400 transform -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">
            {isRecruiter ? 'Applicants' : 'Interested'}
          </span>
          {incomingLikes?.length > 0 && viewMode !== 'applicants' && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          )}
        </button>

        {/* Matches */}
        <button
          onClick={() => navigate('/matches')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'matches' ? 'text-emerald-400 transform -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Matches</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => navigate('/chat')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'chat' ? 'text-emerald-400 transform -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Chat</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-emerald-400 transform -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Profile</span>
        </button>

      </div>
    </div>
  );
}