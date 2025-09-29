import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          departments (name, code)
        `);

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-dark rounded-2xl p-8">
        <div className="text-white">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Class Management</h2>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Add Class
        </Button>
      </div>

      <div className="card-dark rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">No classes found</p>
            </div>
          ) : (
            classes.map((cls: any) => (
              <div key={cls.id} className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{cls.section}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    Edit
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                <p className="text-gray-400 text-sm">Department: {cls.departments?.name}</p>
                <p className="text-gray-400 text-sm">Semester: {cls.semester}</p>
                <p className="text-gray-400 text-sm">Section: {cls.section}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};