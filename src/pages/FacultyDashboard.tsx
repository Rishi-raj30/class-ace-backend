import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacultySidebar } from '@/components/faculty/FacultySidebar';
import { FacultyHeader } from '@/components/faculty/FacultyHeader';
import { FacultyDashboardContent } from '@/components/faculty/FacultyDashboardContent';
import { toast } from '@/hooks/use-toast';

export const FacultyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as faculty
    const userType = localStorage.getItem('userType');
    if (userType !== 'faculty') {
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
      <FacultySidebar 
        isOpen={sidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <FacultyHeader 
          onToggleSidebar={toggleSidebar}
          pageTitle={getPageTitle(activeSection)}
        />
        
        <main className="p-8">
          <FacultyDashboardContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (section: string) => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    attendance: 'Mark Attendance',
    students: 'Student Management',
    timetable: 'Timetable',
    assignments: 'Assignment Center',
    applications: 'Applications Review',
    myattendance: 'My Attendance'
  };
  return titles[section] || 'Dashboard';
};