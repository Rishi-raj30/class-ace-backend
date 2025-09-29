import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminHeader = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="h-20 bg-white/10 backdrop-blur-lg border-b border-white/20 flex items-center justify-between px-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {profile?.full_name?.charAt(0) || 'A'}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold">{profile?.full_name || 'Admin'}</p>
            <p className="text-gray-300 text-sm capitalize">{profile?.role || 'admin'}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};