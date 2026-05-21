import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from 'recharts';

import { 
  Target, 
  Zap, 
  Award, 
  Star, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Trophy 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Progress() {
  const { progress } = useAppContext();

  // Data Dummy untuk Chart (Bisa disesuaikan dengan logic DB nantinya)
  const activityData = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 3.5 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4.5 },
    { name: 'Fri', hours: 2 },
    { name: 'Sat', hours: 3.5 },
    { name: 'Sun', hours: 3 },
  ];

  const skillData = [
    { subject: 'React', A: 80, fullMark: 100 },
    { subject: 'JavaScript', A: 70, fullMark: 100 },
    { subject: 'CSS', A: 90, fullMark: 100 },
    { subject: 'TypeScript', A: 60, fullMark: 100 },
    { subject: 'Node.js', A: 50, fullMark: 100 },
    { subject: 'Testing', A: 65, fullMark: 100 },
  ];

  // Statistik Dinamis dari Database/Context
  const stats = [
    { id: 1, label: 'Total Learning Hours', value: '36h', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 2, label: 'Current Streak', value: '12 Days', icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 3, label: 'Completed Courses', value: progress?.completedCourses?.length || 0, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 4, label: 'Achievements', value: '15', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const badges = [
    { id: 1, title: 'Badge Title', icon: Award, gradient: 'from-orange-400 to-orange-600' },
    { id: 2, title: 'Badge Title', icon: Star, gradient: 'from-indigo-400 to-indigo-600' },
    { id: 3, title: 'Badge Title', icon: Target, gradient: 'from-cyan-400 to-cyan-600' },
    { id: 4, title: 'Badge Title', icon: Zap, gradient: 'from-emerald-400 to-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-slate-800">Learning Progress</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-indigo-600 font-bold">
            <TrendingUp size={18} />
            <h2>Activity Chart</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-indigo-600 font-bold">
            <Target size={18} />
            <h2>Skill Radar</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACHIEVEMENTS */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-8 text-indigo-600 font-bold">
          <Award size={20} />
          <h2>Recent Achievements</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform cursor-pointer`}>
                <badge.icon size={40} className="text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{badge.title}</h3>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}