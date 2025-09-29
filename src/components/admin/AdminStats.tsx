import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AdminStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalAssignments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [
        studentsRes,
        facultyRes,
        departmentsRes,
        classesRes,
        subjectsRes,
        assignmentsRes
      ] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('faculty').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('classes').select('id', { count: 'exact', head: true }),
        supabase.from('subjects').select('id', { count: 'exact', head: true }),
        supabase.from('assignments').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        totalFaculty: facultyRes.count || 0,
        totalDepartments: departmentsRes.count || 0,
        totalClasses: classesRes.count || 0,
        totalSubjects: subjectsRes.count || 0,
        totalAssignments: assignmentsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient }: any) => (
    <div className={`stat-card rounded-2xl p-6 hover-lift bg-gradient-to-br ${gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">
            {loading ? '...' : value}
          </p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-300">Manage your institution's data and operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="👥"
          gradient="from-blue-500 to-purple-500"
        />
        <StatCard
          title="Total Faculty"
          value={stats.totalFaculty}
          icon="👨‍🏫"
          gradient="from-green-500 to-blue-500"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon="🏢"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses}
          icon="🎓"
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Subjects"
          value={stats.totalSubjects}
          icon="📚"
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments}
          icon="📝"
          gradient="from-pink-500 to-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="card-dark rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <QuickActionCard icon="👥" title="Add Student" />
          <QuickActionCard icon="👨‍🏫" title="Add Faculty" />
          <QuickActionCard icon="🏢" title="Add Department" />
          <QuickActionCard icon="📚" title="Add Subject" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-dark rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-800/50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">👥</span>
            </div>
            <div>
              <p className="text-white font-semibold">New student registered</p>
              <p className="text-gray-400 text-sm">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-800/50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">📝</span>
            </div>
            <div>
              <p className="text-white font-semibold">Assignment created</p>
              <p className="text-gray-400 text-sm">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const QuickActionCard = ({ icon, title }: any) => (
  <button className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl hover-lift border border-blue-500/30 group">
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-sm font-semibold text-white">{title}</div>
  </button>
);