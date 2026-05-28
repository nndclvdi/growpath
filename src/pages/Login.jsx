import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import API from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/auth/login-user', { email, password });
      const data = response.data;

      // =========================
      // SAVE AUTH
      // =========================
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      login(data.user);

      // =========================
      // ROLE NORMALIZATION FIX
      // =========================
      const role = (data.user.role || '').toLowerCase();

      console.log("LOGIN SUCCESS:", data.user);
      console.log("ROLE DETECTED:", role);

      // =========================
      // ROLE BASED REDIRECT
      // =========================
      switch (role) {
        case 'superadmin':
          navigate('/superadmin');
          break;

        case 'admin':
          navigate('/admin');
          break;

        default:
          navigate('/dashboard');
      }

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans text-slate-800">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-[#f0f6ff] to-white p-16 border-r border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">GrowPath</h1>
        </div>
        
        <div className="max-w-md mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Helping you find your path...
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Discover your strengths, map your talents, and navigate your career journey.
          </p>
        </div>
        
        <div>{/* Empty div for flex spacing */}</div>
      </div>

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-slate-50 p-8">
        
        {/* CARD FORM */}
        <div className="w-[448px] h-[654.5px] bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col justify-center max-w-full">
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-1 text-slate-900">
              Welcome Back
            </h3>
            <p className="text-sm text-slate-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm bg-white"
                placeholder="name@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm pr-10 bg-white"
                  placeholder="••••••••"
                />
                {/* Eye Icon (Fungsional) */}
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                Remember me
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON SIGN IN */}
            <button
              type="submit"
              className="w-full bg-[#4A85F6] text-white py-3 rounded-full hover:bg-blue-600 font-medium transition-colors mt-2 text-sm"
            >
              Sign In
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="w-full flex items-center justify-center border border-slate-200 py-3 rounded-full hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 bg-white"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* FOOTER */}
          <p className="text-center mt-8 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}