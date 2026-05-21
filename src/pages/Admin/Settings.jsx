import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAppContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <Shield className="text-purple-400" size={20} />
            <h2 className="font-bold text-lg text-white">Account & Security</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
              <input type="text" defaultValue={user?.name || ''} className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <input type="email" defaultValue={user?.email || 'admin@growpath.ai'} className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
              <input type="text" defaultValue={user?.role || ''} disabled className="w-full border border-slate-800 bg-slate-900 text-slate-500 p-2.5 rounded-lg cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Change Password</label>
              <button className="w-full px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700 font-medium transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <Bell className="text-yellow-400" size={20} />
            <h2 className="font-bold text-lg text-white">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive daily summaries and alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-white">System Alerts</p>
                <p className="text-sm text-slate-500">Get notified about platform updates and maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <Palette className="text-pink-400" size={20} />
            <h2 className="font-bold text-lg text-white">Appearance</h2>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 p-4 border-2 border-blue-500 bg-[#0F172A] rounded-xl text-center shadow-lg shadow-blue-500/10">
              <div className="w-full h-20 bg-[#111827] rounded-lg mb-3 flex flex-col gap-2 p-2">
                <div className="w-1/3 h-2 bg-slate-700 rounded-full"></div>
                <div className="w-full h-8 bg-blue-600/20 rounded-md"></div>
              </div>
              <p className="font-bold text-white">Dark Mode (Default)</p>
            </button>
            <button className="flex-1 p-4 border-2 border-slate-700 hover:border-slate-600 bg-[#0F172A] rounded-xl text-center opacity-50 cursor-not-allowed">
              <div className="w-full h-20 bg-slate-100 rounded-lg mb-3 flex flex-col gap-2 p-2">
                 <div className="w-1/3 h-2 bg-slate-300 rounded-full"></div>
                 <div className="w-full h-8 bg-blue-100 rounded-md"></div>
              </div>
              <p className="font-bold text-slate-400">Light Mode (Coming Soon)</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
