import React, { useState } from 'react';

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2 // Tambahan untuk feedback loading
} from 'lucide-react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

export default function RegisterAdmin() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State untuk loading
  const [error, setError] = useState(''); // State untuk pesan error

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ==========================================
  // LOGIKA INTEGRASI DATABASE (API)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Kita kirim role 'admin' agar masuk ke database sebagai admin
        body: JSON.stringify({ 
          ...formData, 
          role: 'admin' 
        }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal, coba lagi.');
      }

      console.log('Register Success:', data);
      alert('Registrasi Berhasil! Silakan masuk.');
      navigate('/login-admin');

    } catch (err) {
      console.error('Register Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* CARD */}
        <div className="bg-white rounded-[28px] shadow-xl border border-slate-100 p-8">

          {/* HEADER */}
          <div className="text-center mb-8">

            <h1 className="text-blue-600 font-bold text-lg">
              GrowPath Admin
            </h1>

            <h2 className="text-3xl font-bold text-slate-800 mt-4">
              Create Admin Account
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Register new GrowPath administrator
            </p>

          </div>

          {/* ERROR MESSAGE (Muncul jika ada masalah) */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}
            <div>

              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Admin Name"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  required
                />

              </div>
            </div>

            {/* EMAIL */}
            <div>

              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Admin Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@growpath.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  required
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* LOGIN */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have admin account?{' '}
            <Link
              to="/login-admin"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-8 space-y-3">

          <p className="text-xs text-slate-400">
            Secure administrator access for GrowPath system
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">

            <button className="hover:text-slate-600">
              Terms of Service
            </button>

            <span>•</span>

            <button className="hover:text-slate-600">
              Privacy Policy
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}