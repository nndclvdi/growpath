import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import API from '../../api/axios';

export default function ManageCourses() {
  const { courses, addCourse, deleteCourse, updateCourse, user } = useAppContext();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inisialisasi state sesuai kolom database
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    category: '',
    duration: '',
    lessons: 0
  });

  const openAddForm = () => {
    setCourseData({ title: '', description: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', category: '', duration: '', lessons: 0 });
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (course) => {
    setCourseData({
      title: course.title || '',
      description: course.description || '',
      image: course.image || '',
      category: course.category || '',
      duration: course.duration || '',
      lessons: course.lessons || 0
    });
    setIsEditing(true);
    setEditId(course.id || course._id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!courseData.title) return alert('Course Title is required!');

    try {
      setLoading(true);
      const response = isEditing 
        ? await API.put(`/courses/${editId}`, courseData)
        : await API.post('/courses', courseData);

      if (isEditing) updateCourse(response.data);
      else addCourse(response.data);

      closeForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
        {!isFormOpen && (
          <button onClick={openAddForm} className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700">
            <Plus size={16} /> Add New Course
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 relative">
          <button onClick={closeForm} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
          <h2 className="font-bold text-white mb-4">{isEditing ? 'Edit' : 'Add'} Course</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Title" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={courseData.title} onChange={e => setCourseData({...courseData, title: e.target.value})} />
            <input type="text" placeholder="Image URL" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={courseData.image} onChange={e => setCourseData({...courseData, image: e.target.value})} />
            <input type="text" placeholder="Category" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={courseData.category} onChange={e => setCourseData({...courseData, category: e.target.value})} />
            <input type="text" placeholder="Duration (e.g. 10 hours)" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={courseData.duration} onChange={e => setCourseData({...courseData, duration: e.target.value})} />
            <input type="number" placeholder="Number of Lessons" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={courseData.lessons} onChange={e => setCourseData({...courseData, lessons: e.target.value})} />
            <textarea placeholder="Description" rows="2" className="md:col-span-2 w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={courseData.description} onChange={e => setCourseData({...courseData, description: e.target.value})} />
          </div>
          <button onClick={handleSubmit} className="px-6 py-2 bg-ocean-600 text-white rounded-lg">{isEditing ? 'Update' : 'Save'}</button>
        </div>
      )}

      {/* Tabel */}
      <table className="w-full text-left text-sm bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden">
        <thead className="bg-[#0F172A]">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Lessons</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {courses?.map(c => (
            <tr key={c.id}>
              <td className="px-6 py-4 font-bold text-white">{c.title}</td>
              <td className="px-6 py-4 text-slate-300">{c.category}</td>
              <td className="px-6 py-4 text-slate-300">{c.duration}</td>
              <td className="px-6 py-4 text-slate-300">{c.lessons}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openEditForm(c)} className="text-slate-400 hover:text-ocean-400 mr-3"><Edit2 size={16}/></button>
                <button onClick={() => deleteCourse(c.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}