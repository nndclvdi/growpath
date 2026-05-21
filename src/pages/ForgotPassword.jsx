import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Panggil API Backend di sini
    // await fetch('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    
    // Simulasi sukses
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Login
        </button>

        {!isSubmitted ? (
          <>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
            <p className="text-slate-500 text-sm mb-8">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm">
              We have sent a password reset link to <span className="font-bold text-slate-700">{email}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}