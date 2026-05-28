import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // Sesuaikan path jika letak file berbeda

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login-admin', formData);
      const data = response.data;

      localStorage.removeItem('adminToken'); 
      localStorage.removeItem('adminData');

      localStorage.setItem(
        'adminData',
        JSON.stringify(data.admin || data.user)
      );

      // Menggunakan window.location.href untuk memastikan 
      // cookie session benar-benar terbaca saat halaman dashboard dimuat
      window.location.href = '/admin/dashboard';

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login gagal, periksa kembali email/password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[28px] shadow-xl border border-slate-100 p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-blue-600 font-bold text-lg">GrowPath Admin</h1>
            <h2 className="text-3xl font-bold text-slate-800 mt-4">Admin Sign In</h2>
            <p className="text-slate-400 text-sm mt-2">Access GrowPath administration dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Admin Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have admin account?{' '}
            <Link to="/register-admin" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}