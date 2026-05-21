import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, ChevronRight, Trash2, Eye } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AssessmentList() {
  const navigate = useNavigate();
  const { progress, deleteAssessmentHistory, availableAssessments } = useAppContext();

  // Past assessments from context
  const pastAssessments = progress.assessments || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Available Assessments Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Skill Assessments</h1>
            <p className="text-slate-500 mt-1">Test your knowledge and earn badges.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAssessments.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full mb-3 inline-block">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={16} /> {item.duration}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => navigate(`/assessments/take/${item.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-ocean-600 rounded-xl font-medium hover:bg-ocean-50 transition-colors"
                >
                  Start Now <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment History Section (CRUD) */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Your Assessment History</h2>
          <p className="text-slate-500 mt-1">Review your past scores and detailed breakdowns.</p>
        </div>

        {pastAssessments.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center">
            <p className="text-slate-500">You haven't taken any assessments yet. Pick one from above to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastAssessments.map((item) => (
              <div key={item.attemptId} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{item.title || 'Assessment'}</h3>
                  <button 
                    onClick={() => deleteAssessmentHistory(item.attemptId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete History"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="text-sm text-slate-500 mb-4">
                  Date: {new Date(item.date).toLocaleDateString()}
                </p>
                
                <div className="flex items-center gap-2 mb-6 mt-auto">
                  <Star size={20} className={item.score >= 80 ? 'text-teal-500' : item.score >= 60 ? 'text-ocean-500' : 'text-orange-500'} fill="currentColor" />
                  <span className="font-bold text-xl text-slate-700">{item.score}/100</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    onClick={() => navigate(`/assessments/result/${item.attemptId}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-ocean-50 text-ocean-600 rounded-xl font-medium hover:bg-ocean-100 transition-colors"
                  >
                    <Eye size={16} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
