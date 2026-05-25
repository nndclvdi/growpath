import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Loader2, AlertTriangle, TrendingUp, Target } from 'lucide-react';

export default function AssessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Buat AbortController untuk mencegah memory leak jika komponen di-unmount
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Menambahkan credentials: 'include' untuk mengirim cookie session
        // Menambahkan signal ke dalam request
        const response = await fetch(`/api/assessments/results/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: signal
        });

        // Handle Sesi Habis
        if (response.status === 401) {
          throw new Error('Sesi Anda telah berakhir. Silakan login kembali untuk melihat hasil.');
        }

        // Handle Data Tidak Ditemukan
        if (response.status === 404) {
          throw new Error('Maaf, data hasil kuis ini tidak ditemukan di database kami.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Gagal memuat data dari server.');
        }

        const data = await response.json();

        // 2. Mapping data dari backend ke state
        setAssessment({
          score: data.score,
          title: data.title || 'Assessment Result',
          date: data.created_at,
          attemptId: data.id.toString(),
          // Data dummy tambahan breakdown jika API hanya mengembalikan 1, 
          // disesuaikan agar listnya banyak seperti di gambar (opsional, tergantung data asli backend)
          breakdown: data.breakdown || [
            { topic: 'React Basics', score: Math.min(100, data.score + 10) },
            { topic: 'State Management', score: Math.max(0, data.score - 15) },
            { topic: 'Hooks', score: data.score },
            { topic: 'Routing', score: Math.min(100, data.score + 15) },
          ],
          recommendation: data.score >= 80 
            ? 'Based on your score, you are doing great! Keep up the good work.' 
            : data.score >= 60
            ? 'Based on your score, you should focus on State Management and advanced hooks.'
            : 'Based on your score, we recommend reviewing the fundamentals before moving forward.',
        });

      } catch (err) {
        // Abaikan error jika itu berasal dari pembatalan fetch (AbortError)
        if (err.name === 'AbortError') {
          console.log('Fetch dibatalkan karena pindah halaman');
          return;
        }
        console.error("Fetch Detail Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    } else {
      setError("ID Assessment tidak valid.");
      setLoading(false);
    }

    // Cleanup function: batalkan proses fetch saat pengguna keluar dari halaman ini
    return () => {
      controller.abort();
    };
  }, [id]);

  // Handle Error View
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
        <div className="p-8 bg-white border-2 border-orange-100 rounded-[2.5rem] text-center shadow-xl shadow-orange-100/50 max-w-md">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-orange-600" size={32} />
          </div>
          <h3 className="text-orange-600 text-xl font-black mb-2">Waduh! Ada Masalah</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={() => navigate('/assessments')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Kembali ke Daftar Assessments
        </button>
      </div>
    );
  }

<<<<<<< HEAD
  // Handle Loading View
  if (loading || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50/50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="text-slate-500 font-bold mt-6 animate-pulse tracking-wide">MENGANALISA HASIL KUIS...</p>
      </div>
    );
  }

  const { score, date, attemptId, breakdown, recommendation } = assessment;

  // Format tanggal sesuai gambar: "Oct 12, 2023"
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  // UI Logic
  const isHigh = score >= 80;
  const isLow = score < 60;
  const statusTitle = isHigh ? 'Excellent!' : isLow ? 'Needs Improvement' : 'Good Job!';
  
  // Math untuk lingkaran (Jari-jari 45 -> Keliling 283)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Bar / Back Navigation */}
      <button
        onClick={() => navigate('/assessments')}
        className="text-slate-400 hover:text-slate-600 font-medium transition-colors text-sm"
      >
        [ Back to Assessments ]
      </button>

      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          Assessment Complete! 🎉
        </h1>
        <p className="text-slate-500 mt-2">Here's how you performed</p>
      </div>

      {/* Hero Score Card (Gradient) */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl p-8 md:p-10 shadow-lg flex flex-col md:flex-row justify-between items-center text-white relative overflow-hidden">
        <div className="z-10 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-2">{statusTitle}</h2>
          <p className="text-indigo-100 text-sm mb-1 opacity-90">
            Test #{attemptId} on {formattedDate}
          </p>
          <p className="text-indigo-100 text-sm opacity-90">
            You scored better than {Math.max(10, score - 10)}% of learners
          </p>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative w-32 h-32 flex justify-center items-center z-10">
          <svg className="w-full h-full transform -rotate-90 absolute inset-0">
            {/* Dashed Background Track */}
            <circle 
              className="text-white/30" 
              strokeWidth="10" 
              stroke="currentColor" 
              fill="transparent" 
              r={radius} 
              cx="64" 
              cy="64" 
              strokeDasharray="20 10" 
            />
            {/* Progress Track */}
            <circle
              className="text-white"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold leading-none">{score}</span>
            <span className="text-[10px] uppercase tracking-wider text-indigo-100 mt-1">Score</span>
          </div>
        </div>
      </div>

      {/* Skill Breakdown Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-indigo-600" size={24} />
          <h3 className="text-xl font-bold text-slate-800">Skill Breakdown</h3>
        </div>
        
        <div className="space-y-6">
          {breakdown.map((item, idx) => {
            // Logika warna progress bar: hijau jika >= 80, biru/indigo jika dibawah
            const isSkillHigh = item.score >= 80;
            const barColor = isSkillHigh ? 'bg-emerald-500' : 'bg-indigo-500';
            
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">{item.topic}</span>
                  <span className="text-sm font-bold text-indigo-600">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`${barColor} h-2.5 rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Next Steps Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-indigo-600" size={24} />
          <h3 className="text-xl font-bold text-slate-800">Recommended Next Steps</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          {recommendation}
        </p>
      </div>

    </div>
  );
}
=======
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
>>>>>>> 897df25ea1dfa544a23ae9de78c005ceb797c597
