import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Learner');
  const [adminType, setAdminType] = useState('Frontend'); // For testing RBAC
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    let userData = {
      email,
      bio: 'Passionate about learning.'
    };

    if (role === 'Learner') {
      userData = { ...userData, name: 'Alex Johnson', role: 'Learner' };
      login(userData);
      navigate('/dashboard');
    } else if (role === 'Admin') {
      userData = { ...userData, name: `${adminType} Admin`, role: 'Admin', interest: adminType };
      login(userData);
      navigate('/admin');
    } else if (role === 'SuperAdmin') {
      userData = { ...userData, name: 'Super Admin', role: 'SuperAdmin', interest: 'All' };
      login(userData);
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-ocean-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-white z-10 relative">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-ocean-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-ocean-500/30">
            <span className="text-white text-3xl font-bold">G</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Log in to continue your journey.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Login As</label>
            <div className="flex gap-4">
              <label className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-colors ${role === 'Learner' ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="Learner" className="hidden" checked={role === 'Learner'} onChange={() => setRole('Learner')} />
                Learner
              </label>
              <label className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-colors ${role === 'Admin' ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="Admin" className="hidden" checked={role === 'Admin'} onChange={() => setRole('Admin')} />
                Admin
              </label>
              <label className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-colors ${role === 'SuperAdmin' ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="SuperAdmin" className="hidden" checked={role === 'SuperAdmin'} onChange={() => setRole('SuperAdmin')} />
                Super Admin
              </label>
            </div>
          </div>

          {role === 'Admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Expertise Area</label>
              <select 
                value={adminType} 
                onChange={(e) => setAdminType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white/50"
              >
                <option value="Frontend">Frontend</option>
                <option value="Design">Design</option>
                <option value="Programming">Programming</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white/50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-gradient-to-r from-ocean-600 to-teal-500 text-white rounded-xl font-medium hover:from-ocean-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] shadow-lg shadow-ocean-500/30 mt-4"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="text-ocean-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
