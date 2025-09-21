import React from 'react';

interface FacultySidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({
  isOpen,
  activeSection,
  onSectionChange,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Mark Attendance', icon: '✅' },
    { id: 'students', label: 'Student Management', icon: '👥' },
    { id: 'timetable', label: 'Timetable', icon: '📅' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'applications', label: 'Applications', icon: '📋' },
    { id: 'myattendance', label: 'My Attendance', icon: '⏰' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full w-72 sidebar-dark transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">👨‍🏫</span>
          </div>
          <h2 className="text-xl font-bold text-white">Faculty Portal</h2>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`nav-item w-full flex items-center px-4 py-4 text-gray-300 hover:text-white transition-all duration-300 rounded-r-xl mb-2 ${
              activeSection === item.id ? 'active' : ''
            }`}
          >
            <span className="mr-4 text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        
        <div className="mt-8 pt-4 border-t border-purple-500/20">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 rounded-xl"
          >
            <span className="mr-4 text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};