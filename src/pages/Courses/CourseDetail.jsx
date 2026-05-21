import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    courses,
    markCourseCompleted,
    progress
  } = useAppContext();

  // Menyelaraskan pencarian ID agar fleksibel mendeteksi ID numerik asli dari PostgreSQL
  const course = courses.find(c => String(c.id) === String(id) || String(c._id) === String(id));

  // ========================================================
  // VIDEO YOUTUBE BERDASARKAN ID ASLI POSTGRESQL (SUDAH FIX)
  // ========================================================
  const courseVideoIds = {
  1: 'c9Wg6Cb_YlU', // Video React (Salah mapping)
  2: 'TNhaISOUy6Q',
  3: 'Oe421EPjeBE', // ID 3 malah video Node.js
};

  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Referensi untuk menyimpan instance player YouTube
  const playerRef = useRef(null);

  // Fungsi untuk memuat YouTube Iframe API
  useEffect(() => {
    if (isPlaying && (courseVideoIds[course?.id] || courseVideoIds[course?._id])) {
      // Cek apakah script API sudah ada di halaman
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        initializePlayer();
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isPlaying, course?.id]);

  const initializePlayer = () => {
    const currentId = course.id || course._id;
    playerRef.current = new window.YT.Player(`Youtubeer-${currentId}`, {
      videoId: courseVideoIds[String(currentId)] || 'c9Wg6Cb_YlU',
      playerVars: {
        autoplay: 1, // Otomatis main
        rel: 0,      // Tidak tampilkan video terkait di akhir
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  const onPlayerStateChange = (event) => {
    // window.YT.PlayerState.ENDED bernilai 0
    if (event.data === 0) {
      console.log("Video selesai ditonton!");
      handleVideoCompletion();
    }
  };

  const handleVideoCompletion = () => {
    if (course?.lessons && Array.isArray(course.lessons)) {
      const allLessonIds = course.lessons.map(l => l.id);
      setCompletedLessons(allLessonIds);
    } else if (course?.lessons && !isNaN(course.lessons)) {
      const allLessonIds = Array.from({ length: Number(course.lessons) }).map((_, i) => i);
      setCompletedLessons(allLessonIds);
    }
    
    markCourseCompleted(course.id || course._id);
    alert('Selamat! Anda telah menyelesaikan materi ini.');
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-20">
        <p className="text-slate-500 mb-4 font-medium">Course not found.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const toggleLesson = (lessonId) => {
    let newCompleted;
    if (completedLessons.includes(lessonId)) {
      newCompleted = completedLessons.filter(id => id !== lessonId);
    } else {
      newCompleted = [...completedLessons, lessonId];
    }
    setCompletedLessons(newCompleted);
    
    const totalLessonsLength = Array.isArray(course.lessons) 
      ? course.lessons.length 
      : (Number(course.lessons) || 0);

    if (newCompleted.length === totalLessonsLength) {
      markCourseCompleted(course.id || course._id);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={18} />
          [ Back to Courses ]
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Video Player Area */}
          <div className="bg-[#1E293B] rounded-[24px] aspect-video relative overflow-hidden shadow-lg group">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={course.image || "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200"}
                  alt="Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-10"
                >
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
              </div>
            ) : (
              <div id={`Youtubeer-${course.id}`} className="w-full h-full"></div>
            )}
          </div>

          {/* Description Card */}
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              {course.title}
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              {course.author || 'GrowPath Expert'} • Last updated Oct 2023
            </p>

            <h3 className="text-lg font-bold text-slate-800 mb-3">Description</h3>
            <div className="space-y-2">
              <p className="text-slate-500 leading-relaxed">
                {course.description && course.description !== '[null]' ? course.description : "Learn the principles from scratch."}
              </p>
              <div className="h-2 bg-slate-50 rounded-full w-full"></div>
              <div className="h-2 bg-slate-50 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Right Column (Course Content Sidebar) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden sticky top-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Course Content</h2>
              
              <div className="space-y-3">
                {/* 1. JIKA DATA LESSONS BERUBAH ARRAY OBJECT LAMA */}
                {course.lessons && Array.isArray(course.lessons) ? (
                  course.lessons.map((lesson, idx) => {
                    const isChecked = completedLessons.includes(lesson.id);
                    const isActive = idx === 0 && !isChecked; 

                    return (
                      <div
                        key={lesson.id || idx}
                        onClick={() => toggleLesson(lesson.id)}
                        className={`group cursor-pointer p-4 rounded-2xl transition-all border ${
                          isActive 
                            ? 'bg-indigo-50/50 border-indigo-200' 
                            : 'bg-transparent border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {isChecked ? (
                              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                 <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-slate-200 rounded-full bg-white group-hover:border-indigo-300 transition-colors"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className={`text-sm font-semibold transition-colors ${
                              isActive ? 'text-indigo-600' : isChecked ? 'text-emerald-600' : 'text-slate-700'
                            }`}>
                              Lesson {idx + 1}: {lesson.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : /* 2. JIKA DATA LESSONS BERUPA INTEGER / ANGKA DARI POSTGRESQL */
                course.lessons && (!isNaN(course.lessons) || typeof course.lessons === 'number') ? (
                  Array.from({ length: Number(course.lessons) || 0 }).map((_, idx) => {
                    const isChecked = completedLessons.includes(idx);
                    const isActive = idx === 0 && !isChecked;

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleLesson(idx)}
                        className={`group cursor-pointer p-4 rounded-2xl transition-all border ${
                          isActive 
                            ? 'bg-indigo-50/50 border-indigo-200' 
                            : 'bg-transparent border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {isChecked ? (
                              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                 <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-slate-200 rounded-full bg-white group-hover:border-indigo-300 transition-colors"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className={`text-sm font-semibold transition-colors ${
                              isActive ? 'text-indigo-600' : isChecked ? 'text-emerald-600' : 'text-slate-700'
                            }`}>
                              Module {idx + 1}: Course Material
                            </p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">
                              Self-paced learning
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : null}

                {/* 3. JIKA DATA MATERI KOSONG */}
                {(!course.lessons || Number(course.lessons) === 0) && (
                  <p className="text-center py-10 text-slate-400 text-sm italic">
                    No lessons available yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}