import React, { useState, useEffect, useMemo } from 'react';
import { Target, Trophy, Clock, Zap, ArrowRight, Lock, BookOpen, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
  const { user, progress, setProgress, courses } = useAppContext();
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    streak: 0,
    completed: 0,
    totalHours: 0,
    achievements: 0
  });
  
  // State baru khusus untuk menyimpan data roadmap mentah dari API
  const [rawRoadmaps, setRawRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [progressRes, rmRes] = await Promise.all([
          API.get(`/progress/user/${user.id}`), 
          API.get('/roadmaps')
        ]);

        const progressData = progressRes.data;

        // Set Statistik
        if (progressData?.stats) {
          setDashboardStats(progressData.stats);
        }
        
        // Gabungkan data dari Backend dengan data lokal di Context
        if (progressData) {
          setProgress(prev => ({
             ...prev,
             ...progressData
          }));
        }

        // Simpan data roadmap mentah
        if (rmRes.data) {
          setRawRoadmaps(rmRes.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, setProgress]); 

  // LOGIKA BARU: Kalkulasi status roadmap secara otomatis (Reaktif) 
  // Membaca langsung dari progress context (yang berisi centangan Anda)
  const roadmapSteps = useMemo(() => {
    if (!rawRoadmaps || rawRoadmaps.length === 0) return [];
    
    const formattedRoadmap = rawRoadmaps.map((item, index) => {
      const phaseId = `phase${index + 1}`;
      
      // Menggunakan progress?.roadmapChecklist agar selalu sinkron dengan state global
      const checklist = progress?.roadmapChecklist?.[phaseId] || [];
      const isCompleted = checklist.length >= 2;

      let status = 'Locked';
      if (index === 0) {
        status = isCompleted ? 'Done' : 'Active';
      } else {
        const prevPhaseId = `phase${index}`;
        const prevChecklist = progress?.roadmapChecklist?.[prevPhaseId] || [];
        const prevCompleted = prevChecklist.length >= 2;
        if (prevCompleted) status = isCompleted ? 'Done' : 'Active';
      }

      const shortTitle = item.title.replace(/Step \d: /, '').replace(' Roadmap', '');
      return { id: index + 1, title: shortTitle, status };
    });
    
    return formattedRoadmap.slice(0, 4);
  }, [rawRoadmaps, progress?.roadmapChecklist]);

  const stats = [
    { title: 'Current Streak', value: `${dashboardStats.streak} Days`, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Courses Done', value: dashboardStats.completed.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Hours Learned', value: `${dashboardStats.totalHours}h`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Skills Gained', value: dashboardStats.achievements.toString(), icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const activeCourseIds = progress?.activeCourses?.map(ac => ac.courseId?.toString()) || [];
  const myActiveCourses = courses?.filter(c => activeCourseIds.includes((c.id || c._id)?.toString())) || [];
  const displayCourses = myActiveCourses.length > 0 ? myActiveCourses.slice(0, 2) : courses?.slice(0, 2) || [];

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-slate-500 font-medium">Memuat Workspace...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-10 text-white shadow-lg flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Reza'}!</h1>
          <p className="text-indigo-100 text-base">Continue your learning journey and achieve your goals.</p>
          <button onClick={() => navigate('/dashboard/courses')} className="mt-4 px-6 py-2.5 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-all">Resume Course</button>
        </div>
        <Target size={100} className="text-white/20 hidden md:block" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}><stat.icon size={22} /></div>
            <div>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
            <button onClick={() => navigate('/dashboard/courses')} className="text-indigo-600 font-bold text-sm hover:underline">[ View All ]</button>
          </div>
          {displayCourses.map((course) => (
            <div key={course.id || course._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {course.image ? <img src={course.image} alt={course.title} className="w-full h-full object-cover"/> : <BookOpen size={24} className="text-slate-300" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{course.title}</h3>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress?.activeCourses?.find(ac => ac.courseId?.toString() === (course.id || course._id)?.toString())?.percentage || 0}%` }}></div>
                </div>
              </div>
              <button onClick={() => navigate(`/dashboard/courses/${course.id || course._id}`)} className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-700 transition">Resume</button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Roadmap Path</h2>
          <div className="space-y-6">
            {roadmapSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4 items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step.status === 'Done' ? 'bg-emerald-500' : step.status === 'Active' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                   {step.status === 'Locked' ? <Lock size={12} className="text-white" /> : <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={`text-sm font-semibold ${step.status === 'Locked' ? 'text-slate-300' : 'text-slate-700'}`}>{step.title}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard/roadmap')} className="w-full mt-8 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 text-sm transition">Full Roadmap</button>
        </div>
      </div>
    </div>
  );
}