import React, { useState, useEffect } from 'react';
import { Target, Trophy, Clock, Zap, ArrowRight, Lock, BookOpen, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, progress, courses } = useAppContext();
  const navigate = useNavigate();

  // State untuk menyimpan data dinamis dari Backend
  const [dashboardStats, setDashboardStats] = useState({
    streak: 0,
    completed: 0,
    totalHours: 0,
    achievements: 0
  });
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        // 1. Ambil Data Statistik (Progress)
        const statRes = await fetch(`http://localhost:5000/api/progress/${user.id}`);
        if (statRes.ok) {
          const statData = await statRes.json();
          setDashboardStats(statData.stats);
        }

        // 2. Ambil Data Roadmap untuk Sidebar
        const rmRes = await fetch('http://localhost:5000/api/roadmaps');
        if (rmRes.ok) {
          const rmData = await rmRes.json();
          
          // Format data roadmap agar sesuai dengan UI Dashboard
          const formattedRoadmap = rmData.map((item, index) => {
            const phaseId = `phase${index + 1}`;
            // Asumsi setiap phase di frontend punya 2 item (category & level)
            const checklist = progress?.roadmapChecklist?.[phaseId] || [];
            const isCompleted = checklist.length >= 2;

            let status = 'Locked';
            if (index === 0) {
              status = isCompleted ? 'Done' : 'Active';
            } else {
              const prevPhaseId = `phase${index}`;
              const prevChecklist = progress?.roadmapChecklist?.[prevPhaseId] || [];
              const prevCompleted = prevChecklist.length >= 2;
              
              if (prevCompleted) {
                status = isCompleted ? 'Done' : 'Active';
              }
            }

            // Bersihkan judul panjang agar pas di sidebar
            const shortTitle = item.title.replace(`Step ${index + 1}: `, '').replace(' Roadmap', '');

            return {
              id: index + 1,
              title: shortTitle,
              status: status
            };
          });

          setRoadmapSteps(formattedRoadmap.slice(0, 4)); // Ambil maksimal 4 step untuk dashboard
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, progress?.roadmapChecklist]);

  // 1. MAPPING STATISTIK (Menggunakan data dari Backend)
  const stats = [
    { 
      title: 'Current Streak', 
      value: `${dashboardStats.streak} Days`, 
      icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Courses Done', 
      value: dashboardStats.completed.toString(), 
      icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Hours Learned', 
      value: `${dashboardStats.totalHours}h`, 
      icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Skills Gained', 
      value: dashboardStats.achievements.toString(), 
      icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
  ];

  // 2. KURSUS YANG SEDANG AKTIF (Fallback aman dari UI lama)
  const activeCourseIds = progress?.activeCourses?.map(ac => ac.courseId?.toString()) || [];
  const myActiveCourses = courses?.filter(c => activeCourseIds.includes((c.id || c._id)?.toString())) || [];
  
  // Jika user belum punya course aktif, ambil list course default agar dashboard tidak kosong
  const displayCourses = myActiveCourses.length > 0 ? myActiveCourses.slice(0, 2) : courses?.slice(0, 2) || [];

  if (loading) {
    return <div className="text-center p-20 text-slate-500 font-medium animate-pulse">Menyiapkan Dashboard...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-12 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* Banner Utama */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-400 rounded-[32px] md:rounded-[48px] p-8 md:p-16 shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 space-y-4 md:space-y-8 max-w-4xl text-white text-center md:text-left">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-sm font-black rounded-full inline-block uppercase tracking-widest">
            Learning Mode
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Welcome back, <br className="block md:hidden" /> {user?.name?.split(' ')[0] || 'Reza'}!
          </h1>
          <p className="text-indigo-50 opacity-95 text-base md:text-2xl leading-relaxed font-medium">
            Continue your learning journey and achieve your goals. You're making great progress!
          </p>
          <div className="pt-4 flex justify-center md:justify-start">
            <button 
              onClick={() => navigate('/courses')}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-xl text-lg md:text-xl"
            >
              Resume Course <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-[24px] md:rounded-[40px] p-5 md:p-10 border border-slate-100 shadow-sm flex flex-col gap-3 md:gap-6 hover:shadow-lg transition-all">
            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-5xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
              <p className="text-slate-400 text-[10px] md:text-base font-bold uppercase tracking-widest mt-1 md:mt-2">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* Continue Learning */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          <div className="flex items-center justify-between px-2 md:px-4">
            <h2 className="text-xl md:text-3xl font-black text-slate-800">Continue Learning</h2>
            <button 
              onClick={() => navigate('/courses')}
              className="text-indigo-600 text-sm md:text-lg font-black flex items-center gap-1 md:gap-2 hover:translate-x-1 transition-transform"
            >
              [ View All ] <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          <div className="space-y-4 md:space-y-8">
            {displayCourses.length > 0 ? (
              displayCourses.map((course) => {
                const courseProgress = progress?.activeCourses?.find(
                  ac => ac.courseId?.toString() === (course.id || course._id)?.toString()
                );
                const percentage = courseProgress?.percentage || 0;

                return (
                  <div key={course.id || course._id} className="bg-white rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 md:gap-10 group hover:border-indigo-100 hover:shadow-md transition-all">
                    <div className="hidden sm:flex w-24 h-24 md:w-28 md:h-28 bg-slate-50 rounded-[20px] md:rounded-[30px] items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                      {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] md:text-sm font-black text-slate-300 uppercase">Thumb</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1 md:space-y-2 w-full">
                      <h3 className="text-lg md:text-2xl font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                      <p className="text-slate-400 text-xs md:text-lg font-bold mb-3 md:mb-6">
                        Module: {courseProgress?.currentModuleName || 'Start Learning'}
                      </p>
                      
                      <div className="flex items-center gap-4 md:gap-8">
                        <div className="flex-1 h-2 md:h-3.5 bg-slate-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-lg font-black text-slate-500">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/courses/${course.id || course._id}`)}
                      className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-slate-50 text-slate-700 font-black rounded-xl md:rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-sm md:text-base shadow-sm hover:shadow-lg hover:shadow-indigo-200"
                    >
                      Resume
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-[32px] border border-slate-100">
                You haven't started any courses yet. <br/>
                <button 
                  onClick={() => navigate('/courses')} 
                  className="text-indigo-600 mt-4 hover:underline font-bold"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8 md:mb-14">
            <h2 className="text-xl md:text-3xl font-black text-slate-800">Roadmap</h2>
            <span className="text-indigo-600 text-[10px] md:text-sm font-black uppercase tracking-[0.2em]">Path</span>
          </div>
          
          <div className="relative space-y-8 md:space-y-14 flex-1">
            {roadmapSteps.length > 0 ? roadmapSteps.map((step, index) => {
              let stepColor = 'bg-slate-200';
              if (step.status === 'Done') stepColor = 'bg-emerald-500';
              if (step.status === 'Active') stepColor = 'bg-indigo-600';

              return (
                <div key={step.id} className="relative flex items-start gap-4 md:gap-8">
                  {index !== roadmapSteps.length - 1 && (
                    <div className={`absolute left-[9px] md:left-[13px] top-8 md:top-10 bottom-[-32px] md:bottom-[-40px] w-[2px] md:w-[4px] ${step.status === 'Done' ? 'bg-emerald-200' : 'bg-slate-100'}`}></div>
                  )}
                  
                  <div className={`relative z-10 w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white shadow-sm transition-colors ${stepColor}`}>
                    {step.status === 'Locked' && <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={`font-black text-sm md:text-xl transition-colors ${step.status === 'Locked' ? 'text-slate-300' : 'text-slate-800'}`}>
                      Step {step.id}: {step.title}
                    </h3>
                    <p className={`text-[10px] md:text-sm font-black uppercase tracking-widest ${step.status === 'Active' ? 'text-indigo-600' : step.status === 'Done' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      [{step.status}]
                    </p>
                  </div>
                </div>
              );
            }) : (
              <p className="text-slate-400 text-sm italic">Memuat roadmap...</p>
            )}
          </div>

          <button 
            onClick={() => navigate('/roadmap')}
            className="mt-10 md:mt-14 w-full py-4 md:py-5 bg-indigo-50 text-indigo-700 font-black rounded-2xl md:rounded-3xl hover:bg-indigo-100 transition-colors text-xs md:text-base uppercase tracking-widest"
          >
            Full Roadmap
          </button>
        </div>

      </div>
    </div>
  );
}