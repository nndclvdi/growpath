import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Map, GraduationCap, BarChart, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { logout } = useAppContext();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', path: '/assessments', icon: BookOpen },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Courses', path: '/courses', icon: GraduationCap },
    { name: 'Progress', path: '/progress', icon: BarChart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-ocean-700 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-500 to-teal-500 text-white flex items-center justify-center text-sm">G</span>
          GrowPath
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-ocean-50 text-ocean-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-ocean-600'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
