import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import ReceptionistDashboard from './pages/ReceptionistDashboard.jsx';
import TopBar from './components/TopBar.jsx';

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  return <Navigate to="/receptionist" replace />;
}

function Shell({ children }) {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      {user && <TopBar />}
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Shell>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/patient"
          element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>}
        />
        <Route
          path="/doctor"
          element={<ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>}
        />
        <Route
          path="/receptionist"
          element={<ProtectedRoute role="RECEPTIONIST"><ReceptionistDashboard /></ProtectedRoute>}
        />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
