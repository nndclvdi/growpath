import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function ManageAssessments() {
  const { availableAssessments, addAssessment, deleteAssessment, user } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  
  // Default category is based on Admin interest unless SuperAdmin
  const defaultCategory = user.role === 'Admin' ? user.interest : '';
  const [newAssessment, setNewAssessment] = useState({ title: '', category: defaultCategory, duration: '' });

  // Filter assessments based on RBAC
  const displayAssessments = user.role === 'SuperAdmin' ? availableAssessments : availableAssessments.filter(a => a.category === user.interest);

  const handleAdd = () => {
    if (newAssessment.title) {
      addAssessment(newAssessment);
      setIsAdding(false);
      setNewAssessment({ title: '', category: defaultCategory, duration: '' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Assessments</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors shadow-lg shadow-ocean-500/20"
        >
          <Plus size={16} /> Add Assessment
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm">
          <h2 className="font-bold text-white mb-4">Add Assessment {user.role === 'Admin' && <span className="text-sm font-normal text-slate-400 ml-2">(Auto-assigned to {user.interest})</span>}</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input type="text" placeholder="Assessment Title" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-ocean-500" value={newAssessment.title} onChange={e => setNewAssessment({...newAssessment, title: e.target.value})} />
            <input 
              type="text" 
              placeholder="Category" 
              className={`border border-slate-700 p-2 rounded focus:outline-none focus:border-ocean-500 ${user.role === 'Admin' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-[#0F172A] text-white'}`} 
              value={newAssessment.category} 
              onChange={e => setNewAssessment({...newAssessment, category: e.target.value})} 
              disabled={user.role === 'Admin'}
            />
            <input type="text" placeholder="Duration (e.g. 30 mins)" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-ocean-500" value={newAssessment.duration} onChange={e => setNewAssessment({...newAssessment, duration: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-4 py-2 bg-ocean-600 text-white rounded hover:bg-ocean-700 font-medium">Save Assessment</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Title</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Category</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Duration</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayAssessments.map(item => (
              <tr key={item.id} className="hover:bg-[#0F172A] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700">{item.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-400">{item.duration}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-ocean-400 hover:bg-ocean-500/10 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteAssessment(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {displayAssessments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                      <Trash2 size={24} className="text-slate-600" />
                    </div>
                    <p>No assessments available in this category.</p>
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
