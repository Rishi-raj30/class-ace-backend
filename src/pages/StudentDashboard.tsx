import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { StudentDashboardContent } from '@/components/student/StudentDashboardContent';
import { toast } from '@/hooks/use-toast';

export const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as student
    const userType = localStorage.getItem('userType');
    if (userType !== 'student') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    toast({
      title: "Successfully logged out",
      description: "See you soon!",
    });
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <StudentSidebar 
        isOpen={sidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <StudentHeader 
          onToggleSidebar={toggleSidebar}
          pageTitle={getPageTitle(activeSection)}
        />
        
        <main className="p-8">
          <StudentDashboardContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (section: string) => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    attendance: 'My Attendance',
    fees: 'Fee Management',
    assignments: 'My Assignments',
  };
  return titles[section] || 'Dashboard';
};