import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Vote, MessageSquare, MapPin, CheckCircle, Award, Sun, Moon, Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages (to be implemented)
const Home = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
    <h1 className="text-5xl font-bold mb-6 text-navy-chakra">Empowering Every Indian Voter</h1>
    <p className="text-xl mb-8 max-w-2xl mx-auto">Your comprehensive guide to the world's largest democratic exercise. Personalized, accessible, and AI-powered.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link to="/journey" className="glass p-6 rounded-2xl hover:border-saffron transition-all group">
        <Vote className="w-12 h-12 text-saffron mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-bold mb-2">My Election Journey</h3>
        <p className="text-slate-500">Track your registration and preparation steps.</p>
      </Link>
      <Link to="/chat" className="glass p-6 rounded-2xl hover:border-saffron transition-all group">
        <MessageSquare className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
        <p className="text-slate-500">Ask anything about the voting process in 22 languages.</p>
      </Link>
      <Link to="/booth" className="glass p-6 rounded-2xl hover:border-saffron transition-all group">
        <MapPin className="w-12 h-12 text-green-election mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-bold mb-2">Polling Booth</h3>
        <p className="text-slate-500">Find your booth and get directions.</p>
      </Link>
      <Link to="/quiz" className="glass p-6 rounded-2xl hover:border-saffron transition-all group">
        <Award className="w-12 h-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-bold mb-2">Knowledge Quiz</h3>
        <p className="text-slate-500">Test your election IQ and earn badges.</p>
      </Link>
      <Link to="/checklist" className="glass p-6 rounded-2xl hover:border-saffron transition-all group">
        <CheckCircle className="w-12 h-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-bold mb-2">Voter Checklist</h3>
        <p className="text-slate-500">Everything you need for polling day.</p>
      </Link>
    </div>
  </motion.div>
);

import { useAuth } from './context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = ({ toggleDarkMode, isDark, toggleHighContrast }) => {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-white/20 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center text-white font-bold">EG</div>
        <span className="text-2xl font-bold tracking-tight text-navy-chakra dark:text-white">Electra<span className="text-saffron">Guide</span></span>
      </Link>
      <div className="flex items-center gap-4">
        <button onClick={toggleHighContrast} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="High Contrast Mode">
          <Accessibility className="w-5 h-5" />
        </button>
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL} alt={user.displayName} className="w-9 h-9 rounded-full border-2 border-saffron" />
            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button onClick={loginWithGoogle} className="btn-primary py-2 px-4 text-sm">Sign In</button>
        )}
      </div>
    </nav>
  );
};

import ChatPage from './pages/ChatPage';
import JourneyPage from './pages/JourneyPage';
import BoothPage from './pages/BoothPage';
import QuizPage from './pages/QuizPage';
import ChecklistPage from './pages/ChecklistPage';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} ${isHighContrast ? 'high-contrast' : ''}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar toggleDarkMode={toggleDarkMode} isDark={isDark} toggleHighContrast={toggleHighContrast} />
      <main id="main-content" className="max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/booth" element={<BoothPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="p-8 glass mt-12 text-center text-slate-500 text-sm">
        <p>© 2026 ElectraGuide. Data sourced from Election Commission of India. Not an official government app.</p>
      </footer>
    </div>
  );
}
