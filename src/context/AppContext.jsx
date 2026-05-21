import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

// Mock initial data
const initialCourses = [
  { id: 1, title: 'UI/UX Design Masterclass', author: 'Sarah Drasner', duration: '12h 30m', rating: 4.9, students: '12k', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600', category: 'Design', description: 'Learn the principles of user interface and user experience design from scratch. We will cover color theory, typography, layout, and how to create scalable design systems.', lessons: [
    { id: 1, title: 'Introduction to Design Systems', duration: '15:20', type: 'video' },
    { id: 2, title: 'Color Theory & Typography', duration: '22:15', type: 'video' },
    { id: 3, title: 'Creating Reusable Components', duration: '18:40', type: 'video' },
    { id: 4, title: 'Course Assignment', duration: '30:00', type: 'assignment' },
  ]},
  { id: 2, title: 'Advanced React Patterns', author: 'Kent C. Dodds', duration: '8h 15m', rating: 4.8, students: '8k', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600', category: 'Frontend', description: 'Master high-order components, render props, and custom hooks.', lessons: [
    { id: 1, title: 'Higher Order Components', duration: '20:00', type: 'video' }
  ]},
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
  // User & Progress State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('growpath_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('growpath_progress');
    return savedProgress ? JSON.parse(savedProgress) : { completedCourses: [], roadmapChecklist: {}, assessments: [] };
  });

  // Global Content State
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

  // Persist State
  useEffect(() => { localStorage.setItem('growpath_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('growpath_progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('growpath_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('growpath_available_assessments', JSON.stringify(availableAssessments)); }, [availableAssessments]);
  useEffect(() => { localStorage.setItem('growpath_talent_mappings', JSON.stringify(talentMappings)); }, [talentMappings]);

  // Auth & Profile
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const updateProfile = (data) => setUser({ ...user, ...data });

  // Progress Methods
  const toggleRoadmapItem = (phaseId, itemId) => {
    setProgress(prev => {
      const currentChecklist = prev.roadmapChecklist[phaseId] || [];
      let newChecklist;
      if (currentChecklist.includes(itemId)) {
        newChecklist = currentChecklist.filter(id => id !== itemId);
      } else {
        newChecklist = [...currentChecklist, itemId];
      }
      return { ...prev, roadmapChecklist: { ...prev.roadmapChecklist, [phaseId]: newChecklist } };
    });
  };

  const saveAssessment = (assessmentResult) => {
    const attemptId = Date.now().toString();
    const newAssessment = { ...assessmentResult, attemptId };
    setProgress(prev => ({
      ...prev,
      assessments: [...prev.assessments, newAssessment]
    }));
    return attemptId;
  };

  const deleteAssessmentHistory = (attemptId) => {
    setProgress(prev => ({
      ...prev,
      assessments: prev.assessments.filter(a => a.attemptId !== attemptId)
    }));
  };

  const markCourseCompleted = (courseId) => {
    setProgress(prev => {
      if (!prev.completedCourses.includes(courseId)) {
        return { ...prev, completedCourses: [...prev.completedCourses, courseId] };
      }
      return prev;
    });
  };

  // Admin Global CRUD Methods
  const addCourse = (course) => setCourses(prev => [...prev, { ...course, id: Date.now() }]);
  const updateCourse = (id, data) => setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  const addAssessment = (assessment) => setAvailableAssessments(prev => [...prev, { ...assessment, id: Date.now().toString() }]);
  const updateAssessment = (id, data) => setAvailableAssessments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAssessment = (id) => setAvailableAssessments(prev => prev.filter(a => a.id !== id));

  const addTalentMapping = (talent) => setTalentMappings(prev => [...prev, { ...talent, id: Date.now() }]);
  const updateTalentMapping = (id, data) => setTalentMappings(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTalentMapping = (id) => setTalentMappings(prev => prev.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{ 
      user, login, logout, updateProfile, 
      progress, toggleRoadmapItem, saveAssessment, deleteAssessmentHistory, markCourseCompleted,
      courses, addCourse, updateCourse, deleteCourse,
      availableAssessments, addAssessment, updateAssessment, deleteAssessment,
      talentMappings, addTalentMapping, updateTalentMapping, deleteTalentMapping
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
