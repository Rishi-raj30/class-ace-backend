import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const attendanceSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['present', 'absent', 'late']),
  remarks: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: any;
  onSuccess: () => void;
}

export const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  open,
  onOpenChange,
  attendance,
  onSuccess,
}) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const { toast } = useToast();
  const isEdit = !!attendance;

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      student_id: attendance?.student_id || '',
      subject_id: attendance?.subject_id || '',
      date: attendance?.date || new Date().toISOString().split('T')[0],
      status: attendance?.status || 'present',
      remarks: attendance?.remarks || '',
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (attendance) {
      form.reset({
        student_id: attendance.student_id || '',
        subject_id: attendance.subject_id || '',
        date: attendance.date || new Date().toISOString().split('T')[0],
        status: attendance.status || 'present',
        remarks: attendance.remarks || '',
      });
    }
  }, [attendance]);

  const fetchData = async () => {
    const [studentsRes, subjectsRes] = await Promise.all([
      supabase.from('students').select('*, profiles:user_id(full_name)'),
      supabase.from('subjects').select('*'),
    ]);
    setStudents(studentsRes.data || []);
    setSubjects(subjectsRes.data || []);
  };

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('attendance')
          .update(data)
          .eq('id', attendance.id);

        if (error) throw error;
        toast({ title: "Success", description: "Attendance updated successfully" });
      } else {
        const { error } = await supabase.from('attendance').insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Attendance added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save attendance",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Attendance' : 'Mark Attendance'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student: any) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.profiles?.full_name} ({student.roll_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="input-dark" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-dark">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} className="input-dark" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Mark Attendance'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
