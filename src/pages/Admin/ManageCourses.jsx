import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X } from 'lucide-react';

export default function ManageCourses() {
  const { courses, addCourse, deleteCourse, updateCourse, user } = useAppContext();
  
  // =========================
  // STATE MANAGEMENT
  // =========================
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
  });

  const displayCourses = courses || [];
  const API_URL = 'http://localhost:5000/api/courses';

  // =========================
  // OPEN/CLOSE FORM LOGIC
  // =========================
  const openAddForm = () => {
    setCourseData({ title: '', description: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' });
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (course) => {
    const courseId = course.id || course._id;
    setCourseData({
      title: course.title || '',
      description: course.description || '',
      image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
    });
    setIsEditing(true);
    setEditId(courseId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditId(null);
    setCourseData({ title: '', description: '', image: '' });
  };

  // =========================
  // SAVE / UPDATE LOGIC
  // =========================
  const handleSubmit = async () => {
    if (!courseData.title) {
      alert('Course Title is required!');
      return;
    }

    try {
      setLoading(true);
      const url = isEditing ? `${API_URL}/${editId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (isEditing) {
        const updatedPayload = {
          ...data,
          id: data.id || data._id || editId,
          _id: data._id || data.id || editId
        };
        if (updateCourse) updateCourse(updatedPayload);
      } else {
        if (addCourse) addCourse(data);
      }

      closeForm();
    } catch (error) {
      console.error(`Failed to save course:`, error);
      alert('Failed to save course. Make sure you are logged in as Admin.');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE LOGIC
  // =========================
  const handleDelete = async (id) => {
    if (!id) return alert("Error: ID data tidak ditemukan!");
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (deleteCourse) deleteCourse(id);
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete course.');
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Career Paths & Courses</h1>
        {!isFormOpen && (
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-lg shadow-ocean-500/20"
          >
            <Plus size={16} /> Add New Course
          </button>
        )}
      </div>

      {/* FORM COMPONENT */}
      {isFormOpen && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm relative">
          <button onClick={closeForm} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          
          <h2 className="font-bold text-white mb-4">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Course Title" 
              className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-ocean-500" 
              value={courseData.title} 
              onChange={e => setCourseData({...courseData, title: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Image URL (Optional)" 
              className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-ocean-500" 
              value={courseData.image} 
              onChange={e => setCourseData({...courseData, image: e.target.value})} 
            />
            <div className="md:col-span-2">
              <textarea 
                placeholder="Course Description" 
                rows="3" 
                className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-ocean-500 resize-none"
                value={courseData.description}
                onChange={e => setCourseData({...courseData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 font-medium disabled:opacity-50">
              {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Save Course')}
            </button>
            <button onClick={closeForm} className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-medium">Cancel</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-max">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Course Info</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs max-w-sm">Description</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayCourses.map(course => {
              const courseId = course.id || course._id;
              return (
                <tr key={courseId} className="hover:bg-[#0F172A] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={course.image} alt={course.title} className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900" />
                    <div className="font-bold text-white">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={course.description}>
                    {course.description || '-'}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-end">
                    <button onClick={() => openEditForm(course)} className="p-2 text-slate-400 hover:text-ocean-400 hover:bg-ocean-500/10 rounded-lg transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(courseId)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {displayCourses.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                      <Trash2 size={24} className="text-slate-600" />
                    </div>
                    <p>No courses available.</p>
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
