// ============================================
// MAIN APP COMPONENT
// Science with Kalana - Learning Management System
// ============================================

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { initializeData } from '@/data/store';

// Components
import Sidebar from '@/components/Sidebar';
import MenuButton from '@/components/MenuButton';
import WhatsAppButton from '@/components/WhatsAppButton';

// Sections
import Hero from '@/sections/Hero';
import AboutTeacher from '@/sections/AboutTeacher';
import GradeClasses from '@/sections/GradeClasses';
import Store from '@/sections/Store';
import VideoLessons from '@/sections/VideoLessons';
import LiveSchedule from '@/sections/LiveSchedule';
import Notes from '@/sections/Notes';
import Login from '@/sections/Login';
import StudentDashboard from '@/sections/StudentDashboard';
import MyClasses from '@/sections/MyClasses';
import AdminDashboard from '@/sections/AdminDashboard';
import Payment from '@/sections/Payment';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

// ============================================
// MAIN APP CONTENT
// ============================================

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentClassId, setPaymentClassId] = useState<string | null>(null);
  useAuth(); // Initialize auth context

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Handle navigation
  const handleNavigate = (page: string, classId?: string) => {
    setCurrentPage(page);
    if (classId) {
      setPaymentClassId(classId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current page content
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <AboutTeacher />
            <GradeClasses onNavigate={handleNavigate} />
            <LiveSchedule />
            <Contact onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'about':
        return (
          <>
            <div className="pt-20" />
            <AboutTeacher />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'grades':
        return (
          <>
            <div className="pt-20" />
            <GradeClasses onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'store':
        return (
          <>
            <div className="pt-20" />
            <Store onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'videos':
        return (
          <>
            <div className="pt-20" />
            <VideoLessons onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'schedule':
        return (
          <>
            <div className="pt-20" />
            <LiveSchedule />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'notes':
        return (
          <>
            <div className="pt-20" />
            <Notes />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'login':
      case 'register':
        return (
          <>
            <div className="pt-20" />
            <Login onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'dashboard':
        return (
          <>
            <div className="pt-20" />
            <StudentDashboard onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'my-classes':
        return (
          <>
            <div className="pt-20" />
            <MyClasses onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'teacher-panel':
      case 'admin':
        return (
          <>
            <div className="pt-20" />
            <AdminDashboard onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'payment':
        return (
          <>
            <div className="pt-20" />
            <Payment classId={paymentClassId} onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      case 'contact':
        return (
          <>
            <div className="pt-20" />
            <Contact onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
      
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <AboutTeacher />
            <GradeClasses onNavigate={handleNavigate} />
            <Footer onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Menu Button */}
      <MenuButton onClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      {/* Main Content */}
      <main>
        {renderContent()}
      </main>
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};

// ============================================
// ROOT APP COMPONENT
// ============================================

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
