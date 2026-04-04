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
import ProtectedRoute from './middleware/ProtectedRoute';
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
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAssessmentPage && (
        <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900 w-full py-12 mt-20">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-neutral-900 dark:text-white font-bold text-xl tracking-tighter">JoByte</span>
              <p className="font-['Inter'] text-xs text-neutral-500 uppercase tracking-widest font-bold">© 2026 JoByte Editorial Engine. Precision Career Architecture.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-neutral-400">
              <a href="#" className="hover:text-[#B7131A] underline transition-all text-xs font-semibold">Privacy Policy</a>
              <a href="#" className="hover:text-[#B7131A] underline transition-all text-xs font-semibold">Terms of Service</a>
              <a href="#" className="hover:text-[#B7131A] underline transition-all text-xs font-semibold">Cookie Settings</a>
              <a href="#" className="hover:text-[#B7131A] underline transition-all text-xs font-semibold">Global Careers</a>
            </div>
          </div>
          <div className="mt-12 h-20 w-full dot-grid opacity-20"></div>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

