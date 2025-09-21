import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({ studentId: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, simple demo login
    if (credentials.studentId && credentials.password) {
      localStorage.setItem('userType', 'student');
      localStorage.setItem('userName', 'Alice Johnson');
      toast({
        title: "Welcome back, Alice!",
        description: "Let's achieve greatness today!",
      });
      navigate('/student');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-dark flex items-center justify-center z-50 p-4">
      <div className="card-dark rounded-3xl p-8 max-w-3xl w-full modal-enter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Section */}
          <div className="hidden lg:flex flex-col items-center justify-center p-8">
            <div className="mb-6">
              <svg width="180" height="180" viewBox="0 0 180 180" className="animate-pulse">
                {/* Student Character */}
                <circle cx="90" cy="70" r="30" fill="hsl(217 91% 60% / 0.2)"/>
                <circle cx="90" cy="70" r="25" fill="#f4a261"/>
                {/* Hair */}
                <path d="M65 55 Q90 40 115 55 Q110 48 90 48 Q70 48 65 55" fill="#8b4513"/>
                {/* Eyes */}
                <circle cx="82" cy="68" r="3" fill="#2d3748"/>
                <circle cx="98" cy="68" r="3" fill="#2d3748"/>
                {/* Smile */}
                <path d="M78 78 Q90 88 102 78" stroke="#2d3748" strokeWidth="2" fill="none"/>
                {/* Body */}
                <rect x="70" y="95" width="40" height="55" rx="20" fill="#10b981"/>
                {/* Backpack straps */}
                <rect x="75" y="95" width="4" height="30" rx="2" fill="#6b7280"/>
                <rect x="101" y="95" width="4" height="30" rx="2" fill="#6b7280"/>
                {/* Arms */}
                <circle cx="55" cy="115" r="7" fill="#f4a261"/>
                <circle cx="125" cy="115" r="7" fill="#f4a261"/>
                <rect x="50" y="108" width="20" height="14" rx="7" fill="#10b981"/>
                <rect x="110" y="108" width="20" height="14" rx="7" fill="#10b981"/>
                {/* Book in hand */}
                <rect x="35" y="108" width="12" height="16" rx="2" fill="hsl(217 91% 60%)"/>
                <line x1="37" y1="112" x2="45" y2="112" stroke="#fff" strokeWidth="1"/>
                <line x1="37" y1="116" x2="45" y2="116" stroke="#fff" strokeWidth="1"/>
                <line x1="37" y1="120" x2="45" y2="120" stroke="#fff" strokeWidth="1"/>
                {/* Backpack */}
                <rect x="115" y="100" width="20" height="25" rx="5" fill="#ef4444"/>
                <rect x="118" y="103" width="14" height="3" rx="1" fill="#dc2626"/>
                <circle cx="125" cy="110" r="2" fill="#dc2626"/>
                {/* Legs */}
                <rect x="75" y="150" width="10" height="20" rx="5" fill="#1e40af"/>
                <rect x="95" y="150" width="10" height="20" rx="5" fill="#1e40af"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Hey Student!</h4>
            <p className="text-gray-300 text-center">Ready to track your progress and make every log count in your learning adventure?</p>
          </div>
          
          {/* Form Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-white">Student Login</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Student ID</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 input-dark rounded-xl" 
                  placeholder="STU2024001"
                  value={credentials.studentId}
                  onChange={(e) => setCredentials({...credentials, studentId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full px-4 py-3 input-dark rounded-xl" 
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full btn-primary text-white font-semibold py-4 px-8 rounded-xl text-lg hover-lift">
                Enter Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};