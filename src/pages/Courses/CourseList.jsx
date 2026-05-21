import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, Search, Filter } from 'lucide-react';

export default function CourseList() {
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  // Menyesuaikan data agar sesuai dengan tampilan lessons di gambar
  const courses = [
    { id: 1, title: 'UI/UX Design Masterclass', author: 'Sarah Drasner', duration: '5h 30m', lessons: 10, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600', category: 'Design', status: 'In Progress' },
    { id: 2, title: 'Advanced React Patterns', author: 'Kent C. Dodds', duration: '7h 15m', lessons: 15, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600', category: 'Frontend', status: 'Completed' },
    { id: 3, title: 'Node.js Backend Architecture', author: 'Ryan Dahl', duration: '6h 20m', lessons: 12, image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=600', category: 'Backend', status: 'Not Started' },
  ];

  const filteredCourses = activeTab === 'All' ? courses : courses.filter(c => c.status === activeTab);

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
        {['All', 'In Progress', 'Completed'].map(tab => (
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
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            {/* THUMBNAIL AREA */}
            <div className="relative h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
                <span className="text-slate-500 font-medium text-sm">[ Video Thumbnail ]</span>
              </div>
              <button 
                onClick={() => navigate(`/courses/${course.id}`)}
                className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PlayCircle size={60} className="text-white drop-shadow-lg" />
              </button>
            </div>
            
            {/* CONTENT AREA */}
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-extrabold text-slate-800 mb-1">{course.title}</h3>
              <p className="text-slate-400 text-sm font-medium mb-4">Instructor Name</p>
              
              <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-8 mt-auto">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={18} /> {course.lessons} Lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={18} /> {course.duration}
                </span>
              </div>
              
              <button 
                onClick={() => navigate(`/courses/${course.id}`)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform active:scale-95"
              >
                [ Enroll ]
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}