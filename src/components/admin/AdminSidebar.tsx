import React from 'react';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  setActiveSection
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'departments', label: 'Departments', icon: '🏢' },
    { id: 'classes', label: 'Classes', icon: '🎓' },
    { id: 'subjects', label: 'Subjects', icon: '📚' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'timetable', label: 'Timetable', icon: '📅' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'users', label: 'User Management', icon: '⚙️' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-lg border-r border-white/20 z-20">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ClassLog</h2>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};