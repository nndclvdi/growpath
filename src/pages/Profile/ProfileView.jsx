import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Link as LinkIcon, Mail, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function ProfileView() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Cover & Avatar */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
        <div className="h-48 bg-gradient-to-r from-ocean-500 to-teal-400"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-ocean-400 to-teal-300 flex items-center justify-center text-white text-5xl font-bold shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{user?.name || 'Guest User'}</h1>
            <p className="text-ocean-600 font-medium text-lg mb-4">{user?.role || 'Learner'}</p>
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              {user?.bio || 'No bio provided. Click Edit Profile to add a bio and let others know more about you.'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">About</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-slate-400" />
              <span>{user?.email || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-slate-400" />
              <span>Jakarta, Indonesia</span>
            </div>
            <div className="flex items-center gap-3">
              <LinkIcon size={18} className="text-slate-400" />
              <a href="#" className="text-ocean-600 hover:underline">github.com/{user?.name?.split(' ')[0]?.toLowerCase() || 'guest'}</a>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-slate-400" />
              <span>Joined May 2026</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-6">
            <div className="relative pl-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:w-0.5 before:bg-slate-200">
              <div className="relative mb-6">
                <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full border-2 border-ocean-500 bg-white"></div>
                <p className="text-sm text-slate-500 mb-1">2 hours ago</p>
                <p className="font-medium text-slate-800">Completed "Advanced React Patterns" course.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full border-2 border-teal-500 bg-white"></div>
                <p className="text-sm text-slate-500 mb-1">Yesterday</p>
                <p className="font-medium text-slate-800">Earned the "First Steps" badge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
