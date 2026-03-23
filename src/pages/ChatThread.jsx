import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Phone, Video, Info, Camera, Mic, Image as ImageIcon, Send, Smile } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// --- MOCK DATA MAP ---
const THREADS_DATA = {
  'c1': {
    name: "Sarah Jenkins",
    role: "Senior React Developer · Vercel",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    messages: [
      { id: '1', sender: 'them', text: "Hey! Thanks for connecting.", time: "10:00 AM" },
      { id: '2', sender: 'me', text: "Of course! I saw your recent project, it looks amazing.", time: "10:05 AM" },
      { id: '3', sender: 'them', text: "Thank you so much! We are actually looking for someone with your React experience to join the team.", time: "10:12 AM" },
      { id: '4', sender: 'them', text: "Would you be open to a quick chat sometime this week?", time: "10:13 AM" },
    ]
  },
  'c2': {
    name: "Alex Chen",
    role: "Engineering Manager · Stripe",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    messages: [
      { id: '1', sender: 'them', text: "Saw your profile on SkillDeck. Impressive stack!", time: "Yesterday" },
      { id: '2', sender: 'me', text: "Thanks Alex! Stripe is doing some cool things with Elements lately.", time: "Yesterday" },
      { id: '3', sender: 'them', text: "Exactly! We're scaling the team. Interested in a coffee chat?", time: "Yesterday" },
    ]
  },
  'c3': {
    name: "Emily Clark",
    role: "Product Designer · Airbnb",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    messages: [
      { id: '1', sender: 'them', text: "Hey there! Love your portfolio.", time: "Monday" },
      { id: '2', sender: 'me', text: "Thanks Emily! Big fan of Airbnb's design system.", time: "Monday" },
      { id: '3', sender: 'them', text: "It's a lot of work but worth it! Are you looking for new opportunities?", time: "Tuesday" },
    ]
  },
  'c4': {
    name: "InnovateHub",
    role: "Recruitment Team · Tech Startup",
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Innovate',
    messages: [
      { id: '1', sender: 'them', text: "Hello! We'd love to chat about our Lead Dev role.", time: "2 days ago" },
      { id: '2', sender: 'me', text: "Hi! Tell me more about the technical challenges.", time: "Yesterday" },
      { id: '3', sender: 'them', text: "We're building a distributed system from scratch...", time: "Yesterday" },
    ]
  }
};

export default function ChatThread() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  // Select data based on ID (fallback to c1 if not found)
  const threadInfo = THREADS_DATA[id] || THREADS_DATA['c1'];
  
  // Chat State
  const [messages, setMessages] = useState(threadInfo.messages);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => navigate('/login'));
  }, [navigate]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  if (!user) return null;

  return (
    <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden font-sans text-white">
      
      {/* HEADER - Fixed Top */}
      <div className="flex-none bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 pb-safe flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <img src={threadInfo.avatar} alt="Match" className="w-8 h-8 rounded-full border border-white/10 bg-slate-800" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] leading-tight">{threadInfo.name}</span>
              <span className="text-[11px] text-slate-400 font-medium">Active now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-300">
          <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
          <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Video className="w-6 h-6" /></button>
        </div>
      </div>

      {/* MESSAGE LIST - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-slate-950 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        
        {/* Profile Intro Area */}
        <div className="flex flex-col items-center justify-center my-8 gap-3">
          <img src={threadInfo.avatar} className="w-24 h-24 rounded-full border border-white/10 bg-slate-800 object-cover" />
          <h2 className="text-xl font-bold">{threadInfo.name}</h2>
          <p className="text-sm text-slate-400">{threadInfo.role}</p>
          <button className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold mt-2">View Profile</button>
        </div>

        {/* The Messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMe = msg.sender === 'me';
            const showTime = index === 0 || messages[index - 1].sender !== msg.sender;

            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex flex-col w-full max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'} mb-1`}
              >
                {showTime && (
                  <span className="text-[10px] text-slate-500 font-medium mb-1 mt-3 px-1">{msg.time}</span>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                    ${isMe 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 rounded-br-sm' 
                      : 'bg-[#262626] border border-white/5 text-slate-100 rounded-bl-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR - Fixed Bottom */}
      <div className="flex-none bg-slate-950 px-3 py-3 pb-safe border-t border-white/5">
        <div className="flex items-end gap-2 bg-[#262626] rounded-[24px] p-1.5 border border-white/10">
          
          <button className="p-2.5 text-slate-300 hover:text-white bg-blue-500 rounded-full flex-shrink-0">
            <Camera className="w-5 h-5 text-white" />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none text-[15px] text-white placeholder:text-slate-500 resize-none py-2.5 px-2 focus:outline-none max-h-32 min-h-[44px]"
            rows={1}
            style={{ fieldSizing: "content" }}
          />

          <div className="flex items-center gap-1 pb-1">
            {!inputText.trim() ? (
              <>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><Mic className="w-6 h-6" /></button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><ImageIcon className="w-6 h-6" /></button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><Smile className="w-6 h-6" /></button>
              </>
            ) : (
              <button 
                onClick={handleSend}
                className="p-2 bg-emerald-500 text-slate-950 rounded-full hover:bg-emerald-400 transition-colors mr-1"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
