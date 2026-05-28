import React, { useState, useEffect } from 'react';
import { Download, Loader2, AlertCircle, MoreHorizontal, Shield } from 'lucide-react';
import API from '../../api/axios'; // Pastikan path ini tepat menuju axios.js Anda

export default function UserInsights() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        setSessionExpired(false);

        const response = await API.get('/users');
        const data = response.data;

        setUsers(Array.isArray(data) ? data : (data.users || []));

      } catch (err) {
        if (err.response) {
          // Tangkap error session (401 Unauthorized / 403 Forbidden)
          if (err.response.status === 401 || err.response.status === 403) {
            setSessionExpired(true);
            setError(err.response.data?.message || 'Sesi Anda telah berakhir atau Anda bukan admin.');
            setTimeout(() => {
              window.location.href = '/login?session=expired';
            }, 3000);
          } else {
            setError(err.response.data?.message || `Terjadi kesalahan (HTTP ${err.response.status})`);
          }
        } else {
          setError(err.message || 'Terjadi kesalahan jaringan.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login-admin';
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }

    const csvContent = [
      ['ID', 'Nama', 'Email', 'Role', 'Created At'],
      ...users.map(user => [
        user.id,
        user.name || 'N/A',
        user.email || 'N/A',
        user.role || 'user',
        user.created_at || 'N/A'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-insights-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-10 text-slate-400">
        <Loader2 className="animate-spin w-12 h-12 mb-4 text-blue-500" />
        <p className="text-xl font-medium">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 w-full mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-500/20 rounded-2xl shadow-inner">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              User Insights
            </h2>
            <p className="text-slate-400 text-lg mt-1">
              Menampilkan <span className="text-blue-400 font-bold">{users.length}</span> data pengguna terdaftar
            </p>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          disabled={users.length === 0}
          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Download size={24} />
          DOWNLOAD CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/20 p-10 rounded-[2.5rem]">
          <div className="flex items-start gap-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <div>
              <h3 className="font-black text-red-400 text-2xl mb-2">Terjadi Kesalahan</h3>
              <p className="text-red-200/70 text-xl mb-8">{error}</p>
              {sessionExpired && (
                <button onClick={handleLogout} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-lg">
                  Logout Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!error && (
        <div className="bg-[#0F172A] border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-800/50 text-slate-300">
                  <th className="py-8 px-10 text-base font-black uppercase tracking-widest">ID</th>
                  <th className="py-8 px-10 text-base font-black uppercase tracking-widest">Nama Lengkap</th>
                  <th className="py-8 px-10 text-base font-black uppercase tracking-widest">Email</th>
                  <th className="py-8 px-10 text-base font-black uppercase tracking-widest">Role</th>
                  <th className="py-8 px-10 text-base font-black uppercase tracking-widest">Tgl Daftar</th>
                  <th className="py-8 px-10 text-base font-black uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-blue-600/[0.03] transition-colors group">
                      <td className="py-8 px-10">
                        <span className="text-blue-500 font-black font-mono text-lg">
                          #{user.id || index + 1}
                        </span>
                      </td>
                      
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-black shadow-lg">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {user.name || 'No Name'}
                          </span>
                        </div>
                      </td>

                      <td className="py-8 px-10 text-slate-300 text-lg font-medium">
                        {user.email || '—'}
                      </td>

                      <td className="py-8 px-10">
                        <span className={`px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-tighter border-2 ${
                          user.role === 'admin' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>

                      <td className="py-8 px-10 text-slate-400 text-lg">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>

                      <td className="py-8 px-10 text-center">
                        <button className="text-slate-500 hover:text-white p-4 rounded-2xl hover:bg-slate-800 transition-all transform hover:scale-125">
                          <MoreHorizontal size={28} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-40 text-center text-slate-500">
                      <Shield className="w-20 h-20 mx-auto mb-4 opacity-20" />
                      <p className="text-2xl font-bold">Data tidak ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}