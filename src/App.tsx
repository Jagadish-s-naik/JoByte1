import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-primary/30">
        <Navbar />
        
        <main className="w-full">
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

        <footer className="border-t border-white/5 py-12 bg-surface-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">JoByte</span>
              </div>
              <p className="text-slate-500 text-sm">
                &copy; 2026 JoByte Recruitment Portal. Built with professional standards.
              </p>
              <div className="flex gap-8 text-sm text-slate-400">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
