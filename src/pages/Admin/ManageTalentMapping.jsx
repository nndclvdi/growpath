import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Plus, Edit2, Upload } from 'lucide-react';

export default function ManageTalentMapping() {
  const { talentMappings, addTalentMapping, deleteTalentMapping } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef(null);
  
  const [newTalent, setNewTalent] = useState({
    name: '',
    role: '',
    department: '',
    performance: 'Medium',
    potential: 'Medium',
    image: ''
  });

  const handleAdd = () => {
    if (newTalent.name && newTalent.role) {
      addTalentMapping({ 
        ...newTalent, 
        image: newTalent.image || 'https://via.placeholder.com/150' 
      });
      setIsAdding(false);
      setNewTalent({ name: '', role: '', department: '', performance: 'Medium', potential: 'Medium', image: '' });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewTalent({ ...newTalent, image: imageUrl });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Talent Mapping</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> Add New Talent
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm flex gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden bg-[#0F172A]">
              {newTalent.image ? (
                <img src={newTalent.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload size={24} className="text-slate-500" />
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
            >
              Upload Photo
            </button>
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-white mb-4">Talent Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-blue-500" value={newTalent.name} onChange={e => setNewTalent({...newTalent, name: e.target.value})} />
              <input type="text" placeholder="Role / Title" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-blue-500" value={newTalent.role} onChange={e => setNewTalent({...newTalent, role: e.target.value})} />
              <input type="text" placeholder="Department" className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-blue-500" value={newTalent.department} onChange={e => setNewTalent({...newTalent, department: e.target.value})} />
              
              <div className="flex gap-4">
                <select 
                  className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-blue-500 w-full"
                  value={newTalent.performance}
                  onChange={e => setNewTalent({...newTalent, performance: e.target.value})}
                >
                  <option value="Low">Low Performance</option>
                  <option value="Medium">Medium Performance</option>
                  <option value="High">High Performance</option>
                </select>

                <select 
                  className="border border-slate-700 bg-[#0F172A] text-white p-2 rounded focus:outline-none focus:border-blue-500 w-full"
                  value={newTalent.potential}
                  onChange={e => setNewTalent({...newTalent, potential: e.target.value})}
                >
                  <option value="Low">Low Potential</option>
                  <option value="Medium">Medium Potential</option>
                  <option value="High">High Potential</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Save Talent</button>
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0F172A] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Employee</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Department</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">9-Box Metrics</th>
              <th className="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {talentMappings.map(talent => (
              <tr key={talent.id} className="hover:bg-[#0F172A] transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                    <img src={talent.image || 'https://via.placeholder.com/150'} alt={talent.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{talent.name}</div>
                    <div className="text-slate-500 text-xs mt-1">{talent.role}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {talent.department}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-800 text-xs font-medium rounded-md border border-slate-700">Perf: {talent.performance}</span>
                    <span className="px-2 py-1 bg-slate-800 text-xs font-medium rounded-md border border-slate-700">Pot: {talent.potential}</span>
                  </div>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteTalentMapping(talent.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {talentMappings.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <p>No talent mapping records found.</p>
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
