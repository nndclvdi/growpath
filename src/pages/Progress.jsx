import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { Target, Zap, Award, Star, Clock, TrendingUp, BookOpen, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Memetakan string dari database ke komponen ikon Lucide
const iconMap = {
  Target: Target,
  Zap: Zap,
  Award: Award,
  Star: Star,
  Clock: Clock,
  TrendingUp: TrendingUp,
  BookOpen: BookOpen,
  Trophy: Trophy
};

export default function Progress() {
  const { user } = useAppContext();
  
  // State lokal untuk menyimpan data dari Database
  const [data, setData] = useState({ 
    stats: { totalHours: 0, streak: 0, completed: 0, achievements: 0 },
    activityData: [], 
    skillData: [], 
    badges: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk menarik data berdasarkan ID user yang login
    const fetchProgressData = async () => {
      // Pastikan user dan user.id benar-benar ada sebelum memanggil API
      if (!user?.id) return;
      
      try {
        // ✅ PERBAIKAN: Menggunakan backtick (`) agar ${user.id} terbaca sebagai angka
        const response = await fetch(`http://localhost:5000/api/progress/${user.id}`);
        
        // Pengecekan status response
        if (!response.ok) {
           throw new Error(`Server merespons dengan status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        
      } catch (error) {
        console.error("Gagal mengambil data progress:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  if (loading) return <div className="text-center p-10 font-medium text-slate-500">Memuat data progress...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <h1 className="text-2xl font-bold text-slate-800">Learning Progress</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Learning Hours" value={`${data.stats.totalHours}h`} icon={Clock} color="text-indigo-500" bg="bg-indigo-50" />
        <StatCard label="Current Streak" value={`${data.stats.streak} Days`} icon={TrendingUp} color="text-cyan-500" bg="bg-cyan-50" />
        <StatCard label="Completed Courses" value={data.stats.completed} icon={BookOpen} color="text-emerald-500" bg="bg-emerald-50" />
        <StatCard label="Achievements" value={data.stats.achievements} icon={Trophy} color="text-amber-500" bg="bg-amber-50" />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data.activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip />
              <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <ResponsiveContainer width="100%" height={256}>
            <RadarChart data={data.skillData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
              <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACHIEVEMENTS */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-8 text-indigo-600 font-bold">
          <Award size={20} />
          <h2>Recent Achievements</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.badges && data.badges.length > 0 ? (
            data.badges.map((badge, idx) => {
              const IconComponent = iconMap[badge.icon_name] || Award; 
              
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform cursor-pointer">
                    <IconComponent size={40} className="text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm text-center">{badge.title}</h3>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-slate-400 text-sm py-4">
              Belum ada pencapaian. Teruslah belajar!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Komponen Pembantu
function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
    </div>
  );
}