import React from 'react';

interface FacultyDashboardContentProps {
  activeSection: string;
}

export const FacultyDashboardContent: React.FC<FacultyDashboardContentProps> = ({
  activeSection
}) => {
  if (activeSection === 'dashboard') {
    return <FacultyDashboardView />;
  }
  
  if (activeSection === 'attendance') {
    return <FacultyAttendanceView />;
  }
  
  if (activeSection === 'students') {
    return <FacultyStudentsView />;
  }
  
  return <div className="text-white">Section: {activeSection}</div>;
};

const FacultyDashboardView = () => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="156"
          change="↗ +12 this month"
          changeColor="text-green-400"
          icon="👥"
          gradient="from-blue-500 to-purple-500"
        />
        <StatCard
          title="Classes Today"
          value="4"
          change="2 completed"
          changeColor="text-blue-400"
          icon="📚"
          gradient="from-green-500 to-blue-500"
        />
        <StatCard
          title="Pending Applications"
          value="8"
          change="3 urgent"
          changeColor="text-yellow-400"
          icon="📋"
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Assignments Due"
          value="12"
          change="5 graded"
          changeColor="text-purple-400"
          icon="📝"
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="card-dark rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <QuickActionCard icon="✅" title="Mark Attendance" gradient="from-blue-500/20 to-purple-500/20" />
          <QuickActionCard icon="👥" title="Manage Students" gradient="from-green-500/20 to-blue-500/20" />
          <QuickActionCard icon="📝" title="Create Assignment" gradient="from-purple-500/20 to-pink-500/20" />
          <QuickActionCard icon="📋" title="Review Applications" gradient="from-yellow-500/20 to-orange-500/20" />
        </div>
      </div>

      {/* AI Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AIAnalyticsCard />
        <CommunicationHub />
      </div>
    </>
  );
};

const FacultyAttendanceView = () => {
  return (
    <div className="card-dark rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-8">Mark Attendance</h3>
      
      <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Subject</label>
          <select className="w-full px-4 py-3 input-dark rounded-xl">
            <option>Computer Science 101</option>
            <option>Mathematics 201</option>
            <option>Physics 301</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
          <input type="date" className="w-full px-4 py-3 input-dark rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
          <input type="time" className="w-full px-4 py-3 input-dark rounded-xl" />
        </div>
      </form>

      <div className="space-y-3">
        <h4 className="text-xl font-bold text-white mb-6">Students (CS101)</h4>
        {['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'].map((name, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <input type="checkbox" className="mr-4 w-5 h-5 text-purple-600 rounded" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <span className="font-semibold text-white">{name}</span>
                  <p className="text-sm text-gray-400">STU202400{index + 1}</p>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
              Present
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FacultyStudentsView = () => {
  return (
    <div className="card-dark rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-8">Student Management</h3>
      <div className="text-white">Student management features coming soon...</div>
    </div>
  );
};

const StatCard = ({ title, value, change, changeColor, icon, gradient }: any) => (
  <div className="stat-card rounded-2xl p-6 hover-lift">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
      </div>
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ icon, title, gradient }: any) => (
  <button className={`p-6 bg-gradient-to-br ${gradient} rounded-2xl hover-lift border border-blue-500/30 group`}>
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-sm font-semibold text-white">{title}</div>
  </button>
);

const AIAnalyticsCard = () => (
  <div className="card-dark rounded-2xl p-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
          <span className="text-2xl">🤖</span>
        </div>
        <h3 className="text-2xl font-bold text-white">AI Insights</h3>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors">
          <span className="text-sm">🔄</span>
        </button>
        <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
          <span className="text-sm">📊</span>
        </button>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center mb-2">
          <span className="text-green-400 mr-2">📈</span>
          <span className="font-semibold text-white">Class Performance</span>
        </div>
        <p className="text-sm text-gray-300">CS101 attendance increased by 15% this week. Great engagement!</p>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
        <div className="flex items-center mb-2">
          <span className="text-blue-400 mr-2">🎯</span>
          <span className="font-semibold text-white">Assignment Analytics</span>
        </div>
        <p className="text-sm text-gray-300">85% of students submitted on time. Consider extending deadline for struggling students.</p>
      </div>
    </div>
  </div>
);

const CommunicationHub = () => (
  <div className="card-dark rounded-2xl p-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-2xl font-bold text-white">Messages</h3>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-bold text-white">AJ</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Alice Johnson</span>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
          <p className="text-sm text-gray-400">Question about assignment deadline</p>
        </div>
      </div>
    </div>
  </div>
);