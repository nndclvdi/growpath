import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

const AppContext = createContext();

// =========================
// MOCK INITIAL DATA
// =========================
const initialCourses = [
  {
    id: 1,
    title: 'UI/UX Design Masterclass',
    author: 'Sarah Drasner',
    duration: '12h 30m',
    rating: 4.9,
    students: '12k',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600',
    category: 'Design',
    description: 'Learn the principles of user interface and user experience design from scratch.',
    lessons: [{ id: 1, title: 'Introduction to Design Systems', duration: '15:20', type: 'video' }]
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    author: 'Kent C. Dodds',
    duration: '8h 15m',
    rating: 4.8,
    students: '8k',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
    category: 'Frontend',
    description: 'Master high-order components, render props, and custom hooks.',
    lessons: [{ id: 1, title: 'Higher Order Components', duration: '20:00', type: 'video' }]
  },
];

const initialAvailableAssessments = [
  { id: '1', title: 'React Fundamentals', category: 'Frontend', duration: '30 mins' },
  { id: '2', title: 'Advanced CSS Layouts', category: 'Design', duration: '45 mins' },
  { id: '3', title: 'JavaScript Algorithms', category: 'Programming', duration: '60 mins' },
];

const initialTalentMappings = [
  { id: 1, name: 'John Doe', role: 'Frontend Developer', department: 'Engineering', performance: 'High', potential: 'High', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 2, name: 'Jane Smith', role: 'Product Designer', department: 'Design', performance: 'Medium', potential: 'High', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
];

export const AppProvider = ({ children }) => {
  // =========================
  // STATE MANAGEMENT
  // =========================
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('growpath_user');
    return savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  // Ditambahkan struktur 'activeCourses' secara default agar tidak undefined
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('growpath_progress');
    return saved ? JSON.parse(saved) : { 
      completedCourses: [], 
      activeCourses: [], 
      roadmapChecklist: {}, 
      assessments: [] 
    };
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('growpath_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [availableAssessments, setAvailableAssessments] = useState(() => {
    const saved = localStorage.getItem('growpath_available_assessments');
    return saved ? JSON.parse(saved) : initialAvailableAssessments;
  });

  const [talentMappings, setTalentMappings] = useState(() => {
    const saved = localStorage.getItem('growpath_talent_mappings');
    return saved ? JSON.parse(saved) : initialTalentMappings;
  });

  // =========================
  // SYNC AUTH STATUS
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-auth', { 
          method: 'GET',
          credentials: 'include' 
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          setUser(null);
          localStorage.removeItem('growpath_user');
          localStorage.removeItem('adminData');
        }
      } catch (err) {
        console.log("Koneksi tidak stabil, menggunakan sesi lokal.");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // =========================
  // PERSISTENCE (LOCAL STORAGE)
  // =========================
  useEffect(() => {
    localStorage.setItem('growpath_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('growpath_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('growpath_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('growpath_available_assessments', JSON.stringify(availableAssessments));
  }, [availableAssessments]);

  useEffect(() => {
    localStorage.setItem('growpath_talent_mappings', JSON.stringify(talentMappings));
  }, [talentMappings]);

  // =========================
  // AUTH ACTIONS
  // =========================
  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
      if (response.ok) {
        setUser(null);
        localStorage.removeItem('growpath_user');
        localStorage.removeItem('adminData');
        return true;
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    }
    return false;
  };

  const updateProfile = (data) => setUser(prev => ({ ...prev, ...data }));

  // =========================
  // DATA ACTIONS (CRUD)
  // =========================
  const toggleRoadmapItem = (phaseId, itemId) => {
    setProgress(prev => {
      const current = prev.roadmapChecklist[phaseId] || [];
      const next = current.includes(itemId) ? current.filter(id => id !== itemId) : [...current, itemId];
      return { ...prev, roadmapChecklist: { ...prev.roadmapChecklist, [phaseId]: next } };
    });
  };

  const saveAssessment = (assessmentResult) => {
    const attemptId = assessmentResult.attemptId || Date.now().toString();
    const newAssessment = { ...assessmentResult, attemptId };
    setProgress(prev => ({ ...prev, assessments: [...prev.assessments, newAssessment] }));
    return attemptId;
  };

  const deleteAssessmentHistory = (attemptId) => {
    setProgress(prev => ({ ...prev, assessments: prev.assessments.filter(a => a.attemptId !== attemptId) }));
  };

  // PEMBARUAN LOGIKA SELESAI: Mendukung integrasi persentase objek activeCourses secara dinamis
  const markCourseCompleted = (courseId) => {
    setProgress(prev => {
      const targetId = courseId.toString();

      // 1. Amankan array completedCourses dari duplikasi rute ID
      const updatedCompleted = prev.completedCourses.map(id => id.toString()).includes(targetId)
        ? prev.completedCourses
        : [...prev.completedCourses, targetId];

      // 2. Set persentase kursus aktif tersebut menjadi 100%
      let updatedActive = prev.activeCourses?.map(ac => {
        if (ac.courseId.toString() === targetId) {
          return { ...ac, percentage: 100, currentModuleName: 'Selesai' };
        }
        return ac;
      }) || [];

      // 3. Jika data kursus belum pernah masuk ke activeCourses, lakukan push otomatis
      const hasActive = prev.activeCourses?.some(ac => ac.courseId.toString() === targetId);
      if (!hasActive) {
        updatedActive.push({
          courseId: targetId,
          percentage: 100,
          currentModuleName: 'Selesai'
        });
      }

      return { 
        ...prev, 
        completedCourses: updatedCompleted,
        activeCourses: updatedActive
      };
    });
  };

  const addCourse = (course) => setCourses(prev => [...prev, { ...course, id: Date.now() }]);
  const updateCourse = (id, data) => setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  const addAssessment = (assessment) => {
    const newA = { ...assessment, id: assessment.id || Date.now().toString() };
    setAvailableAssessments(prev => [...prev, newA]);
  };

  const updateAssessment = (id, data) => {
    setAvailableAssessments(prev => prev.map(a => (a.id === id) ? { ...a, ...data } : a));
  };

  const deleteAssessment = (id) => {
    setAvailableAssessments(prev => prev.filter(a => a.id !== id));
  };

  const addTalentMapping = (t) => setTalentMappings(prev => [...prev, { ...t, id: Date.now() }]);
  const updateTalentMapping = (id, data) => setTalentMappings(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTalentMapping = (id) => setTalentMappings(prev => prev.filter(t => t.id !== id));

  return (
    <AppContext.Provider
      value={{
        user, login, logout, updateProfile, loading,
        progress, toggleRoadmapItem, saveAssessment, deleteAssessmentHistory, markCourseCompleted,
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

export const useAppContext = () => useContext(AppContext);