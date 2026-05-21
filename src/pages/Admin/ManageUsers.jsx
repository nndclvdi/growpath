import React from 'react';
import { Shield, User, MoreVertical } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';

export default function ManageUsers() {
  const { user } = useAppContext();

  // Double check RBAC - only SuperAdmin should access this
  if (user?.role !== 'SuperAdmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Learner', joined: 'Oct 2023', interest: '-' },
    { id: 2, name: 'Admin Frontend', email: 'frontend@growpath.com', role: 'Admin', joined: 'Sep 2023', interest: 'Frontend' },
    { id: 3, name: 'Super Admin', email: 'admin@growpath.com', role: 'SuperAdmin', joined: 'Aug 2023', interest: 'All' },
    { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Learner', joined: 'Nov 2023', interest: '-' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Insights & Management</h1>
      </div>

      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">User</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Role</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Management Access</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Joined</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-[#0F172A] transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    u.role === 'SuperAdmin' ? 'bg-purple-500' : u.role === 'Admin' ? 'bg-ocean-500' : 'bg-teal-500'
                  }`}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{u.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    u.role === 'SuperAdmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : u.role === 'Admin' ? 'bg-ocean-500/10 text-ocean-400 border-ocean-500/20' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 font-medium">
                  {u.interest}
                </td>
                <td className="px-6 py-4 text-slate-400">{u.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
