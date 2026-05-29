import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Circle, Lock, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import API from '../api/axios';

export default function Roadmap() {
  const { user, progress, toggleRoadmapItem } = useAppContext();
  const [phases, setPhases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await API.get('/roadmaps');
        const data = response.data;
        
        const formatted = data.map((item, index) => ({
          id: `phase${index + 1}`,
          dbId: item.id, 
          title: item.title,
          description: item.description,
          items: [
            { id: `p${index + 1}_1`, title: item.category },
            { id: `p${index + 1}_2`, title: item.level },
          ],
        }));
        setPhases(formatted);
      } catch (error) {
        console.error("Error Fetching Roadmaps:", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleToggleTask = async (phaseId, itemId) => {
    toggleRoadmapItem(phaseId, itemId);

    if (user?.id) {
      try {
        await API.post('/roadmaps/progress', {
          userId: user.id,
          phaseId: phaseId,
          taskId: itemId
        });
      } catch (error) {
        console.error("Gagal sinkronisasi progress roadmap ke server:", error.response?.data?.message || error.message);
      }
    }
  };

  const processedPhases = useMemo(() => {
    return phases.map((phase, index) => {
      // PERBAIKAN 1: Tambahkan optional chaining (?.)
      const checklist = progress?.roadmapChecklist?.[phase.id] || [];
      
      const isCompleted = phase.items.length > 0 && phase.items.every(item => checklist.includes(item.id));

      let currentProgress = Math.round((checklist.length / phase.items.length) * 100);
      if (currentProgress > 100 || isCompleted) currentProgress = 100;

      if (index === 0) {
        return {
          ...phase,
          isLocked: false,
          progress: currentProgress,
          isCompleted,
        };
      }

      const prev = phases[index - 1];
      // PERBAIKAN 2: Tambahkan optional chaining (?.)
      const prevChecklist = progress?.roadmapChecklist?.[prev?.id] || [];
      
      const prevCompleted = prev?.items?.length > 0 && prev.items.every(item => prevChecklist.includes(item.id));

      return {
        ...phase,
        isLocked: !prevCompleted,
        progress: currentProgress,
        isCompleted,
      };
    });
  }, [phases, progress]);

  const totalXP = useMemo(() => {
    let xp = 0;
    processedPhases.forEach((phase) => {
      // PERBAIKAN 3: Tambahkan optional chaining (?.)
      const checklist = progress?.roadmapChecklist?.[phase.id] || [];
      xp += checklist.length * 10;
    });
    return xp;
  }, [processedPhases, progress]);

  if (isLoading) return <div className="text-center py-20 font-medium text-slate-500">Memuat Roadmap...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900">Your Learning Roadmap</h1>
        <p className="text-slate-500 mt-3 text-lg">Follow this path to master your skills step by step</p>
        <div className="mt-4 flex justify-center items-center gap-2 text-sm font-semibold text-slate-700 bg-yellow-50 w-max mx-auto px-4 py-2 rounded-full border border-yellow-100 shadow-sm">
          <Zap className="text-yellow-500" fill="currentColor" size={18} />
          <span>Total XP: {totalXP}</span>
        </div>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="relative space-y-12 ml-4 md:ml-12">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 -z-10" />

        {processedPhases.map((phase, index) => {
          // PERBAIKAN 4: Tambahkan optional chaining (?.)
          const checklist = progress?.roadmapChecklist?.[phase.id] || [];
          
          let themeClass = "border-slate-200 bg-white";
          let iconClass = "bg-white text-slate-400 border-slate-200";
          let badge = { text: "Locked", class: "bg-slate-100 text-slate-500" };

          if (!phase.isLocked) {
            if (phase.isCompleted) {
              themeClass = "border-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.1)]";
              iconClass = "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.4)]";
              badge = { text: "Completed", class: "bg-emerald-500 text-white" };
            } else {
              themeClass = "border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]";
              iconClass = "bg-indigo-600 text-white border-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]";
              badge = { text: "In Progress", class: "bg-indigo-600 text-white" };
            }
          }

          return (
            <div key={phase.id} className={`relative flex gap-8 items-start ${phase.isLocked ? 'opacity-60' : ''}`}>
              
              {/* STATUS ICON (LEFT) */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 z-10 shrink-0 transition-all duration-300 ${iconClass}`}>
                {phase.isLocked ? <Lock size={20} /> : <CheckCircle size={24} />}
              </div>

              {/* CARD CONTENT */}
              <div className={`flex-1 p-8 rounded-3xl border-2 transition-all duration-300 ${themeClass}`}>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Step {index + 1}: {phase.title}
                  </h3>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>

                <p className="text-slate-500 mb-4">{phase.description}</p>
                <p className="text-slate-400 text-sm font-medium mb-6">{phase.items.length} Modules</p>

                {/* TASK LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {phase.items.map((item) => {
                    const isChecked = checklist.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => !phase.isLocked && handleToggleTask(phase.id, item.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all ${
                          phase.isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 hover:border-slate-100'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle className="text-indigo-500" size={18} />
                        ) : (
                          <Circle className="text-slate-300" size={18} />
                        )}
                        <span className={`text-sm ${isChecked ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* BUTTON ACTION */}
                {!phase.isLocked && (
                  <button 
                    onClick={() => navigate(`/dashboard/roadmap/${phase.id}`)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                      phase.isCompleted 
                      ? 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    }`}
                  >
                    {phase.isCompleted ? 'Review' : 'Continue'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}