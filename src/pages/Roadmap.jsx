import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Roadmap() {
  const { progress, toggleRoadmapItem } = useAppContext();

  const phases = [
    {
      id: 'phase1',
      title: 'Phase 1: Web Fundamentals',
      description: 'Master the core building blocks of the web.',
      items: [
        { id: 'p1_1', title: 'HTML Semantic Elements' },
        { id: 'p1_2', title: 'CSS Box Model & Flexbox' },
        { id: 'p1_3', title: 'JavaScript Basics (ES6+)' },
      ],
      isLocked: false,
    },
    {
      id: 'phase2',
      title: 'Phase 2: Frontend Frameworks',
      description: 'Learn modern UI development with React.',
      items: [
        { id: 'p2_1', title: 'React Components & Props' },
        { id: 'p2_2', title: 'State & Lifecycle' },
        { id: 'p2_3', title: 'React Hooks Deep Dive' },
      ],
      isLocked: false,
    },
    {
      id: 'phase3',
      title: 'Phase 3: Advanced Concepts',
      description: 'State management, routing, and performance.',
      items: [
        { id: 'p3_1', title: 'Redux / Context API' },
        { id: 'p3_2', title: 'Server-Side Rendering' },
      ],
      isLocked: true,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Learning Roadmap</h1>
        <p className="text-slate-500 mt-2 text-lg">Follow this path to become a Frontend Engineer.</p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-ocean-200 before:to-transparent">
        {phases.map((phase, index) => {
          const checklist = progress.roadmapChecklist[phase.id] || [];
          const progressPercent = phase.items.length > 0 ? Math.round((checklist.length / phase.items.length) * 100) : 0;
          
          return (
            <div key={phase.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md ${phase.isLocked ? 'bg-slate-200 text-slate-400' : 'bg-ocean-500 text-white'}`}>
                {phase.isLocked ? <Lock size={20} /> : <span className="font-bold">{index + 1}</span>}
              </div>
              
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border ${phase.isLocked ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-ocean-100 shadow-sm hover:shadow-md transition-shadow'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold ${phase.isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{phase.title}</h3>
                  {!phase.isLocked && <span className="text-xs font-bold text-ocean-600 bg-ocean-50 px-2 py-1 rounded">{progressPercent}%</span>}
                </div>
                <p className="text-slate-500 text-sm mb-4">{phase.description}</p>
                
                <div className="space-y-3">
                  {phase.items.map(item => {
                    const isChecked = checklist.includes(item.id);
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => !phase.isLocked && toggleRoadmapItem(phase.id, item.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${phase.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}`}
                      >
                        {isChecked ? (
                          <CheckCircle className="text-teal-500 shrink-0" size={20} />
                        ) : (
                          <Circle className="text-slate-300 shrink-0" size={20} />
                        )}
                        <span className={`text-sm font-medium ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
