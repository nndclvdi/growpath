import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import API from '../../api/axios';

export default function ManageAssessments() {
  const {
    availableAssessments,
    addAssessment,
    deleteAssessment,
    updateAssessment,
    user
  } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultCategory = user?.role === 'Admin' ? (user?.interest || '') : '';

  const [assessmentData, setAssessmentData] = useState({
    title: '',
    category: defaultCategory,
    duration: '',
    description: ''
  });

  // PERBAIKAN: Menggunakan pengurutan yang konsisten agar semua data tampil
  const displayAssessments = Array.isArray(availableAssessments) 
    ? [...availableAssessments].sort((a, b) => (a.id || 0) - (b.id || 0)) 
    : [];

  const openAddForm = () => {
    setAssessmentData({ title: '', category: defaultCategory, duration: '', description: '' });
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    const itemId = item.id || item._id;
    setAssessmentData({
      title: item.title || '',
      category: item.category || '',
      duration: item.duration || '',
      description: item.description || ''
    });
    setIsEditing(true);
    setEditId(itemId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditId(null);
    setAssessmentData({ title: '', category: defaultCategory, duration: '', description: '' });
  };

  const handleSubmit = async () => {
    if (!assessmentData.title) {
      alert('Title is required!');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (isEditing) {
        response = await API.put(`/assessments/${editId}`, assessmentData);
      } else {
        response = await API.post('/assessments', assessmentData);
      }

      const data = response.data;
      
      if (isEditing) {
        const updatedPayload = { ...data, id: data.id || editId };
        if (updateAssessment) updateAssessment(updatedPayload); 
      } else {
        addAssessment(data);
      }

      closeForm();
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} assessment:`, error);
      alert(error.response?.data?.message || `Failed to save assessment.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;

    try {
      await API.delete(`/assessments/${id}`);
      deleteAssessment(id);
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete assessment.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-2">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Assessments</h1>
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-lg"
          >
            <Plus size={16} /> Add Assessment
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-xl relative">
          <button onClick={closeForm} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          <h2 className="font-bold text-white mb-4">{isEditing ? 'Edit Assessment' : 'Add Assessment'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input type="text" placeholder="Title" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={assessmentData.title} onChange={e => setAssessmentData({...assessmentData, title: e.target.value})} />
            <input type="text" placeholder="Category" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={assessmentData.category} onChange={e => setAssessmentData({...assessmentData, category: e.target.value})} />
            <input type="number" placeholder="Duration (mins)" className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={assessmentData.duration} onChange={e => setAssessmentData({...assessmentData, duration: e.target.value})} />
            <textarea placeholder="Description" rows="2" className="col-span-1 md:col-span-3 w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg" value={assessmentData.description} onChange={e => setAssessmentData({...assessmentData, description: e.target.value})} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 font-medium">
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
            </button>
            <button onClick={closeForm} className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs">Title</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs">Category</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs">Duration</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayAssessments.map((item) => (
              <tr key={item.id} className="hover:bg-[#0F172A] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                <td className="px-6 py-4 text-slate-300">{item.category}</td>
                <td className="px-6 py-4 text-slate-400">{item.duration} mins</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => openEditForm(item)} className="p-2 text-slate-400 hover:text-ocean-400"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}