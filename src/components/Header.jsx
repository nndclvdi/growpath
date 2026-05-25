import React from 'react';
import { Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { user } = useAppContext();

  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Input */}
      <div className="relative w-[450px]">
        <input
          type="text"
          className="block w-full px-6 py-3 border border-slate-100 rounded-full bg-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
          placeholder="Search placeholder..."
        />
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-8">
        {/* Notification Bell */}
        <button className="text-[#D4AF37] hover:scale-110 transition-transform">
          <Bell size={24} fill="currentColor" />
        </button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#5D5FEF] flex items-center justify-center text-white font-bold shadow-sm">
            {/* Menggunakan inisial atau icon jika tidak ada foto */}
            <span className="text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-700">
            {user?.name || 'User'}
          </p>
        </div>
      </div>
    </header>
  );
}
