import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  roll_number: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  enrollment_date?: string;
  status: string;
  profiles: {
    full_name: string;
    email: string;
  };
  classes: {
    name: string;
  };
}

export const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles:user_id (full_name, email),
          classes (name)
        `);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-dark rounded-2xl p-8">
        <div className="text-white">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Student Management</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Add Student
        </Button>
      </div>

      <div className="card-dark rounded-2xl p-8">
        <div className="space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No students found</p>
            </div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {student.profiles?.full_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{student.profiles?.full_name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-400">{student.roll_number}</p>
                    <p className="text-sm text-gray-400">{student.profiles?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    student.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {student.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};