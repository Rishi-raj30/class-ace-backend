import React from 'react';
import { AdminStats } from './AdminStats';
import { StudentManagement } from './StudentManagement';
import { FacultyManagement } from './FacultyManagement';
import { DepartmentManagement } from './DepartmentManagement';
import { ClassManagement } from './ClassManagement';
import { SubjectManagement } from './SubjectManagement';
import { AssignmentManagement } from './AssignmentManagement';
import { TimetableManagement } from './TimetableManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { UserManagement } from './UserManagement';

interface AdminDashboardContentProps {
  activeSection: string;
}

export const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  activeSection
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminStats />;
      case 'students':
        return <StudentManagement />;
      case 'faculty':
        return <FacultyManagement />;
      case 'departments':
        return <DepartmentManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'subjects':
        return <SubjectManagement />;
      case 'assignments':
        return <AssignmentManagement />;
      case 'timetable':
        return <TimetableManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="space-y-8">
      {renderContent()}
    </div>
  );
};