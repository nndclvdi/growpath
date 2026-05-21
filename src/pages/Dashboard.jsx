import React from 'react';
import { Target, Trophy, Clock, Zap, ArrowRight, Lock, BookOpen, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, progress, courses } = useAppContext();
  const navigate = useNavigate();

  // 1. DATA STATISTIK ASLI DARI USER & PROGRESS
  const stats = [
    { 
      title: 'Current Streak', 
      value: `${user?.streak || 0} Days`, 
      icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Courses Done', 
      value: progress?.completedCourses?.length?.toString() || '0', 
      icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Hours Learned', 
      value: `${user?.hoursLearned || 0}h`, 
      icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Skills Gained', 
      value: user?.skills?.length?.toString() || '0', 
      icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
  ];

  // 2. KURSUS YANG SEDANG AKTIF (Penyaringan ID dipaksa string agar aman dari bug data types)
  const activeCourseIds = progress?.activeCourses?.map(ac => ac.courseId?.toString()) || [];
  const myActiveCourses = courses?.filter(c => activeCourseIds.includes((c.id || c._id)?.toString())) || [];
  
  // Amankan Fallback: Jika user belum punya course aktif sama sekali, ambil list course default agar dashboard tidak kosong
  const displayCourses = myActiveCourses.length > 0 ? myActiveCourses.slice(0, 2) : courses?.slice(0, 2);

  // 3. ROADMAP (Menyesuaikan dengan level/status user)
  const roadmapSteps = progress?.roadmap || [
    { id: 1, title: 'Basics', status: user?.level >= 1 ? 'Done' : 'Active', color: user?.level >= 1 ? 'bg-emerald-500' : 'bg-indigo-600' },
    { id: 2, title: 'Fundamentals', status: user?.level >= 2 ? 'Done' : 'Locked', color: user?.level >= 2 ? 'bg-emerald-500' : 'bg-slate-200' },
    { id: 3, title: 'Integration', status: user?.level >= 3 ? 'Done' : 'Locked', color: user?.level >= 3 ? 'bg-emerald-500' : 'bg-slate-200' },
    { id: 4, title: 'Advanced', status: user?.level >= 4 ? 'Done' : 'Locked', color: user?.level >= 4 ? 'bg-emerald-500' : 'bg-slate-200' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-12 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* Banner Utama */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-400 rounded-[32px] md:rounded-[48px] p-8 md:p-16 shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 space-y-4 md:space-y-8 max-w-4xl text-white text-center md:text-left">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-sm font-black rounded-full inline-block uppercase tracking-widest">
            Learning Mode
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Welcome back, <br className="block md:hidden" /> {user?.name?.split(' ')[0] || 'User'}!
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
              className="text-indigo-600 text-sm md:text-lg font-black flex items-center gap-1 md:gap-2"
            >
              [ View All ] <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          <div className="space-y-4 md:space-y-8">
            {displayCourses.length > 0 ? (
              displayCourses.map((course) => {
                // Pencarian objek progress dicocokkan menggunakan String (.toString()) secara aman
                const courseProgress = progress?.activeCourses?.find(
                  ac => ac.courseId?.toString() === (course.id || course._id)?.toString()
                );
                const percentage = courseProgress?.percentage || 0;

                return (
                  <div key={course.id || course._id} className="bg-white rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 md:gap-10 group">
                    <div className="hidden sm:flex w-24 h-24 md:w-28 md:h-28 bg-slate-50 rounded-[20px] md:rounded-[30px] items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                      <span className="text-[10px] md:text-sm font-black text-slate-300 uppercase">Thumb</span>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1 md:space-y-2 w-full">
                      <h3 className="text-lg md:text-2xl font-black text-slate-800 truncate">{course.title}</h3>
                      <p className="text-slate-400 text-xs md:text-lg font-bold mb-3 md:mb-6">
                        Module: {courseProgress?.currentModuleName || 'In Progress'}
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
                      className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-slate-50 text-slate-700 font-black rounded-xl md:rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-sm md:text-base"
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
            {roadmapSteps.map((step, index) => {
              let stepColor = 'bg-slate-200';
              if (step.status === 'Done') stepColor = 'bg-emerald-500';
              if (step.status === 'Active') stepColor = 'bg-indigo-600';

              return (
                <div key={step.id} className="relative flex items-start gap-4 md:gap-8">
                  {index !== roadmapSteps.length - 1 && (
                    <div className="absolute left-[9px] md:left-[13px] top-8 md:top-10 bottom-[-32px] md:bottom-[-40px] w-[2px] md:w-[4px] bg-slate-100"></div>
                  )}
                  
                  <div className={`relative z-10 w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white shadow-sm ${stepColor}`}>
                    {step.status === 'Locked' && <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={`font-black text-sm md:text-xl ${step.status === 'Locked' ? 'text-slate-300' : 'text-slate-800'}`}>
                      Step {step.id}: {step.title}
                    </h3>
                    <p className={`text-[10px] md:text-sm font-black uppercase tracking-widest ${step.status === 'Active' ? 'text-indigo-600' : 'text-slate-400'}`}>
                      [{step.status}]
                    </p>
                  </div>
                </div>
              );
            })}
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