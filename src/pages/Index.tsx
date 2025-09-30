import React, { useState, useEffect } from 'react';
import { FacultyLoginModal } from '@/components/auth/FacultyLoginModal';
import { StudentLoginModal } from '@/components/auth/StudentLoginModal';
import { AdminLoginModal } from '@/components/auth/AdminLoginModal';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';

const Index = () => {
  const [showFacultyLogin, setShowFacultyLogin] = useState(false);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <FloatingOrbs />
      
      {/* Hero Content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <div className="glass-card rounded-3xl p-12 text-center max-w-4xl mx-auto neon-glow">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-gradient mb-4">
              ClassLog
            </div>
            <p className="text-2xl text-white/80 font-medium">
              Modern College Management System
            </p>
            <p className="text-lg text-white/60 mt-2">
              Empowering Education Through Technology
            </p>
          </div>

          {/* Time Display */}
          <div className="mb-12">
            <div className="text-lg text-white/70 mb-2">Current Time</div>
            <div className="text-3xl font-bold text-white pulse-glow">
              {currentTime}
            </div>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Admin Login */}
            <button
              onClick={() => setShowAdminLogin(true)}
              className="group p-8 glass-card rounded-2xl hover-lift border border-white/10 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🔐
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
              <p className="text-white/70">
                Manage users, departments, classes, and system configuration
              </p>
              <div className="mt-6">
                <span className="btn-primary px-8 py-3 rounded-xl font-semibold text-white inline-block">
                  Admin Login
                </span>
              </div>
            </button>

            {/* Faculty Login */}
            <button
              onClick={() => setShowFacultyLogin(true)}
              className="group p-8 glass-card rounded-2xl hover-lift border border-white/10 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                👨‍🏫
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Faculty Portal</h3>
              <p className="text-white/70">
                Access your teaching dashboard, manage classes, and track student progress
              </p>
              <div className="mt-6">
                <span className="btn-primary px-8 py-3 rounded-xl font-semibold text-white inline-block">
                  Faculty Login
                </span>
              </div>
            </button>

            {/* Student Login */}
            <button
              onClick={() => setShowStudentLogin(true)}
              className="group p-8 glass-card rounded-2xl hover-lift border border-white/10 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🎓
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Student Portal</h3>
              <p className="text-white/70">
                View your attendance, assignments, and academic progress
              </p>
              <div className="mt-6">
                <span className="btn-primary px-8 py-3 rounded-xl font-semibold text-white inline-block">
                  Student Login
                </span>
              </div>
            </button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-sm">
            <div className="text-white/60">
              <span className="text-lg mb-1 block">📊</span>
              AI Analytics
            </div>
            <div className="text-white/60">
              <span className="text-lg mb-1 block">📅</span>
              Smart Scheduling
            </div>
            <div className="text-white/60">
              <span className="text-lg mb-1 block">💬</span>
              Real-time Chat
            </div>
            <div className="text-white/60">
              <span className="text-lg mb-1 block">📱</span>
              Mobile Ready
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
      <FacultyLoginModal 
        isOpen={showFacultyLogin} 
        onClose={() => setShowFacultyLogin(false)} 
      />
      <StudentLoginModal 
        isOpen={showStudentLogin} 
        onClose={() => setShowStudentLogin(false)} 
      />
    </div>
  );
};

export default Index;
