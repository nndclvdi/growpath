import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Play, Maximize2, Volume2, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, markCourseCompleted, progress } = useAppContext();
  
  const course = courses.find(c => c.id === parseInt(id));

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-slate-500 mb-4">Course not found.</p>
        <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-ocean-600 text-white rounded-lg">Back to Courses</button>
      </div>
    );
  }

  const isCourseCompleted = progress.completedCourses.includes(course.id);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleLesson = (lessonId) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
      if (completedLessons.length + 1 === course.lessons?.length) {
        markCourseCompleted(course.id);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Video & Details) */}
        <div className="lg:col-span-2 space-y-6">
          
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-ocean-50 hover:text-ocean-600 hover:border-ocean-200 font-bold transition-all shadow-sm w-fit group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Courses
          </button>

          {/* Video Player Placeholder High Fidelity */}
          <div className="bg-slate-900 rounded-2xl aspect-video relative flex flex-col justify-between overflow-hidden shadow-2xl group">
            {!isPlaying ? (
              <>
                <img 
                  src={course.image || "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200"} 
                  alt="Course Cover" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="flex-1 flex items-center justify-center relative z-10">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 bg-ocean-500 text-white rounded-full flex items-center justify-center shadow-[0_0_0_8px_rgba(14,165,233,0.3)] hover:scale-110 hover:bg-ocean-400 transition-all backdrop-blur-sm"
                  >
                    <Play size={32} className="ml-2" fill="currentColor" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-900">
                <span className="text-slate-600 font-mono text-sm tracking-widest">[ Video Playing... ]</span>
              </div>
            )}
            
            {/* Custom Video Controls Bar */}
            <div className="h-14 bg-gradient-to-t from-slate-900 to-transparent px-4 flex items-center gap-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="text-white hover:text-ocean-400 transition-colors">
                <Play size={20} fill="currentColor" />
              </button>
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                <div className="h-full bg-ocean-500 w-1/3 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-white tracking-wider">12:30 / 45:00</span>
              <div className="flex items-center gap-3 text-white">
                <Volume2 size={18} className="cursor-pointer hover:text-ocean-400" />
                <Settings size={18} className="cursor-pointer hover:text-ocean-400" />
                <Maximize2 size={18} className="cursor-pointer hover:text-ocean-400" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-ocean-50 text-ocean-600 text-sm font-bold rounded-full">{course.category}</span>
              {isCourseCompleted && (
                <span className="px-3 py-1 bg-teal-50 text-teal-600 text-sm font-bold rounded-full flex items-center gap-1">
                  <CheckCircle2 size={16} /> Completed
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800">{course.title}</h1>
            
            <div className="flex items-center gap-4 mt-4 mb-8 pb-8 border-b border-slate-100">
              <img src={`https://ui-avatars.com/api/?name=${course.author}&background=0ea5e9&color=fff`} alt={course.author} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold text-slate-800">{course.author}</p>
                <p className="text-sm text-slate-500">Instructor • Last updated Oct 2023</p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-4">Course Description</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {course.description || "Learn the principles of user interface and user experience design from scratch. We will cover color theory, typography, layout, and how to create scalable design systems."}
            </p>
          </div>

        </div>

        {/* Right Column (Course Content) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-2">
                <span className="bg-white px-2 py-1 rounded border border-slate-200">{course.lessons?.length || 0} Lessons</span>
                <span>•</span>
                <span>{course.duration}</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {course.lessons && course.lessons.map((lesson, idx) => {
                const isChecked = completedLessons.includes(lesson.id);
                return (
                  <div 
                    key={lesson.id} 
                    className={`p-5 flex items-start gap-4 transition-all cursor-pointer border-l-4 ${
                      isChecked ? 'bg-slate-50 border-teal-500' : 'hover:bg-slate-50 border-transparent hover:border-ocean-300'
                    }`}
                    onClick={() => toggleLesson(lesson.id)}
                  >
                    <div className="mt-0.5">
                      {isChecked ? (
                        <CheckCircle2 size={24} className="text-teal-500" fill="currentColor" color="white" />
                      ) : (
                        <Circle size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-base ${isChecked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {idx + 1}. {lesson.title}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
                        <Play size={10} fill="currentColor" /> {lesson.duration}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(!course.lessons || course.lessons.length === 0) && (
                <div className="p-8 text-center text-slate-500">
                  No lessons available for this course yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
