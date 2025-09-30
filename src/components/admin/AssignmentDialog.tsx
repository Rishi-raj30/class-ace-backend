import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subject_id: z.string().min(1, 'Subject is required'),
  class_id: z.string().min(1, 'Class is required'),
  due_date: z.string().min(1, 'Due date is required'),
  max_marks: z.coerce.number().min(1),
  status: z.enum(['active', 'completed', 'cancelled']),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: any;
  onSuccess: () => void;
}

export const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onOpenChange,
  assignment,
  onSuccess,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const { toast } = useToast();
  const isEdit = !!assignment;

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title || '',
      description: assignment?.description || '',
      subject_id: assignment?.subject_id || '',
      class_id: assignment?.class_id || '',
      due_date: assignment?.due_date || '',
      max_marks: assignment?.max_marks || 100,
      status: assignment?.status || 'active',
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (assignment) {
      form.reset({
        title: assignment.title || '',
        description: assignment.description || '',
        subject_id: assignment.subject_id || '',
        class_id: assignment.class_id || '',
        due_date: assignment.due_date || '',
        max_marks: assignment.max_marks || 100,
        status: assignment.status || 'active',
      });
    }
  }, [assignment]);

  const fetchData = async () => {
    const [subjectsRes, classesRes] = await Promise.all([
      supabase.from('subjects').select('*'),
      supabase.from('classes').select('*'),
    ]);
    setSubjects(subjectsRes.data || []);
    setClasses(classesRes.data || []);
  };

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('assignments')
          .update(data)
          .eq('id', assignment.id);

        if (error) throw error;
        toast({ title: "Success", description: "Assignment updated successfully" });
      } else {
        const { error } = await supabase.from('assignments').insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Assignment added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save assignment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Assignment' : 'Add New Assignment'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="input-dark" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="input-dark" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                            {subject.name}
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Due Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Max Marks</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Assignment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
