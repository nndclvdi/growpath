import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, User, Mail, MapPin, AlignLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function EditProfile() {
  const { user, updateProfile } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || 'Indonesia',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    // PERBAIKAN 1: Tambahkan /dashboard
    navigate('/dashboard/profile');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex items-center gap-4 mb-8">
        <button 
          // PERBAIKAN 2: Tambahkan /dashboard
          onClick={() => navigate('/dashboard/profile')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Profile Picture</h2>
          
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <User size={56} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center text-slate-500 shadow-md">
                <Camera size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Upload a new profile picture. Recommended size: 400×400px
              </p>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Upload Photo
                </button>
                <button 
                  type="button" 
                  className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Personal Information</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <User size={14} /> Full Name
            </label>
            <input 
              type="text" 
              name="name"
              placeholder="User Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              name="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <MapPin size={14} /> Location
            </label>
            <input 
              type="text" 
              name="location"
              placeholder="Indonesia"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <AlignLeft size={14} /> Bio
            </label>
            <textarea 
              name="bio"
              rows={4}
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium resize-none"
            ></textarea>
            <p className="text-[10px] text-slate-400 mt-1">
              Brief description for your profile. Maximum 200 characters.
            </p>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}