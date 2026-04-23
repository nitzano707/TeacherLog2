import React from 'react';
import { useAuth } from './AuthProvider';
import { logout } from '../lib/firebase';
import { LogOut, History, PlusCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  currentView: 'new' | 'history';
  onViewChange: (view: 'new' | 'history') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-border-subtle sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">יומן רפלקציה חכם</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewChange('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                currentView === 'new' ? 'bg-blue-50 text-brand-blue' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <PlusCircle size={18} />
              <span>רפלקציה חדשה</span>
            </button>
            <button
              onClick={() => onViewChange('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                currentView === 'history' ? 'bg-blue-50 text-brand-blue' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <History size={18} />
              <span>היסטוריה</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">{user.displayName}</p>
            <p className="text-xs text-slate-500">מורה</p>
          </div>
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || '')}&background=2563EB&color=fff`} 
            className="w-10 h-10 rounded-full border-2 border-slate-100" 
            alt={user.displayName || ''} 
          />
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="התנתקות"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
