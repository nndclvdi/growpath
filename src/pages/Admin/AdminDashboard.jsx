import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Users, ClipboardList, Target, TrendingUp, LogOut } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export default function AdminDashboard() {
  const { logout } = useAppContext();
  const navigate = useNavigate();
  const [data, setData] = useState({ 
    stats: { totalUsers: 0, activeAssessments: 0, matches: 0, progress: 0 }, 
    recentActivities: [] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', { credentials: 'include' });
        if (res.status === 403) {
            console.error("Akses Ditolak: Silakan Login Admin");
            return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) { console.error("Error loading dashboard:", err); }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Keluar dari Admin Dashboard?")) {
      const success = await logout();
      if (success) {
        navigate('/login-admin', { replace: true });
      }
    }
  };

  return (
    <div className="p-8 bg-[#0F172A] min-h-screen text-white">
      <div className="flex justify-between items-center bg-[#181E2E] p-6 rounded-2xl border border-slate-700 mb-8">
        <h1 className="text-2xl font-bold">Admin Central</h1>
        <button onClick={handleLogout} className="text-red-400 flex items-center gap-2 font-bold"><LogOut size={18}/> Logout</button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Users', val: data.stats?.totalUsers, color: 'text-blue-400' },
          { title: 'Assessments', val: data.stats?.activeAssessments, color: 'text-purple-400' },
          { title: 'Matches', val: data.stats?.matches, color: 'text-emerald-400' },
          { title: 'Progress', val: data.stats?.progress + '%', color: 'text-orange-400' }
        ].map((s, i) => (
          <div key={i} className="bg-[#181E2E] p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase">{s.title}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#181E2E] p-6 rounded-2xl border border-slate-700 h-[300px]">
         <h2 className="font-bold mb-4">Talent Distribution</h2>
         <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={[{subject: 'Users', A: data.stats?.totalUsers || 0}, {subject: 'Activity', A: data.stats?.progress || 0}]}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" />
              <Radar dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
            </RadarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
