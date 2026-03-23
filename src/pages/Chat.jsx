import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Video, Phone, Check, CheckCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// MOCK DATA
const MATCHES = [
  { id: '1', name: "Sarah", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', hasStory: true },
  { id: '2', name: "Alex", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', hasStory: false },
  { id: '3', name: "Michael", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', hasStory: true },
  { id: '4', name: "Emily", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', hasStory: false },
  { id: '5', name: "David", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', hasStory: true },
  { id: '6', name: "Jessica", avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', hasStory: false },
];

const CHATS = [
  { 
    id: 'c1', 
    name: "Sarah Jenkins", 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: "I see you have experience with React? We are looking for someone like you.",
    time: "2m",
    unread: 2,
    online: true,
    isReplying: false
  },
  { 
    id: 'c2', 
    name: "Alex Chen", 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    lastMessage: "Sounds great! Let's schedule a call.",
    time: "1h",
    unread: 0,
    online: true,
    isReplying: true
  },
  { 
    id: 'c3', 
    name: "Emily Clark", 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    lastMessage: "Thanks for connecting. Here is my portfolio link.",
    time: "3h",
    unread: 0,
    online: false,
    isReplying: false
  },
  { 
    id: 'c4', 
    name: "InnovateHub", 
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Innovate',
    lastMessage: "We'd love to invite you for an on-site interview.",
    time: "Yesterday",
    unread: 0,
    online: false,
    isReplying: false
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then(u => setUser(u))
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col relative overflow-hidden font-sans text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* HEADER */}
      <div className="relative pt-4 px-6 pb-2 z-40 flex justify-between items-center max-w-md mx-auto w-full flex-none">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent theme-logo-text">Messages</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Start a Conversation
          </p>
        </div>
        <button onClick={() => navigate('/profile')} className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur group-hover:bg-emerald-500/40 transition-all" />
          <img src={user.avatar_url || "https://github.com/shadcn.png"} alt="Profile" className="w-10 h-10 rounded-full border border-white/20 relative z-10 bg-slate-900 object-cover" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto overflow-hidden">
        {/* Search */}
        <div className="px-6 mt-2 mb-4 flex-none">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-500 absolute left-4" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 backdrop-blur-md"
            />
          </div>
        </div>

        {/* HORIZONTAL MATCHES */}
        <div className="flex-none mb-2">
          <div className="flex overflow-x-auto gap-4 px-6 pb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {MATCHES.map((match) => (
              <motion.div 
                key={match.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/chat/${match.id}`)}
                className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
              >
                <div className={`relative p-[2px] rounded-full ${match.hasStory ? 'bg-gradient-to-tr from-emerald-400 to-green-300' : 'bg-transparent'}`}>
                  <div className="bg-slate-900 rounded-full p-[2px]">
                    <img src={match.avatar} alt={match.name} className="w-14 h-14 rounded-full border border-white/10 object-cover bg-slate-800" />
                  </div>
                </div>
                <span className="text-xs text-slate-300 font-medium">{match.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CHAT THREADS LIST */}
        <div className="flex-1 overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col px-4 gap-2">
            {CHATS.map((chat) => (
              <motion.div 
                key={chat.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="w-full flex items-center gap-4 p-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors relative"
              >
                {/* Avatar with Status */}
                <div className="relative flex-shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full border border-white/10 object-cover bg-slate-800" />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  )}
                </div>
                
                {/* Message Details */}
                <div className="flex-1 min-w-0 pr-4 border-b border-white/5 pb-3">
                  <div className="flex justify-between items-end mb-1">
                    <h3 className={`font-bold truncate text-[15px] ${chat.unread ? 'text-white' : 'text-slate-200'}`}>
                      {chat.name}
                    </h3>
                    <span className={`text-[11px] flex-shrink-0 font-medium ${chat.unread ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {chat.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {chat.isReplying ? (
                      <p className="text-[13px] text-emerald-400 font-medium italic animate-pulse">
                        typing...
                      </p>
                    ) : (
                      <p className={`text-[13px] truncate pr-4 ${chat.unread ? 'text-slate-300 font-semibold' : 'text-slate-500'}`}>
                        {chat.lastMessage}
                      </p>
                    )}
                    
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-bold flex-shrink-0">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}