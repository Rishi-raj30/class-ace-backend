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

const timetableSchema = z.object({
  subject_id: z.string().min(1, 'Subject is required'),
  class_id: z.string().min(1, 'Class is required'),
  faculty_id: z.string().min(1, 'Faculty is required'),
  day_of_week: z.coerce.number().min(1).max(7),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  room_number: z.string().optional(),
});

type TimetableFormData = z.infer<typeof timetableSchema>;

interface TimetableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: any;
  onSuccess: () => void;
}

export const TimetableDialog: React.FC<TimetableDialogProps> = ({
  open,
  onOpenChange,
  schedule,
  onSuccess,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const { toast } = useToast();
  const isEdit = !!schedule;

  const form = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      subject_id: schedule?.subject_id || '',
      class_id: schedule?.class_id || '',
      faculty_id: schedule?.faculty_id || '',
      day_of_week: schedule?.day_of_week || 1,
      start_time: schedule?.start_time || '',
      end_time: schedule?.end_time || '',
      room_number: schedule?.room_number || '',
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (schedule) {
      form.reset({
        subject_id: schedule.subject_id || '',
        class_id: schedule.class_id || '',
        faculty_id: schedule.faculty_id || '',
        day_of_week: schedule.day_of_week || 1,
        start_time: schedule.start_time || '',
        end_time: schedule.end_time || '',
        room_number: schedule.room_number || '',
      });
    }
  }, [schedule]);

  const fetchData = async () => {
    const [subjectsRes, classesRes, facultyRes] = await Promise.all([
      supabase.from('subjects').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('faculty').select('*, profiles:user_id(full_name)'),
    ]);
    setSubjects(subjectsRes.data || []);
    setClasses(classesRes.data || []);
    setFaculty(facultyRes.data || []);
  };

  const onSubmit = async (data: TimetableFormData) => {
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('timetable')
          .update(data)
          .eq('id', schedule.id);

        if (error) throw error;
        toast({ title: "Success", description: "Schedule updated successfully" });
      } else {
        const { error } = await supabase.from('timetable').insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Schedule added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save schedule",
        variant: "destructive",
      });
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Schedule' : 'Add New Schedule'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-dark">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} - {cls.section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="faculty_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Faculty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faculty.map((member: any) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.profiles?.full_name} ({member.employee_id})
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
              name="day_of_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Day</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="input-dark">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {days.map((day, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Start Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">End Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="room_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Room Number</FormLabel>
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Schedule'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
