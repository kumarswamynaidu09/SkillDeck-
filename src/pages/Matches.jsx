import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, Users, DollarSign, X, Zap, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// MOCK DATA for Opportunities (Company)
const MOCK_OPPORTUNITIES = [
  { 
    id: '1', 
    companyName: "Google's Team", 
    role: "Senior AI Engineer", 
    location: "Mountain View / Remote", 
    employees: "10k+ Employees",
    salary: "$180k - $250k",
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Google' 
  },
  { 
    id: '2', 
    companyName: "Stripe's Team", 
    role: "Frontend Developer", 
    location: "San Francisco / Hybrid", 
    employees: "1k-5k Employees",
    salary: "$140k - $190k",
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Stripe' 
  },
  { 
    id: '3', 
    companyName: "Vercel's Team", 
    role: "Full Stack Engineer", 
    location: "Remote", 
    employees: "100-500 Employees",
    salary: "$130k - $170k",
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Vercel' 
  },
  { 
    id: '4', 
    companyName: "OpenAI's Team", 
    role: "Machine Learning Researcher", 
    location: "San Francisco", 
    employees: "1k-5k Employees",
    salary: "$250k - $350k",
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=OpenAI' 
  },
];

const MOCK_DETAILS = {
  '1': {
    about: "Google's AI team is redefining how information is organized. We work on cutting-edge LLMs and search integration.",
    techStack: ["React", "Python", "PyTorch", "GCP", "Kubernetes"],
    perks: ["Free Meals", "On-site Gym", "Hybrid Work", "Top-tier Health Insurance"],
    description: "You will lead the development of our next-gen AI interfaces, focusing on performance and user experience at scale."
  },
  '2': {
    about: "Stripe is building the economic infrastructure for the internet. Our team builds the beautifully designed UI components for millions of users.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    perks: ["Remote Friendly", "Learning Stipends", "Great Equity", "Generous PTO"],
    description: "Focusing on Stripe Elements, you'll ensure our payment components are the most reliable and aesthetic on the web."
  },
  '3': {
    about: "Vercel is the platform for frontend developers. We provide the speed and reliability needed to create the best web experiences.",
    techStack: ["Next.js", "React", "Rust", "Edge Functions", "AWS"],
    perks: ["Remote First", "MacBook Pro M3", "Health/Mental Care", "Stock Options"],
    description: "Work directly on the future of the web. You'll be bridging the gap between framework and infrastructure."
  },
  '4': {
    about: "OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity.",
    techStack: ["Python", "C++", "PyTorch", "Azure", "React"],
    perks: ["High Salary", "Daily Dining", "Private Insurance", "Generous Relocation"],
    description: "Design and implement internal tools that enable researchers to interact with and train the world's largest models."
  }
};

const OpportunityDetail = ({ opportunity, onClose }) => {
  const details = MOCK_DETAILS[opportunity.id] || MOCK_DETAILS['1'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col pt-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Header */}
      <div className="relative z-10 px-6 flex justify-between items-center mb-6">
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-6 h-6 text-slate-400" />
        </button>
        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Opportunity details</span>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <Zap className="w-6 h-6 text-emerald-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-12 relative z-10 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {/* Main Card - Deck Style */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 mb-6 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-emerald-500 rounded-[2rem] blur-xl opacity-20" />
              <img src={opportunity.avatar} alt={opportunity.companyName} className="relative w-full h-full rounded-[2rem] border-2 border-white/10 bg-slate-800 object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{opportunity.role}</h2>
            <p className="text-emerald-400 font-bold">{opportunity.companyName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Base Salary</p>
              <p className="text-emerald-300 font-mono font-bold text-sm">{opportunity.salary}</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Location</p>
              <p className="text-slate-300 font-bold text-sm">{opportunity.location.split('/')[0]}</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" /> About Company
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{details.about}</p>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Role Description
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{details.description}</p>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {details.techStack.map(tech => (
                  <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Perks & Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {details.perks.map(perk => (
                  <span key={perk} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {perk}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>


    </motion.div>
  );
};

export default function Matches() {
  const navigate = useNavigate();
  const { user } = useOutletContext() || {};
  const safeUser = user || null;
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  if (!safeUser) return null;

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 relative overflow-hidden font-sans text-white flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* HEADER - Matching the exact SkillDeck home design */}
      <div className="relative pt-4 px-6 pb-4 z-40 flex justify-between items-center max-w-md mx-auto w-full flex-none">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent theme-logo-text">Matches</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Your Opportunities
          </p>
        </div>
        <button onClick={() => navigate('/profile')} className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur group-hover:bg-emerald-500/40 transition-all" />
          <img src={safeUser.avatar_url || "https://github.com/shadcn.png"} alt="Profile" className="w-10 h-10 rounded-full border border-white/20 relative z-10 bg-slate-900 object-cover" />
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto overflow-hidden">
        {/* Search */}
        <div className="px-6 mt-2 mb-6 flex-none">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search opportunities..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 backdrop-blur-md"
            />
          </div>
        </div>

        {/* OPPORTUNITIES (Scrolling List) */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden pb-12" style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col gap-4 px-6 pt-2">
            {MOCK_OPPORTUNITIES.map((opp) => (
              <motion.div 
                key={opp.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOpportunity(opp)}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 cursor-pointer hover:bg-white/5 transition-colors relative shadow-2xl flex flex-col"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative w-20 h-20 mb-1">
                    <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-30" />
                    <img src={opp.avatar} alt={opp.companyName} className="relative w-full h-full rounded-2xl border-2 border-white/10 bg-slate-800 object-cover" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-bold text-white text-xl truncate">{opp.role}</h3>
                    <p className="text-emerald-400 font-bold text-sm truncate mt-1">{opp.companyName}</p>
                    <div className="flex justify-center items-center gap-1.5 text-slate-400 text-xs mt-3">
                      <MapPin className="w-3.5 h-3.5" /> {opp.location}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-slate-300 text-sm font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                    <Users className="w-5 h-5 text-purple-400" /> {opp.employees}
                  </div>
                  <div className="flex items-center gap-3 text-emerald-300 text-sm font-bold font-mono bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <DollarSign className="w-5 h-5" /> {opp.salary}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOpportunity && (
          <OpportunityDetail 
            opportunity={selectedOpportunity} 
            onClose={() => setSelectedOpportunity(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}