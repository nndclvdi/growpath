import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { user } = useAppContext();

  return (
    // Menggunakan bg-white/80 dan backdrop-blur untuk efek transparan elegan saat scroll
    <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20 border-b border-slate-100">
      
      {/* Search Input */}
      <div className="relative w-full max-w-md group">
        {/* Ikon Search di dalam input */}
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5D5FEF] transition-colors" 
          size={18} 
        />
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-full bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-sm font-medium text-slate-700"
          placeholder="Search courses, skills, or roadmaps..."
        />
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Notification Button */}
        <button className="relative p-2.5 text-slate-400 hover:text-[#5D5FEF] hover:bg-indigo-50 rounded-full transition-all">
          <Bell size={20} />
          {/* Active Dot - Penanda ada notifikasi */}
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* Divider / Garis Pembatas (Sembunyi di layar kecil) */}
        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

        {/* Profile Section (Dibuat seperti tombol interaktif) */}
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#5D5FEF] to-indigo-400 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-bold text-slate-700 leading-tight">
              {user?.name?.split(' ')[0] || 'User'}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
              Student
            </p>
          </div>
          
          {/* Ikon panah bawah penanda dropdown */}
          <ChevronDown size={16} className="text-slate-400 hidden sm:block group-hover:text-slate-600 transition-colors" />
        </button>

      </div>
    </header>
  );
}