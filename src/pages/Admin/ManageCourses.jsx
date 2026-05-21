import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function ManageCourses() {
  const { courses, addCourse, deleteCourse, user } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  
  // Default category is based on Admin interest unless SuperAdmin
  const defaultCategory = user.role === 'Admin' ? user.interest : '';
  const [newCourse, setNewCourse] = useState({ title: '', author: '', duration: '', category: defaultCategory, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' });

  // Filter courses based on RBAC
  const displayCourses = user.role === 'SuperAdmin' ? courses : courses.filter(c => c.category === user.interest);

  const handleAdd = () => {
    if (newCourse.title && newCourse.author) {
      addCourse({ ...newCourse, rating: 0, students: '0', lessons: [] });
      setIsAdding(false);
      setNewCourse({ title: '', author: '', duration: '', category: defaultCategory, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Career Paths & Courses</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-lg shadow-ocean-500/20"
        >
          <Plus size={16} /> Add New Course
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm">
          <h2 className="font-bold text-white mb-4">Add Course {user.role === 'Admin' && <span className="text-sm font-normal text-slate-400 ml-2">(Auto-assigned to {user.interest})</span>}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Course Title" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-ocean-500" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
            <input type="text" placeholder="Author Name" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-ocean-500" value={newCourse.author} onChange={e => setNewCourse({...newCourse, author: e.target.value})} />
            <input 
              type="text" 
              placeholder="Category" 
              className={`border border-slate-700 p-2 rounded focus:outline-none focus:border-ocean-500 ${user.role === 'Admin' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-[#0F172A] text-white'}`} 
              value={newCourse.category} 
              onChange={e => setNewCourse({...newCourse, category: e.target.value})} 
              disabled={user.role === 'Admin'}
            />
            <input type="text" placeholder="Duration (e.g. 5h 30m)" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-ocean-500" value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-4 py-2 bg-ocean-600 text-white rounded hover:bg-ocean-700 font-medium">Save Course</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Course Name</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Category</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Lessons</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayCourses.map(course => (
              <tr key={course.id} className="hover:bg-[#0F172A] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{course.title}</div>
                  <div className="text-slate-500 text-xs mt-1">by {course.author}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700">{course.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-400">{course.lessons?.length || 0} lessons</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-ocean-400 hover:bg-ocean-500/10 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteCourse(course.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {displayCourses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                      <Trash2 size={24} className="text-slate-600" />
                    </div>
                    <p>No courses available in this category.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
