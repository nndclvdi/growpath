import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google'; // <-- TAMBAHAN GOOGLE
import API from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();

  // FUNGSI LOGIN BIASA
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login-user', { email, password });
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      login(data.user);

      const role = (data.user.role || '').toLowerCase();
      switch (role) {
        case 'superadmin': navigate('/superadmin'); break;
        case 'admin': navigate('/admin'); break;
        default: navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Server error');
    }
  };

  // FUNGSI LOGIN GOOGLE (BARU)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // 👇 1. PASANG JEBAKAN LOG DI SINI
      console.log("🎯 BERHASIL DAPAT TOKEN DARI GOOGLE:", tokenResponse);

      try {
        const res = await API.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        
        // 👇 2. PASANG LOG KEDUA DI SINI
        console.log("✅ BACKEND MERESPON:", res.data);
        
        const data = res.data;
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user); 
        
        const role = (data.user.role || '').toLowerCase();
        if (role === 'superadmin') navigate('/superadmin');
        else if (role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      } catch (error) {
        console.error("❌ Google Login Error (Backend):", error.response?.data || error.message);
        alert(error.response?.data?.message || 'Gagal masuk dengan Google');
      }
    },
    onError: (err) => {
      console.error("❌ GOOGLE POPUP ERROR:", err);
      alert('Login Google dibatalkan.');
    }
  });

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-[#4F46E5] to-[#312E81] p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-white blur-[120px]"></div>
           <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center font-bold text-xs shadow-lg">
            GP
          </div>
          <span className="text-xl font-bold text-white tracking-wide">GrowPath</span>
        </div>
        
        <div className="relative z-10 max-w-lg mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Helping you find <br/> your path...
          </h2>
          <p className="text-indigo-100/90 text-lg leading-relaxed font-light">
            Discover your strengths, map your talents, and navigate your career journey with precision.
          </p>
        </div>
        
        <div className="relative z-10 text-indigo-200/60 text-sm">
          © {new Date().getFullYear()} GrowPath. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-[420px] bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 flex flex-col justify-center">
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Welcome Back</h3>
            <p className="text-sm text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 mb-2 uppercase">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]/30 focus:border-[#5D5FEF] transition-all placeholder:text-slate-300 text-sm bg-slate-50 focus:bg-white"
                placeholder="name@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold tracking-wide text-slate-700 mb-2 uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]/30 focus:border-[#5D5FEF] transition-all placeholder:text-slate-300 text-sm pr-10 bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center text-xs text-slate-600 cursor-pointer font-medium hover:text-slate-900 transition-colors">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-[#5D5FEF] focus:ring-[#5D5FEF] cursor-pointer" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs text-[#5D5FEF] hover:text-indigo-800 transition-colors font-semibold">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full bg-[#5D5FEF] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all mt-4 text-sm">
              Sign In
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-[10px] tracking-wider text-slate-400 font-bold uppercase">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={() => loginWithGoogle()} // <-- DIPANGGIL DISINI
            className="w-full flex items-center justify-center border-2 border-slate-100 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all text-sm font-semibold text-slate-700 bg-white"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-center mt-8 text-xs text-slate-500 font-medium">
            Don't have an account? <Link to="/register" className="text-[#5D5FEF] hover:text-indigo-800 font-bold transition-colors">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}