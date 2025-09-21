import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface FacultyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacultyLoginModal: React.FC<FacultyLoginModalProps> = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, simple demo login
    if (credentials.email && credentials.password) {
      localStorage.setItem('userType', 'faculty');
      localStorage.setItem('userName', 'Dr. John Smith');
      toast({
        title: "Welcome back, Dr. Smith!",
        description: "Ready to inspire minds today?",
      });
      navigate('/faculty');
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
                {/* Faculty Character SVG */}
                <circle cx="90" cy="70" r="30" fill="hsl(262 83% 58% / 0.2)"/>
                <circle cx="90" cy="70" r="25" fill="#f4a261"/>
                {/* Hair */}
                <path d="M65 50 Q90 35 115 50 Q110 43 90 43 Q70 43 65 50" fill="#4a5568"/>
                {/* Eyes */}
                <circle cx="82" cy="68" r="3" fill="#2d3748"/>
                <circle cx="98" cy="68" r="3" fill="#2d3748"/>
                {/* Smile */}
                <path d="M78 78 Q90 88 102 78" stroke="#2d3748" strokeWidth="2" fill="none"/>
                {/* Body */}
                <rect x="70" y="95" width="40" height="55" rx="20" fill="hsl(262 83% 58%)"/>
                {/* Arms */}
                <circle cx="55" cy="115" r="7" fill="#f4a261"/>
                <circle cx="125" cy="115" r="7" fill="#f4a261"/>
                <rect x="50" y="108" width="20" height="14" rx="7" fill="hsl(262 83% 58%)"/>
                <rect x="110" y="108" width="20" height="14" rx="7" fill="hsl(262 83% 58%)"/>
                {/* Pointer */}
                <rect x="130" y="110" width="25" height="3" rx="1" fill="#2d3748"/>
                <polygon points="155,111.5 160,108 160,115" fill="#2d3748"/>
                {/* Legs */}
                <rect x="75" y="150" width="10" height="20" rx="5" fill="#2d3748"/>
                <rect x="95" y="150" width="10" height="20" rx="5" fill="#2d3748"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Welcome Back!</h4>
            <p className="text-gray-300 text-center">Ready to make every log count in your teaching journey today?</p>
          </div>
          
          {/* Form Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-white">Faculty Login</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email or Username</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 input-dark rounded-xl" 
                  placeholder="john.smith@college.edu"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
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
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};