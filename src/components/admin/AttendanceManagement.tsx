import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AttendanceDialog } from './AttendanceDialog';

export const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>();
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students!inner (
            profiles!inner (full_name),
            roll_number
          ),
          subjects (name, code)
        `)
        .order('date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-dark rounded-2xl p-8">
        <div className="text-white">Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Attendance Management</h2>
        <Button
          onClick={() => {
            setSelectedAttendance(undefined);
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Mark Attendance
        </Button>
      </div>

      <AttendanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        attendance={selectedAttendance}
        onSuccess={fetchAttendance}
      />

      <div className="card-dark rounded-2xl p-8">
        <div className="space-y-4">
          {attendance.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No attendance records found</p>
            </div>
          ) : (
            attendance.map((record: any) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {record.students?.profiles?.full_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{record.students?.profiles?.full_name}</h3>
                    <p className="text-sm text-gray-400">Roll: {record.students?.roll_number}</p>
                    <p className="text-sm text-gray-400">Subject: {record.subjects?.name} ({record.subjects?.code})</p>
                    <p className="text-sm text-gray-400">Date: {new Date(record.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    record.status === 'present' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : record.status === 'absent'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {record.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:text-white"
                    onClick={() => {
                      setSelectedAttendance(record);
                      setDialogOpen(true);
                    }}
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