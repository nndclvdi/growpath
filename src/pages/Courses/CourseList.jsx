import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { PlayCircle, Clock, BookOpen, Search, Filter } from 'lucide-react';

export default function CourseList() {
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();
  
  const { courses } = useAppContext();
  const dbCourses = courses || [];

  // ========================================================
  // [FIXED] LOGIKA ANTI-DUPLIKASI YANG BENAR UNTUK POSTGRESQL
  // ========================================================
  const uniqueCourses = dbCourses.filter(
    (item, index, self) =>
      index === self.findIndex((t) => {
        // Hanya membandingkan ID jika ID-nya memang benar-benar ada nilainya
        const isSameId = item.id && t.id === item.id;
        const isSameMongoId = item._id && t._id === item._id;
        return isSameId || isSameMongoId;
      })
  );

  // Logic filter kategori super aman
  const filteredCourses = uniqueCourses.filter(course => {
    if (activeTab === 'All') return true;
    
    const targetTab = activeTab.toLowerCase().trim();
    const courseCategory = (course.category || '').toLowerCase().trim();
    const courseStatus = (course.status || '').toLowerCase().trim();
    
    return courseCategory === targetTab || courseStatus === targetTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Course Library</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
            <Search size={18} />
            <span>[ Search Course ]</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            <span>[ Filter ]</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-4">
        {['All', 'Design', 'Frontend', 'Backend'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCourses.map(course => {
          const courseId = course.id || course._id;
          const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
          const courseImage = course.image && course.image !== '[null]' ? course.image : fallbackImage;

          return (
            <div key={courseId} className="bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              
              {/* THUMBNAIL AREA */}
              <div className="relative h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={courseImage} 
                  alt={course.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
                  <span className="text-slate-500 font-medium text-sm">[ Video Thumbnail ]</span>
                </div>
                <button 
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <PlayCircle size={60} className="text-white drop-shadow-lg" />
                </button>
              </div>
              
              {/* CONTENT AREA */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                    {course.category || 'General'}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-800 mb-2 line-clamp-1">{course.title}</h3>
                
                <p className="text-slate-400 text-sm font-medium mb-6 line-clamp-2">
                  {course.description && course.description !== '[null]' ? course.description : 'No description available for this course.'}
                </p>
                
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-8 mt-auto">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={18} /> {course.lessons || 0} Lessons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={18} /> {course.duration || 'Self-paced'}
                  </span>
                </div>
                
                <button 
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform active:scale-95"
                >
                  [ Enroll ]
                </button>
              </div>

            </div>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <p className="text-lg font-medium">No courses available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
