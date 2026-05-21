import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { user } = useAppContext();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8">
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm transition-all"
          placeholder="Search courses, mentors, or articles..."
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-ocean-600 transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-700">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'Learner'}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-ocean-400 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
        </div>
      </div>
    </header>
  );
}
