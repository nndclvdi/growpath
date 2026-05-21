import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    login({ name, email, role: 'Learner', bio: '' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-96 h-96 bg-ocean-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-white z-10 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Start your learning journey with GrowPath.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-all bg-white/50"
              placeholder="Alex Johnson"
            />
          </div>
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
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-ocean-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
