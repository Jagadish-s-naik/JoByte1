import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Jobs from './pages/Jobs';
import Assessment from './pages/Assessment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ApplicantDashboard from './pages/Applicant/Dashboard';
import EmployerDashboard from './pages/Employer/Dashboard';
import Profile from './pages/Profile';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ProtectedRoute from './middleware/ProtectedRoute';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAssessmentPage = location.pathname.startsWith('/mission/') || location.pathname.startsWith('/assessment/');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAssessmentPage && <Navbar />}
      
      <main className="w-full flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Applicant Routes */}
          <Route path="/applicant/dashboard" element={
            <ProtectedRoute allowedRole="applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/applicant/profile" element={
            <ProtectedRoute allowedRole="applicant">
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Employer Routes */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employer/profile" element={
            <ProtectedRoute allowedRole="employer">
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Assessment Route */}
          <Route path="/mission/:id" element={<Assessment />} />
          <Route path="/assessment/:id" element={<Assessment />} />
          
          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAssessmentPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
};

export default App;

