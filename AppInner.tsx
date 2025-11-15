import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import InternshipsPage from './pages/InternshipsPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import EventsPage from './pages/EventsPage';
import CompaniesPage from './pages/CompaniesPage';
import SavedJobsPage from './pages/SavedJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Admin Route Component - Requires admin authentication
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/akazi-admin/login" replace />;
  }
  
  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default function AppInner() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="relative">
          {/* Enhanced Background Effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'
            }`} />
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse delay-1000 ${
              theme === 'dark' ? 'bg-cyan-600' : 'bg-sky-400'
            }`} />
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse delay-500 ${
              theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'
            }`} />
          </div>

          {/* Grid Pattern Overlay */}
          <div className={`fixed inset-0 opacity-5 pointer-events-none ${
            theme === 'dark' ? 'bg-white' : 'bg-gray-900'
          }`} style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />

          <Header />
          
          <main className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/internships" element={<InternshipsPage />} />
              <Route path="/scholarships" element={<ScholarshipsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/saved" element={<SavedJobsPage />} />
              
              {/* Admin Routes */}
              <Route path="/akazi-admin/login" element={<AdminLogin />} />
              <Route path="/akazi-admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}
