import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function MainLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('discover');
  const [incomingLikes, setIncomingLikes] = useState([]);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {
        // Redirect to login if not authenticated or profile not found
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const incomingQ = query(
      collection(db, "swipes"),
      where("to", "==", user.id),
      where("type", "==", "like")
    );
    const unsubscribe = onSnapshot(incomingQ, (snap) => {
      setIncomingLikes(snap.docs.map(doc => doc.data().from));
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950">
      {/* Route Content Area (Flex-1 allows it to take all remaining space) */}
      <div className="flex-1 w-full min-h-0 relative z-0">
        <Outlet context={{ user, viewMode, setViewMode, incomingLikes }} />
      </div>

      {/* Persistent Global Navigation */}
      <div className="flex-none w-full z-50 bg-slate-900/40 backdrop-blur-3xl border-t border-white/5">
        <BottomNav 
          user={user} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          incomingLikes={incomingLikes} 
        />
      </div>
    </div>
  );
}
