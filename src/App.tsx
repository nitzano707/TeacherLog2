import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { signInWithGoogle } from './lib/firebase';
import { Navigation } from './components/Navigation';
import { ReflectionForm } from './components/ReflectionForm';
import { History } from './components/History';
import { LogIn, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-border-subtle mb-8">
          <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-blue-200">
            <Sparkles className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">יומן רפלקציה חכם</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">כלי ניתוח מקצועי המבוסס על בינה מלאכותית, לשיפור תמידי באיכות ההוראה.</p>
          
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>התחברות מאובטחת עם Google</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold font-sans">Professional Reflection Tool for Educators</p>
      </motion.div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [view, setView] = useState<'new' | 'history'>('new');

  return (
    <div className="min-h-screen bg-bg-main">
      <Navigation currentView={view} onViewChange={setView} />
      <main className="min-h-[calc(100vh-64px)]">
        <motion.div
           key={view}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.2 }}
        >
          {view === 'new' ? <ReflectionForm /> : <History />}
        </motion.div>
      </main>
      <footer className="py-8 text-center text-slate-400 text-xs border-t border-border-subtle bg-white/50">
        <p>© {new Date().getFullYear()} יומן רפלקציה חכם למורה - Professional Polish Edition</p>
      </footer>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Dashboard /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
