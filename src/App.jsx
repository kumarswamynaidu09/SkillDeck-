import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- EXISTING IMPORTS ---
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import ChatThread from './pages/ChatThread';
import MainLayout from './components/layout/MainLayout';

// --- NEW IMPORT (YOU MISSED THIS) ---
import DeckEditorLayout from './pages/DeckEditorLayout'; 
import OnboardingWizard from './pages/OnboardingWizard';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function App() {
  // Global theme and font size initialization
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedFontSize = localStorage.getItem('fontSize') || 'base';

    if (savedTheme !== 'dark') {
      root.classList.add(`theme-${savedTheme}`);
    }

    const sizeMap = {
      'small': '14px',
      'base': '16px',
      'large': '18px',
      'xlarge': '20px'
    };
    root.style.fontSize = sizeMap[savedFontSize];
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Main App (Wrapped in layout with persistent bottom nav) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          {/* --- NEW ROUTE (YOU MISSED THIS) --- */}
          <Route path="/deck-editor" element={<DeckEditorLayout />} />
          <Route path="/onboarding-wizard" element={<OnboardingWizard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Chat Thread - Outside MainLayout to hide bottom nav */}
          <Route path="/chat/:id" element={<ChatThread />} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;