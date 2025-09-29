import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          *,
          departments (name, code)
        `);

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subjects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-dark rounded-2xl p-8">
        <div className="text-white">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Subject Management</h2>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Add Subject
        </Button>
      </div>

      <div className="card-dark rounded-2xl p-8">
        <div className="space-y-4">
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No subjects found</p>
            </div>
          ) : (
            subjects.map((subject: any) => (
              <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{subject.code}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{subject.name}</h3>
                    <p className="text-sm text-gray-400">Code: {subject.code}</p>
                    <p className="text-sm text-gray-400">Department: {subject.departments?.name}</p>
                    <p className="text-sm text-gray-400">Semester: {subject.semester} | Credits: {subject.credits}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  Edit
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};