import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function EditProfile() {
  const { user, updateProfile } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    navigate('/profile');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-slate-500 hover:text-ocean-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Profile
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Edit */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ocean-400 to-teal-300 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-ocean-600 shadow-sm transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <p className="font-medium text-slate-800">Profile Photo</p>
              <p className="text-sm text-slate-500 mb-2">Recommended: Square JPG, PNG. Max 2MB.</p>
              <button type="button" className="text-sm font-medium text-ocean-600 hover:text-ocean-700">Upload new</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white shadow-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Role / Headline</label>
              <input 
                type="text" 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white shadow-sm"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white shadow-sm resize-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-ocean-600 text-white rounded-xl font-medium hover:bg-ocean-700 transition-colors shadow-lg shadow-ocean-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
