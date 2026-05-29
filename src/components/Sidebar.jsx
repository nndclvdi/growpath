import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Map, BookOpen, TrendingUp, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { logout } = useAppContext();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Assessment', path: '/dashboard/assessments', icon: FileText },
    { name: 'Roadmap', path: '/dashboard/roadmap', icon: Map },
    { name: 'Course', path: '/dashboard/courses', icon: BookOpen },
    { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
    { name: 'Profil', path: '/dashboard/profile', icon: User },
  ];

  return (
    // PERUBAHAN: Background diubah menjadi bg-indigo-50/40 dengan border indigo tipis
    <aside className="w-64 bg-indigo-50/40 border-r border-indigo-100 flex flex-col h-screen sticky top-0 font-sans">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5D5FEF] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-200">
            GP
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">GrowPath</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'} 
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#5D5FEF] text-white shadow-xl shadow-indigo-200 font-medium' 
                  // PERUBAHAN: Efek hover sekarang memunculkan background putih agar kontras dengan sidebar
                  : 'text-slate-500 hover:text-[#5D5FEF] hover:bg-white hover:shadow-sm'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className="shrink-0" 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />
                <span className="text-[15px]">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* PERUBAHAN: Border atas disesuaikan warnanya */}
      <div className="p-6 border-t border-indigo-100/50">
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-5 py-4 w-full text-left rounded-2xl text-slate-500 hover:text-red-500 hover:bg-white hover:shadow-sm transition-all group"
        >
          <LogOut size={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[15px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}