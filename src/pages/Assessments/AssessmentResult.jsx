import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AssessmentResult() {
  const { id } = useParams(); // attemptId
  const navigate = useNavigate();
  const { progress } = useAppContext();

  // Find the specific assessment attempt
  const assessment = progress.assessments.find(a => a.attemptId === id);

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-slate-500 mb-4">Assessment not found.</p>
        <button 
          onClick={() => navigate('/assessments')}
          className="px-4 py-2 bg-ocean-600 text-white rounded-lg"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const { score, date, attemptId, breakdown, recommendation, title } = assessment;
  
  // Format Date to Oct 12, 2023 format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  let message = "Good Effort!";
  let messageColor = "text-ocean-600";
  let circleColor = "text-ocean-500 border-ocean-500";
  
  if (score >= 80) {
    message = "Excellent!";
    messageColor = "text-teal-600";
    circleColor = "text-teal-500 border-teal-500";
  } else if (score < 60) {
    message = "Needs Improvement";
    messageColor = "text-orange-500";
    circleColor = "text-orange-500 border-orange-500";
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Top Bar */}
      <div>
        <button 
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Assessments
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card - Score */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                className="text-slate-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
              <circle
                className={circleColor}
                strokeWidth="8"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{score}</span>
            </div>
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${messageColor}`}>{message}</h2>
          <p className="text-sm text-slate-500 font-medium">Test ID: {attemptId.slice(-4)} • {formattedDate}</p>
        </div>

        {/* Right Section - Breakdown & Next Steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Skill Breakdown Card */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Skill Breakdown</h3>
            
            <div className="space-y-6">
              {breakdown && breakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">{item.topic}</span>
                    <span className="text-sm font-bold text-slate-700">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-slate-600 h-2 rounded-full" 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps Card */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recommended Next Steps</h3>
            <p className="text-slate-600 mb-6">
              {recommendation || "Keep up the good work and continue with your current learning path."}
            </p>
            <button 
              onClick={() => navigate('/roadmap')}
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              [ Go to Recommended Course ]
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
