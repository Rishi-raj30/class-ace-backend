import React from 'react';

interface StudentDashboardContentProps {
  activeSection: string;
}

export const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  activeSection
}) => {
  if (activeSection === 'dashboard') {
    return <StudentDashboardView />;
  }
  
  if (activeSection === 'attendance') {
    return <StudentAttendanceView />;
  }
  
  if (activeSection === 'fees') {
    return <StudentFeesView />;
  }
  
  if (activeSection === 'assignments') {
    return <StudentAssignmentsView />;
  }
  
  return <div className="text-white">Section: {activeSection}</div>;
};

const StudentDashboardView = () => {
  return (
    <>
      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Attendance"
          value="92%"
          change="Excellent"
          changeColor="text-green-400"
          icon="✅"
          gradient="from-green-500 to-blue-500"
        />
        <StatCard
          title="GPA"
          value="3.8"
          change="Dean's List"
          changeColor="text-blue-400"
          icon="📊"
          gradient="from-blue-500 to-purple-500"
        />
        <StatCard
          title="Assignments"
          value="3"
          change="Pending"
          changeColor="text-orange-400"
          icon="📝"
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          title="Fee Status"
          value="Paid"
          change="Up to date"
          changeColor="text-green-400"
          icon="💰"
          gradient="from-green-500 to-teal-500"
        />
      </div>

      {/* AI Learning Assistant & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AILearningAssistant />
        <StudentCommunicationHub />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </>
  );
};

const StudentAttendanceView = () => {
  return (
    <div className="card-dark rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-8">My Attendance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">92%</div>
          <div className="text-gray-300">Overall Attendance</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400 mb-2">23</div>
          <div className="text-gray-300">Classes This Month</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-400 mb-2">2</div>
          <div className="text-gray-300">Absent Days</div>
        </div>
      </div>

      <div className="space-y-4">
        {['Computer Science 101', 'Mathematics 201', 'Physics 301'].map((subject, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">{subject}</h4>
                <p className="text-sm text-gray-400">Present: 18 / Absent: 2</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">90%</div>
                <div className="text-xs text-gray-500">Attendance</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentFeesView = () => {
  return (
    <div className="card-dark rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-8">Fee Management</h3>
      
      <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-green-400">Fee Status: PAID</h4>
            <p className="text-gray-300">All fees for current semester are paid</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-white">Semester Fee</h4>
              <p className="text-sm text-gray-400">Fall 2024</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">$2,500</div>
              <div className="text-xs text-green-400">Paid</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-white">Library Fee</h4>
              <p className="text-sm text-gray-400">Annual</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">$100</div>
              <div className="text-xs text-green-400">Paid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentAssignmentsView = () => {
  return (
    <div className="card-dark rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-8">My Assignments</h3>
      
      <div className="space-y-4">
        {[
          { title: 'Data Structures Project', subject: 'CS101', due: '2024-03-15', status: 'Pending' },
          { title: 'Calculus Problem Set', subject: 'MATH201', due: '2024-03-12', status: 'Submitted' },
          { title: 'Physics Lab Report', subject: 'PHY301', due: '2024-03-18', status: 'Graded' }
        ].map((assignment, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">{assignment.title}</h4>
                <p className="text-sm text-gray-400">{assignment.subject} • Due: {assignment.due}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full border ${
                  assignment.status === 'Pending' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                  assignment.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  'bg-green-500/20 text-green-400 border-green-500/30'
                }`}>
                  {assignment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
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

const AILearningAssistant = () => (
  <div className="card-dark rounded-2xl p-8">
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
        <span className="text-2xl">🤖</span>
      </div>
      <h3 className="text-2xl font-bold text-white">AI Learning Assistant</h3>
    </div>
    
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
        <div className="flex items-center mb-2">
          <span className="text-blue-400 mr-2">📚</span>
          <span className="font-semibold text-white">Study Recommendation</span>
        </div>
        <p className="text-sm text-gray-300">Focus on Chapter 7 - Data Structures. You're 85% ready for the upcoming exam!</p>
        <div className="mt-2">
          <button className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-colors">
            Start Study Session
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center mb-2">
          <span className="text-green-400 mr-2">⏰</span>
          <span className="font-semibold text-white">Schedule Optimization</span>
        </div>
        <p className="text-sm text-gray-300">Best study time for you: 2-4 PM. Your focus peaks during these hours!</p>
        <div className="mt-2">
          <button className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full hover:bg-green-500/30 transition-colors">
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StudentCommunicationHub = () => (
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
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-bold text-white">JS</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Dr. John Smith</span>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
          <p className="text-sm text-gray-400">Great work on your latest assignment!</p>
        </div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="card-dark rounded-2xl p-8">
    <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
    <div className="space-y-4">
      {[
        { action: 'Submitted assignment', subject: 'CS101', time: '2 hours ago' },
        { action: 'Attended class', subject: 'MATH201', time: '1 day ago' },
        { action: 'Received grade', subject: 'PHY301', time: '2 days ago' }
      ].map((activity, index) => (
        <div key={index} className="flex items-center p-3 bg-gray-800/50 rounded-xl">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
          <div className="flex-1">
            <span className="text-white">{activity.action}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-purple-400">{activity.subject}</span>
          </div>
          <span className="text-xs text-gray-500">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);