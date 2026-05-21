import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen, Zap } from 'lucide-react';

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // DATA KONTEN BERDASARKAN ID PHASE
      const allRoadmaps = {
        phase1: {
          phase: "PHASE 1",
          title: "Step 1: Frontend Developer Roadmap",
          description: "Kuasai fondasi utama web: HTML untuk struktur, CSS untuk tampilan, dan JavaScript untuk logika dasar serta React untuk UI modern.",
          estTime: "4 Weeks",
          topicsCount: 5,
          items: [
            { id: 1, title: "HTML5: Semantic & Web Structure", subtitle: "12 Video", link: "https://www.youtube.com/watch?v=NBZ0YisXG_M" },
            { id: 2, title: "CSS3: Flexbox, Grid, & Responsive Design", subtitle: "15 Video", link: "https://www.youtube.com/watch?v=OXGznpKZ_sA" },
            { id: 3, title: "Modern JavaScript (ES6+)", subtitle: "20 Video", link: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
            { id: 4, title: "React Fundamentals & Hooks", subtitle: "25 Video", link: "https://www.youtube.com/watch?v=hQAHSlTtcmY" },
            { id: 5, title: "Git, GitHub & Deployment", subtitle: "8 Video", link: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
          ]
        },
        phase2: {
          phase: "PHASE 2",
          title: "Step 2: Backend Developer Roadmap",
          description: "Pelajari cara membangun server, mengelola database SQL, dan membuat API yang aman untuk mendukung aplikasi skala besar.",
          estTime: "6 Weeks",
          topicsCount: 5,
          items: [
            { id: 1, title: "Node.js & Express.js Basics", subtitle: "15 Video", link: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
            { id: 2, title: "Relational Databases (PostgreSQL/MySQL)", subtitle: "12 Video", link: "https://www.youtube.com/watch?v=qw--VYLpxG4" },
            { id: 3, title: "RESTful API Design", subtitle: "10 Video", link: "https://www.youtube.com/watch?v=lsMQRaeKNDk" },
            { id: 4, title: "Authentication with JWT", subtitle: "14 Video", link: "https://www.youtube.com/watch?v=7nafaH9SddU" },
            { id: 5, title: "SQL Advanced Logic", subtitle: "8 Video", link: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
          ]
        },
        phase3: {
          phase: "PHASE 3",
          title: "Step 3: UI/UX Designer Roadmap",
          description: "Asah kreativitas Anda dalam merancang pengalaman pengguna yang intuitif dan antarmuka visual menggunakan Figma dan prinsip desain modern.",
          estTime: "5 Weeks",
          topicsCount: 5,
          items: [
            { id: 1, title: "User Research & Empathy Mapping", subtitle: "8 Video", link: "https://www.youtube.com/watch?v=68Wf9YI_Wqg" },
            { id: 2, title: "Wireframing & Low-Fi Prototyping", subtitle: "10 Video", link: "https://www.youtube.com/watch?v=fS3HIdN_uIc" },
            { id: 3, title: "Mastering Figma: High-Fi Design", subtitle: "20 Video", link: "https://www.youtube.com/watch?v=FTFaQW9z764" },
            { id: 4, title: "Design Systems & Style Guides", subtitle: "12 Video", link: "https://www.youtube.com/watch?v=7_50O5Xv_90" },
            { id: 5, title: "Usability Testing", subtitle: "7 Video", link: "https://www.youtube.com/watch?v=T_8N_8XN-uI" },
          ]
        }
      };

      // Set data berdasarkan param ID atau default ke phase1
      setModuleData(allRoadmaps[id] || allRoadmaps.phase1);
      
      setTimeout(() => setLoading(false), 500);
    };

    fetchData();
  }, [id]);

  const handleOpenMaterial = (link) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/roadmap')} 
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 transition-all group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">[ Back to Roadmap ]</span>
      </button>

      {/* Header Info Card */}
      <div className="bg-white border-2 border-slate-50 rounded-[32px] p-10 shadow-sm relative overflow-hidden mb-10">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            {moduleData.phase}
          </span>
          <div className="bg-indigo-600 text-white text-[10px] font-bold px-6 py-2 rounded-xl shadow-lg shadow-indigo-200 uppercase tracking-widest">
            {moduleData.phase}
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
          {moduleData.title}
        </h1>
        
        <p className="text-slate-400 max-w-3xl leading-relaxed text-base mb-8">
          {moduleData.description}
        </p>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 text-slate-600 text-sm font-medium">
            <Clock size={18} className="text-indigo-500" />
            <span>Est. Time: {moduleData.estTime}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 text-slate-600 text-sm font-medium">
            <BookOpen size={18} className="text-indigo-500" />
            <span>Topics: {moduleData.topicsCount}</span>
          </div>
        </div>
      </div>

      {/* Learning Items List */}
      <div className="bg-slate-50/40 border border-slate-100 rounded-[40px] p-8 md:p-10">
        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="text-2xl font-bold text-slate-800">Learning Items</h2>
           <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-100">
             <Zap size={14} fill="currentColor" />
             <span>Earn 10 XP per Topic</span>
           </div>
        </div>
        
        <div className="space-y-4">
          {moduleData.items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-300 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-indigo-100 transition-colors" />
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-900 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-400 font-medium">{item.subtitle}</p>
                </div>
              </div>

              <button 
                onClick={() => handleOpenMaterial(item.link)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 transition-all"
              >
                [ Open Material ]
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}