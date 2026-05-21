import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { Target, Zap, Award, Star } from 'lucide-react';

export default function Progress() {
  const activityData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 3 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 5 },
    { name: 'Sun', hours: 3.5 },
  ];

  const skillData = [
    { subject: 'React', A: 90, fullMark: 100 },
    { subject: 'CSS', A: 85, fullMark: 100 },
    { subject: 'JS', A: 75, fullMark: 100 },
    { subject: 'Design', A: 60, fullMark: 100 },
    { subject: 'Node', A: 40, fullMark: 100 },
    { subject: 'Testing', A: 65, fullMark: 100 },
  ];

  const badges = [
    { id: 1, title: 'CSS Master', date: 'Yesterday', icon: Award, color: 'text-teal-500', bg: 'bg-teal-100' },
    { id: 2, title: 'React Pro', date: '3 days ago', icon: Star, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 3, title: 'Early Bird', date: '1 week ago', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { id: 4, title: 'First Steps', date: '2 weeks ago', icon: Target, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  // Custom Tooltip for BarChart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-sm font-medium border border-slate-700">
          <p className="mb-1 text-slate-300">{label}</p>
          <p className="text-teal-400">{`${payload[0].value} Hours`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Learning Progress</h1>
        <p className="text-slate-500 mt-2 text-lg">Track your activity and skill growth over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Activity Chart */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <div className="w-2 h-6 bg-ocean-500 rounded-full"></div>
            Activity Chart
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
            Skill Radar
          </h2>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px] -mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <Radar name="Skills" dataKey="A" stroke="#0ea5e9" strokeWidth={3} fill="#0ea5e9" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
          Recent Achievements
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div key={badge.id} className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${badge.bg} ${badge.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <badge.icon size={32} />
              </div>
              <h3 className="font-bold text-slate-800">{badge.title}</h3>
              <p className="text-xs font-medium text-slate-500 mt-1.5 bg-white px-2 py-1 rounded-full border border-slate-200">
                Unlocked: {badge.date}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
