import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AssessmentList from './pages/Assessments/AssessmentList';
import TakeAssessment from './pages/Assessments/TakeAssessment';
import AssessmentResult from './pages/Assessments/AssessmentResult';
import Roadmap from './pages/Roadmap';
import CourseList from './pages/Courses/CourseList';
import CourseDetail from './pages/Courses/CourseDetail';
import Progress from './pages/Progress';
import ProfileView from './pages/Profile/ProfileView';
import EditProfile from './pages/Profile/EditProfile';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageAssessments from './pages/Admin/ManageAssessments';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageTalentMapping from './pages/Admin/ManageTalentMapping';
import Reports from './pages/Admin/Reports';
import Settings from './pages/Admin/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Learner Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="assessments" element={<AssessmentList />} />
            <Route path="assessments/take/:id" element={<TakeAssessment />} />
            <Route path="assessments/result/:id" element={<AssessmentResult />} />
            
            <Route path="roadmap" element={<Roadmap />} />
            
            <Route path="courses" element={<CourseList />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            
            <Route path="progress" element={<Progress />} />
            
            <Route path="profile" element={<ProfileView />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="assessments" element={<ManageAssessments />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="talent-mapping" element={<ManageTalentMapping />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
