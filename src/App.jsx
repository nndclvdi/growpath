import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// =========================
// LAYOUTS & PROTECTIONS
// =========================
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import UserRoute from './routes/UserRoute';
import AdminRoute from './routes/AdminRoute';

// =========================
// USER PAGES
// =========================
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AssessmentList from './pages/Assessments/AssessmentList';
import TakeAssessment from './pages/Assessments/TakeAssessment';
import AssessmentResult from './pages/Assessments/AssessmentResult';
import Roadmap from './pages/Roadmap';
import RoadmapDetail from './pages/RoadmapDetail';
import CourseList from './pages/Courses/CourseList';
import CourseDetail from './pages/Courses/CourseDetail';
import Progress from './pages/Progress';
import ProfileView from './pages/Profile/ProfileView';
import EditProfile from './pages/Profile/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// =========================
// ADMIN PAGES
// =========================
import LoginAdmin from './pages/Admin/LoginAdmin';
import RegisterAdmin from './pages/Admin/RegisterAdmin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageAssessments from './pages/Admin/ManageAssessments';
import UserInsights from './pages/Admin/UserInsights';
import ManageTalentMapping from './pages/Admin/ManageTalentMapping';
import Reports from './pages/Admin/Reports';
import Settings from './pages/Admin/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login-admin"
            element={<LoginAdmin />}
          />

          <Route
            path="/register-admin"
            element={<RegisterAdmin />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* USER ROUTES */}
          <Route
            path="/"
            element={
              <UserRoute>
                <Layout />
              </UserRoute>
            }
          >

            <Route
              index
              element={<Navigate to="/dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="assessments"
              element={<AssessmentList />}
            />

            <Route
              path="assessments/take/:id"
              element={<TakeAssessment />}
            />

            <Route
              path="assessments/result/:id"
              element={<AssessmentResult />}
            />

            <Route
              path="roadmap"
              element={<Roadmap />}
            />

            <Route
              path="roadmap/:id"
              element={<RoadmapDetail />}
            />

            <Route
              path="courses"
              element={<CourseList />}
            />

            <Route
              path="courses/:id"
              element={<CourseDetail />}
            />

            <Route
              path="progress"
              element={<Progress />}
            />

            <Route
              path="profile"
              element={<ProfileView />}
            />

            <Route
              path="profile/edit"
              element={<EditProfile />}
            />

          </Route>

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >

            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="courses"
              element={<ManageCourses />}
            />

            <Route
              path="assessments"
              element={<ManageAssessments />}
            />

            <Route
              path="users"
              element={<UserInsights />}
            />

            <Route
              path="talent-mapping"
              element={<ManageTalentMapping />}
            />

            <Route
              path="reports"
              element={<Reports />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

          {/* SUPER ADMIN */}
          <Route
            path="/superadmin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </BrowserRouter>
    </AppProvider>
  );
}
