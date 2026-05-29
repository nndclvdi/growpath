import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../api/axios'; 

const AppContext = createContext();

const defaultProgress = { 
  completedCourses: [], 
  activeCourses: [], 
  roadmapChecklist: {}, 
  assessments: [] 
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('growpath_user');
    return savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  
  // Mengambil state awal dari localStorage agar data Roadmap lokal tidak hilang saat refresh
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('growpath_progress');
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch (e) {
      return defaultProgress;
    }
  });

  const [courses, setCourses] = useState([]);
  const [availableAssessments, setAvailableAssessments] = useState([]);
  const [talentMappings, setTalentMappings] = useState(() => {
    const saved = localStorage.getItem('growpath_talent_mappings');
    return saved ? JSON.parse(saved) : [];
  });

  // Saat refresh dari DB, KITA MERGE data DB dengan data Lokal
  const refreshProgress = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await API.get(`/progress/user/${userId}`);
      setProgress(prev => ({
        ...prev, // Pertahankan roadmap/data lokal
        ...res.data, // Timpa dengan data dari database (stats, activeCourses)
        activeCourses: res.data.activeCourses || prev.activeCourses // Pastikan activeCourses terambil
      }));
    } catch (err) {
      console.error("Gagal refresh progress dari DB:", err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get('/auth/check-auth');
        if (response.data?.user) {
          setUser(response.data.user);
          await refreshProgress(response.data.user.id);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [refreshProgress]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [assessRes, courseRes] = await Promise.all([
          API.get('/assessments'),
          API.get('/courses')
        ]);
        setAvailableAssessments(Array.isArray(assessRes.data) ? assessRes.data : (assessRes.data.assessments || []));
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : (courseRes.data.courses || []));
      } catch (error) {
        console.error("Gagal mengambil data pendukung:", error);
      }
    };
    fetchData();
  }, [user]);

  // Simpan progress ke localStorage setiap kali berubah agar persisten
  useEffect(() => {
    localStorage.setItem('growpath_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (user) localStorage.setItem('growpath_user', JSON.stringify(user));
    else localStorage.removeItem('growpath_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('growpath_talent_mappings', JSON.stringify(talentMappings));
  }, [talentMappings]);


  // --- Definisi Fungsi ---
  const saveAssessment = (assessmentResult) => {
    const attemptId = assessmentResult.attemptId || Date.now().toString();
    const newAssessment = { ...assessmentResult, attemptId };
    setProgress(prev => ({ ...prev, assessments: [...(prev.assessments || []), newAssessment] }));
    return attemptId;
  };

  const deleteAssessmentHistory = (attemptId) => {
    setProgress(prev => ({ ...prev, assessments: (prev.assessments || []).filter(a => a.attemptId !== attemptId) }));
  };

  const markCourseCompleted = (courseId) => {
    setProgress(prev => {
      const targetId = courseId.toString();
      const updatedCompleted = prev.completedCourses.includes(targetId) ? prev.completedCourses : [...prev.completedCourses, targetId];
      return { ...prev, completedCourses: updatedCompleted };
    });
  };

  const addCourse = (course) => setCourses(prev => [...prev, { ...course, id: course._id || course.id }]);
  const updateCourse = (updatedData) => setCourses(prev => prev.map(c => (c.id === updatedData.id || c._id === updatedData._id) ? { ...c, ...updatedData } : c));
  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id && c._id !== id));

  const addAssessment = (assessment) => setAvailableAssessments(prev => [...prev, { ...assessment, id: assessment._id || assessment.id }]);
  const updateAssessment = (updatedData) => setAvailableAssessments(prev => prev.map(a => (a.id === updatedData.id || a._id === updatedData._id) ? { ...a, ...updatedData } : a));
  const deleteAssessment = (id) => setAvailableAssessments(prev => prev.filter(a => a.id !== id && a._id !== id));

  const addTalentMapping = (t) => setTalentMappings(prev => [...prev, { ...t, id: Date.now() }]);
  const updateTalentMapping = (id, data) => setTalentMappings(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTalentMapping = (id) => setTalentMappings(prev => prev.filter(t => t.id !== id));

  const login = async (userData) => {
    setUser(userData);
    await refreshProgress(userData.id);
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      setProgress(defaultProgress);
      localStorage.removeItem('growpath_user');
      localStorage.removeItem('growpath_progress');
      return true;
    } catch (error) {
      console.error("Logout gagal:", error);
      return false;
    }
  };

  const updateProfile = (data) => setUser(prev => ({ ...prev, ...data }));

  const toggleRoadmapItem = (phaseId, itemId) => {
    setProgress(prev => {
      const currentChecklist = prev.roadmapChecklist || {};
      const current = currentChecklist[phaseId] || [];
      const next = current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId];
      return { ...prev, roadmapChecklist: { ...currentChecklist, [phaseId]: next } };
    });
  };


  return (
    <AppContext.Provider
      value={{
        user, login, logout, updateProfile, loading,
        progress, setProgress, toggleRoadmapItem, saveAssessment, deleteAssessmentHistory, markCourseCompleted,
        courses, addCourse, updateCourse, deleteCourse,
        availableAssessments, addAssessment, updateAssessment, deleteAssessment,
        talentMappings, addTalentMapping, updateTalentMapping, deleteTalentMapping
      }}
    >
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-[#0F172A]">
           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AppContext.Provider>
  );
};

// Error handling tambahan agar lebih mudah dilacak
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};