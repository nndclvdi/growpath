import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi tambahan
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the Terms & Privacy Policy before creating an account.');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const loginResponse = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const loginData = await loginResponse.json();

      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));

      login(loginData.user);

      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      alert('Server error');
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
        <div className="w-[448px] bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col max-w-full">
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1 text-slate-900">
              Create Account
            </h3>
            <p className="text-xs text-slate-500">
              Start your journey with GrowPath today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* FULL NAME */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm bg-white"
                placeholder="John Doe"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm bg-white"
                placeholder="name@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm pr-10 bg-white"
                  placeholder="••••••••"
                />
                {/* Eye Icon */}
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              {/* Garis kecil di bawah password sesuai gambar */}
              <div className="w-24 h-1 bg-slate-100 rounded-full mt-2"></div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm pr-10 bg-white"
                  placeholder="••••••••"
                />
                {/* Eye Icon */}
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* TERMS AND CONDITIONS */}
            <div className="pt-1">
              <label className="flex items-center text-[11px] text-slate-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer" 
                />
                <span>I agree to the <a href="#" className="text-blue-600 hover:underline">Terms</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span>
              </label>
            </div>

            {/* BUTTON CREATE ACCOUNT */}
            <button
              type="submit"
              className="w-full bg-[#4A85F6] text-white py-2.5 rounded-full hover:bg-blue-600 font-medium transition-colors mt-2 text-sm"
            >
              Create Account
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-[10px] text-slate-400 font-medium uppercase tracking-wider">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="w-full flex items-center justify-center border border-slate-200 py-2.5 rounded-full hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 bg-white"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* FOOTER */}
          <p className="text-center mt-5 text-[11px] text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}