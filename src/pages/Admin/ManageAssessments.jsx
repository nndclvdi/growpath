import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, X } from 'lucide-react';

export default function ManageAssessments() {
  const {
    availableAssessments,
    addAssessment,
    deleteAssessment,
    updateAssessment,
    user
  } = useAppContext();

  // =========================
  // STATE MANAGEMENT
  // =========================
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

  // Melakukan filter otomatis terhadap duplicate ID ganda (misal ID 13) sebelum dirender
  const displayAssessments = (availableAssessments || []).filter(
    (item, index, self) =>
      index === self.findIndex((t) => (t.id === item.id || t._id === item._id))
  );
  
  // Endpoint Backend
  const API_URL = 'http://localhost:5000/api/assessments';

  // =========================
  // OPEN/CLOSE FORM
  // =========================
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

  // =========================
  // SAVE / UPDATE ASSESSMENT
  // =========================
  const handleSubmit = async () => {
    if (!assessmentData.title) {
      alert('Title is required!');
      return;
    }

    try {
      setLoading(true);

      const url = isEditing ? `${API_URL}/${editId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (isEditing) {
        // Normalisasi payload ID agar serasi saat dicocokkan di state AppContext
        const updatedPayload = {
          ...data,
          id: data.id || data._id || editId,
          _id: data._id || data.id || editId
        };
        if (updateAssessment) updateAssessment(updatedPayload); 
      } else {
        addAssessment(data);
      }

      closeForm();

    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} assessment:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'add'} assessment. Make sure you are logged in as Admin.`);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE ASSESSMENT
  // =========================
  const handleDelete = async (id) => {
    if (!id) return alert("Error: ID data tidak ditemukan!");

    if (!window.confirm("Are you sure you want to delete this assessment?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      deleteAssessment(id);

    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete assessment. Make sure you are logged in as Admin.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Assessments</h1>
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-lg shadow-ocean-500/20"
          >
            <Plus size={16} />
            Add Assessment
          </button>
        )}
      </div>

      {/* FORM ADD / EDIT */}
      {isFormOpen && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm relative">
          <button 
            onClick={closeForm}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <h2 className="font-bold text-white mb-4 flex items-center">
            {isEditing ? 'Edit Assessment' : 'Add Assessment'}
            {user?.role === 'Admin' && !isEditing && (
              <span className="text-sm font-normal text-slate-400 ml-2">
                (Auto-assigned to {user?.interest})
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1">
              <input
                type="text"
                placeholder="Assessment Title"
                className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-ocean-500"
                value={assessmentData.title}
                onChange={e => setAssessmentData({ ...assessmentData, title: e.target.value })}
              />
            </div>

            <div className="col-span-1">
              <input
                type="text"
                placeholder="Category"
                className={`w-full border border-slate-700 p-2.5 rounded-lg focus:outline-none focus:border-ocean-500 ${
                  user?.role === 'Admin'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-[#0F172A] text-white'
                }`}
                value={assessmentData.category}
                onChange={e => setAssessmentData({ ...assessmentData, category: e.target.value })}
                disabled={user?.role === 'Admin'}
              />
            </div>

            <div className="col-span-1">
              <input
                type="number"
                placeholder="Duration (minutes, e.g. 30)"
                className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-ocean-500"
                value={assessmentData.duration}
                onChange={e => setAssessmentData({ ...assessmentData, duration: e.target.value })}
              />
            </div>

            <div className="col-span-1 md:col-span-3">
              <textarea
                placeholder="Description"
                rows="3"
                className="w-full border border-slate-700 bg-[#0F172A] text-white p-2.5 rounded-lg focus:outline-none focus:border-ocean-500 resize-none"
                value={assessmentData.description}
                onChange={e => setAssessmentData({ ...assessmentData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Assessment' : 'Save Assessment')}
            </button>
            <button
              onClick={closeForm}
              className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-max">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Title</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Category</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Duration</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs max-w-xs">Description</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayAssessments.map((item, index) => {
              const itemId = item.id || item._id;
              
              const durationString = String(item.duration || '');
              const hasText = durationString.toLowerCase().includes('min') || durationString.toLowerCase().includes('m');
              const displayDuration = hasText ? durationString : `${durationString} mins`;

              return (
                <tr key={itemId || index} className="hover:bg-[#0F172A] transition-colors">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                    {item.duration ? displayDuration : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate" title={item.description}>
                    {item.description || '-'}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-end">
                    <button
                      onClick={() => openEditForm(item)}
                      className="p-2 text-slate-400 hover:text-ocean-400 hover:bg-ocean-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(itemId)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {(!displayAssessments || displayAssessments.length === 0) && (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                      <Trash2 size={24} className="text-slate-600" />
                    </div>
                    <p>No assessments available.</p>
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
