import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const TimetableManagement = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          subjects (name, code),
          classes (name),
          faculty!inner (
            profiles!inner (full_name)
          )
        `)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setTimetable(data || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timetable",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-dark rounded-2xl p-8">
        <div className="text-white">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Timetable Management</h2>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Add Schedule
        </Button>
      </div>

      <div className="card-dark rounded-2xl p-8">
        {timetable.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No timetable entries found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day, dayIndex) => {
              const daySchedule = timetable.filter((item: any) => item.day_of_week === dayIndex + 1);
              
              return (
                <div key={day} className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{day}</h3>
                  {daySchedule.length === 0 ? (
                    <p className="text-gray-400 text-sm">No classes scheduled</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {daySchedule.map((schedule: any) => (
                        <div key={schedule.id} className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{schedule.subjects?.name}</h4>
                              <p className="text-sm text-gray-300">{schedule.subjects?.code}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:text-white text-xs"
                            >
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-400">
                            <p>Class: {schedule.classes?.name}</p>
                            <p>Faculty: {schedule.faculty?.profiles?.full_name || 'TBA'}</p>
                            <p>Time: {schedule.start_time} - {schedule.end_time}</p>
                            <p>Room: {schedule.room_number || 'TBA'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};