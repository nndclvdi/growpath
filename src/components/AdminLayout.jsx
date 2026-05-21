import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Briefcase, BookOpen, ClipboardCheck, BarChart, Settings, Network, Route } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AdminLayout() {
  const { user, logout } = useAppContext();

  // Route protection
  if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
    return <Navigate to="/login" replace />;
  }

  // Define nav items, filtering out "User Insight" if not SuperAdmin
  const allNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Insights', path: '/admin/users', icon: Users, requireSuper: true },
    { name: 'Talent Mapping', path: '/admin/talent-mapping', icon: Network }, 
    { name: 'Career Paths', path: '/admin/courses', icon: Route },
    { name: 'Assessments', path: '/admin/assessments', icon: ClipboardCheck },
    { name: 'Reports', path: '/admin/reports', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = allNavItems.filter(item => !item.requireSuper || user.role === 'SuperAdmin');

  return (
    <div className="flex min-h-screen bg-[#0F172A] font-sans text-slate-300">
      
      {/* Admin Sidebar - Dark Theme */}
      <aside className="w-64 bg-[#111827] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
        <div className="p-6 pb-2">
          <h1 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
              <Network size={18} />
            </div>
            GrowPath
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1E293B] text-blue-400 font-medium border border-slate-700/50 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="shrink-0" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={logout}
            className="w-full bg-[#1E293B] hover:bg-slate-800 border border-slate-700/50 transition-colors rounded-xl p-3 flex items-center gap-3 text-left shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email || 'admin@growpath.ai'}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Admin Header */}
        <header className="h-20 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-xl text-white">Admin Panel</h2>
            {user.role === 'Admin' && (
              <span className="px-3 py-1 bg-ocean-500/20 text-ocean-400 text-xs font-bold rounded-full border border-ocean-500/30 uppercase tracking-wide">
                {user.interest}
              </span>
            )}
            {user.role === 'SuperAdmin' && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-wide">
                Super Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-ocean-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
