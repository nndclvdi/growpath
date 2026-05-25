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

<<<<<<< HEAD
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
=======
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Radar Chart */}
          <div className="bg-[#181E2E] p-6 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold text-white">Talent Overview</h2>
                <p className="text-sm text-slate-400">Global distribution of user strengths</p>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                View detailed report <ArrowRight size={14} />
              </button>
            </div>
            <div className="flex-1 -mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#2D3748" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC', borderRadius: '8px' }} />
                  <Radar name="Score" dataKey="A" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tasks Queue */}
          <div className="bg-[#181E2E] p-6 rounded-2xl border border-slate-700/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold text-white">Tasks / Review Queue</h2>
                <p className="text-sm text-slate-400">Pending administrative actions</p>
              </div>
              <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[11px] font-bold">2 Pending</span>
            </div>
            
            <div className="space-y-4">
              {queueItems.map((item, idx) => (
                <div key={idx} className="bg-[#1E2638] rounded-xl p-4 border border-slate-700/30 flex items-center justify-between group hover:border-slate-600 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] text-slate-500 font-medium">{item.id}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.priorityColor}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium">{item.title}</p>
                  </div>
                  <button className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Trending Paths */}
          <div className="bg-[#181E2E] p-6 rounded-2xl border border-slate-700/50 shadow-sm">
            <h2 className="text-base font-bold text-white mb-1">Trending Paths</h2>
            <p className="text-sm text-slate-400 mb-6">Most recommended this week</p>
            
            <div className="space-y-4">
              {trendingPaths.map((path, idx) => (
                <div key={idx} className="bg-[#1E2638] rounded-xl p-4 border border-slate-700/30 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${path.bg} ${path.color}`}>
                    <path.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-0.5">{path.title}</p>
                    <p className="text-[11px] text-slate-400">Global Match Rate</p>
                  </div>
                  <div className="text-sm font-bold text-white">{path.match}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity */}
          <div className="bg-[#181E2E] p-6 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-white">Live Activity</h2>
              <button className="text-slate-500 hover:text-slate-300 transition-colors"><MoreVertical size={16} /></button>
            </div>
            
            <div className="space-y-6 flex-1">
              {activities.map((act, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== activities.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-slate-800"></div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#181E2E] flex items-center justify-center text-white text-xs font-bold shrink-0 z-10 overflow-hidden relative">
                    <img src={`https://ui-avatars.com/api/?name=${act.avatar}&background=random&color=fff`} alt={act.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-300">
                      <span className="font-bold text-white">{act.name}</span> {act.action}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-3 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              View All Activity
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
>>>>>>> 897df25ea1dfa544a23ae9de78c005ceb797c597
