import React from 'react';
import { PlayCircle, Target, Trophy, Clock, Zap, ArrowRight, Play, CheckCircle, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, progress, courses } = useAppContext();
  const navigate = useNavigate();

  const stats = [
    { title: 'Current Streak', value: '12 Days', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { title: 'Courses Done', value: progress.completedCourses.length.toString(), icon: Trophy, color: 'text-ocean-500', bg: 'bg-ocean-100' },
    { title: 'Hours Learned', value: '36h', icon: Clock, color: 'text-teal-500', bg: 'bg-teal-100' },
    { title: 'Skills Gained', value: '8', icon: Target, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  // Roadmap Steps
  const roadmapSteps = [
    { id: 1, title: 'Basics', status: 'Done', color: 'bg-ocean-500' },
    { id: 2, title: 'Fundamentals', status: 'Active', color: 'bg-teal-500' },
    { id: 3, title: 'Integration', status: 'Locked', color: 'bg-slate-200' },
    { id: 4, title: 'Advanced', status: 'Locked', color: 'bg-slate-200' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner High Fidelity */}
      <div className="bg-gradient-to-r from-ocean-800 to-ocean-600 rounded-3xl p-8 shadow-xl shadow-ocean-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute right-0 top-0 w-64 h-full bg-white opacity-5 transform skew-x-12 translate-x-16"></div>
        
        <div className="flex-1 space-y-4 relative z-10 text-white">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full inline-block">
            Pro Learner
          </span>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-ocean-100 max-w-xl text-lg">
            You've completed 80% of your weekly goal. Keep pushing forward!
          </p>
          <button 
            onClick={() => navigate('/courses')}
            className="mt-4 px-6 py-3 bg-white text-ocean-700 font-bold rounded-xl hover:bg-ocean-50 transition-colors shadow-lg shadow-black/10 inline-flex items-center gap-2 transform hover:scale-105"
          >
            Resume Learning <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="relative z-10 shrink-0">
          <div className="w-48 h-48 rounded-full border-4 border-white/20 p-2 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" 
              alt="Learning" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start gap-4 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Continue Learning (Left, spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
            <button 
              onClick={() => navigate('/courses')}
              className="text-ocean-600 text-sm font-bold hover:text-ocean-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {courses.slice(0, 2).map((course, idx) => (
              <div key={course.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-6 group">
                <div className="w-full sm:w-40 h-28 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer">
                  <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <PlayCircle size={36} className="text-white relative z-10 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-2.5 py-1 bg-ocean-50 text-ocean-600 text-xs font-bold rounded-md">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{course.title}</h3>
                  <p className="text-slate-500 text-sm mb-3">Next: Module {idx + 2}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-ocean-500 to-teal-400 rounded-full" style={{ width: idx === 0 ? '65%' : '32%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-ocean-600">{idx === 0 ? '65%' : '32%'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-ocean-50 text-ocean-600 font-bold rounded-xl hover:bg-ocean-100 transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <Play size={16} fill="currentColor" /> Continue
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap (Right, spans 1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Your Roadmap</h2>
            <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">Frontend Path</span>
          </div>
          
          <div className="relative pl-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:w-0.5 before:bg-slate-100 space-y-8 flex-1">
            {roadmapSteps.map((step, idx) => (
              <div key={step.id} className="relative group cursor-default">
                <div className={`absolute -left-[30px] mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110 ${step.color}`}>
                  {step.status === 'Done' && <CheckCircle size={12} className="text-white" />}
                  {step.status === 'Locked' && <Lock size={10} className="text-slate-400" />}
                </div>
                
                <h3 className={`font-bold text-base ${step.status === 'Locked' ? 'text-slate-400' : 'text-slate-800'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs font-medium mt-1 ${
                  step.status === 'Done' ? 'text-ocean-600' : 
                  step.status === 'Active' ? 'text-teal-600' : 'text-slate-400'
                }`}>
                  {step.status}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/roadmap')}
            className="w-full mt-8 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            View Full Roadmap
          </button>
        </div>

      </div>
    </div>
  );
}
