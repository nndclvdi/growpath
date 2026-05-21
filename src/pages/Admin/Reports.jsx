import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Users, BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';

export default function Reports() {
  const { courses, availableAssessments, talentMappings } = useAppContext();

  const stats = [
    { title: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Assessments', value: availableAssessments.length, icon: ClipboardCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'Mapped Talents', value: talentMappings.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Completion Rate', value: '84%', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Platform Reports & Analytics</h1>
        <button className="px-4 py-2 bg-[#1E293B] text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors shadow-sm">
          Export Report (CSV)
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm h-80 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="text-blue-400" size={20} />
            <h3 className="font-bold text-white">Course Enrollments (Last 30 Days)</h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-slate-700 rounded-lg bg-[#0F172A]">
            <p className="text-slate-500">Chart rendering area...</p>
          </div>
        </div>

        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-sm h-80 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-400" size={20} />
            <h3 className="font-bold text-white">Assessment Pass Rates</h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-slate-700 rounded-lg bg-[#0F172A]">
             <p className="text-slate-500">Chart rendering area...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
