import React, { useState } from 'react';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingOrbs />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          <AdminHeader />
          
          {/* Content Area */}
          <main className="flex-1 p-8 overflow-auto">
            <AdminDashboardContent activeSection={activeSection} />
          </main>
        </div>
      </div>
    </div>
  );
};