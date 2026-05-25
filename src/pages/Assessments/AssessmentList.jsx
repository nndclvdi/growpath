import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AssessmentList() {
  const navigate = useNavigate();
  const { progress, availableAssessments } = useAppContext();

  // Ambil data dari konteks
  const pastAssessments = progress.assessments || [];
  // Mengambil assessment pertama yang tersedia untuk tombol CTA
  const primaryAssessment = availableAssessments[0];

  // Variabel untuk mengecek apakah user sudah pernah mengerjakan assessment
  const hasCompletedAssessments = pastAssessments.length > 0;

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-800">Assessments</h1>

      {/* Hero / Take New Assessment Section (CONDITIONAL RENDERING) */}
      {!hasCompletedAssessments ? (
        // TAMPILAN 1: Bika Belum Pernah Mengerjakan (Banner Besar)
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-400 rounded-3xl p-8 shadow-lg shadow-indigo-100">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Take New Assessment</h2>
            <p className="text-indigo-50 mt-1 mb-6">
              Test your skills to get personalized course recommendations.
            </p>
            <button 
              onClick={() => navigate(`/assessments/take/${primaryAssessment?.id || 1}`)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-600 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md"
            >
              [ Start Assessment ] <ChevronRight size={18} />
            </button>
          </div>
          {/* Dekorasi abstrak di background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        </section>
      ) : (
        // TAMPILAN 2: Jika Sudah Pernah Mengerjakan (Banner Kecil yang Rapi)
        <section className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-bold text-slate-800">Ready for another challenge?</h2>
            <p className="text-sm text-slate-500">Take a new assessment to update your skills profile.</p>
          </div>
          <button 
            onClick={() => navigate(`/assessments/take/${primaryAssessment?.id || 1}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full font-semibold hover:bg-indigo-100 transition-colors text-sm"
          >
            Take New Assessment <ChevronRight size={16} />
          </button>
        </section>
      )}

      {/* Past Results Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Past Results</h2>

        {!hasCompletedAssessments ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <p className="text-slate-400 font-medium">No assessments completed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastAssessments.map((item) => (
              <div key={item.attemptId} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {item.title || 'React Fundamentals Test'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Completed: {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-white shadow-sm">
                      <span className="font-bold text-emerald-600">{item.score}</span>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/assessments/result/${item.attemptId}`)}
                  className="w-full py-2 border border-slate-100 rounded-2xl text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  [ View Detail ]
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
