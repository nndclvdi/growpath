import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Mail, Calendar, User, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function ProfileView() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    // Memperbesar max-width agar lebih mengisi layar dan padding container
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20 px-4">
      
      <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Profile</h1>

      {/* Main Profile Card - Diperbesar shadow dan radiusnya */}
      <div className="bg-white rounded-[40px] overflow-hidden shadow-md border border-slate-100">
        
        {/* Header Gradient - Dipertinggi dari h-40 ke h-56 */}
        <div className="h-56 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"></div>

        <div className="px-12 pb-12">
          {/* Avatar & Header Section - Diperbesar skalanya */}
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-end -mt-16 mb-10 gap-6">
            <div className="flex flex-col md:flex-row items-end gap-8">
              
              {/* Avatar Box - Diperbesar dari w-32 ke w-40 */}
              <div className="w-40 h-40 rounded-[35px] bg-indigo-600 border-[6px] border-white flex items-center justify-center text-white shadow-xl">
                <User size={64} strokeWidth={1.5} />
              </div>
              
              <div className="pb-2">
                <h2 className="text-4xl font-bold text-slate-800">{user?.name || 'Reza'}</h2>
                <p className="text-xl text-slate-400 font-medium mt-1">{user?.role || 'user'}</p>
              </div>
            </div>

            {/* Tombol Edit - Lebih besar dan padding lebih luas */}
            <button 
              onClick={() => navigate('/profile/edit')}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-3 shadow-lg shadow-indigo-200 text-lg"
            >
              <Edit2 size={20} /> Edit Profile
            </button>
          </div>

          {/* Info Grid - Spacing gap diperbesar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            
            {/* Email */}
            <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[24px] border border-slate-100 hover:bg-slate-100/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Email</p>
                <p className="text-lg font-bold text-slate-700">{user?.email || 'fahrezireza26@gmail.com'}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[24px] border border-slate-100 hover:bg-slate-100/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Location</p>
                <p className="text-lg font-bold text-slate-700">Indonesia</p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[24px] border border-slate-100 hover:bg-slate-100/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Joined</p>
                <p className="text-lg font-bold text-slate-700">January 2023</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[24px] border border-slate-100 hover:bg-slate-100/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Status</p>
                <p className="text-lg font-bold text-slate-700">Active Learner</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Stats Section - Dibuat lebih tinggi (p-10) dan teks lebih besar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[32px] shadow-md border border-slate-100 flex flex-col gap-2 hover:-translate-y-1 transition-transform">
          <h3 className="text-5xl font-black text-slate-800">12</h3>
          <p className="text-lg font-semibold text-slate-400">Days Streak</p>
        </div>
        
        <div className="bg-white p-10 rounded-[32px] shadow-md border border-slate-100 flex flex-col gap-2 hover:-translate-y-1 transition-transform">
          <h3 className="text-5xl font-black text-slate-800">4</h3>
          <p className="text-lg font-semibold text-slate-400">Courses Completed</p>
        </div>

        <div className="bg-white p-10 rounded-[32px] shadow-md border border-slate-100 flex flex-col gap-2 hover:-translate-y-1 transition-transform">
          <h3 className="text-5xl font-black text-slate-800">36h</h3>
          <p className="text-lg font-semibold text-slate-400">Total Learning Time</p>
        </div>
      </div>

    </div>
  );
}