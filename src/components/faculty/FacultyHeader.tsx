import React, { useState, useEffect } from 'react';

interface FacultyHeaderProps {
  onToggleSidebar: () => void;
  pageTitle: string;
}

export const FacultyHeader: React.FC<FacultyHeaderProps> = ({
  onToggleSidebar,
  pageTitle
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gray-800/50 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar}
            className="mr-4 p-3 rounded-xl hover:bg-purple-500/20 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-300">{currentTime}</div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">JS</span>
            </div>
            <div className="text-sm font-medium text-white">Dr. John Smith</div>
          </div>
        </div>
      </div>
    </header>
  );
};