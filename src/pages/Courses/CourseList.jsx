import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Star, Users } from 'lucide-react';

export default function CourseList() {
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const courses = [
    { id: 1, title: 'UI/UX Design Masterclass', author: 'Sarah Drasner', duration: '12h 30m', rating: 4.9, students: '12k', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600', category: 'Design', status: 'In Progress' },
    { id: 2, title: 'Advanced React Patterns', author: 'Kent C. Dodds', duration: '8h 15m', rating: 4.8, students: '8k', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600', category: 'Frontend', status: 'Completed' },
    { id: 3, title: 'Node.js Backend Architecture', author: 'Ryan Dahl', duration: '15h 00m', rating: 4.7, students: '5k', image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=600', category: 'Backend', status: 'Not Started' },
  ];

  const filteredCourses = activeTab === 'All' ? courses : courses.filter(c => c.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Course Library</h1>
          <p className="text-slate-500 mt-1">Explore our collection of premium courses.</p>
        </div>
        
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
          {['All', 'In Progress', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-ocean-50 text-ocean-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-ocean-700 text-xs font-bold rounded-full shadow-sm">
                  {course.category}
                </span>
              </div>
              <button 
                onClick={() => navigate(`/courses/${course.id}`)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PlayCircle size={48} className="text-white" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4">by {course.author}</p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6 mt-auto">
                <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor" /> {course.rating}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {course.students}</span>
              </div>
              
              <button 
                onClick={() => navigate(`/courses/${course.id}`)}
                className="w-full py-2.5 bg-slate-50 text-ocean-600 rounded-xl font-semibold hover:bg-ocean-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
