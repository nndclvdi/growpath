import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart,
  Settings,
  Network,
  Route,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';

export default function AdminLayout() {
  const adminDataString = localStorage.getItem('adminData');
  const user = adminDataString ? JSON.parse(adminDataString) : null;

  const logout = () => {
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    window.location.href = '/login-admin';
  };

  // Route Protection
  if (!user || !user.role) {
    return <Navigate to="/login-admin" replace />;
  }

  const roleClean = user.role.toLowerCase();
  if (roleClean !== 'admin' && roleClean !== 'superadmin') {
    return <Navigate to="/login-admin" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Insights', path: '/admin/users', icon: Users },
    { name: 'Talent Mapping', path: '/admin/talent-mapping', icon: Network },
    { name: 'Career Paths', path: '/admin/courses', icon: Route },
    { name: 'Assessments', path: '/admin/assessments', icon: ClipboardCheck },
    { name: 'Reports', path: '/admin/reports', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#071226] text-slate-300 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-[250px] bg-[#0F1B33] border-r border-[#1E2A45] flex flex-col h-screen sticky top-0">
        <div className="h-20 px-6 flex items-center border-b border-[#1E2A45]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Network size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">GrowPath</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-3">Menu</p>
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                      : 'text-slate-400 hover:bg-[#162544] hover:text-white'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-[#1E2A45]">
          <button
            onClick={logout}
            className="w-full bg-[#162544] hover:bg-[#1B2E54] transition-all rounded-2xl p-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name || 'Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email || 'admin@growpath.ai'}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-[#091529] border-b border-[#1E2A45] flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <div className="hidden md:flex items-center bg-[#0F1B33] border border-[#1E2A45] rounded-full px-4 h-11 w-[320px]">
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Cari user, skill, atau laporan..."
                className="bg-transparent outline-none border-none text-sm text-white placeholder:text-slate-500 ml-3 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name || 'Admin'}&background=2563eb&color=fff`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#071226] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}