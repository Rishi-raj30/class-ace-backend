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

const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  department_id: z.string().min(1, 'Department is required'),
  semester: z.coerce.number().min(1).max(8),
  credits: z.coerce.number().min(1),
  description: z.string().optional(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: any;
  onSuccess: () => void;
}

export const SubjectDialog: React.FC<SubjectDialogProps> = ({
  open,
  onOpenChange,
  subject,
  onSuccess,
}) => {
  const [departments, setDepartments] = useState([]);
  const { toast } = useToast();
  const isEdit = !!subject;

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject?.name || '',
      code: subject?.code || '',
      department_id: subject?.department_id || '',
      semester: subject?.semester || 1,
      credits: subject?.credits || 3,
      description: subject?.description || '',
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (subject) {
      form.reset({
        name: subject.name || '',
        code: subject.code || '',
        department_id: subject.department_id || '',
        semester: subject.semester || 1,
        credits: subject.credits || 3,
        description: subject.description || '',
      });
    }
  }, [subject]);

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('*');
    setDepartments(data || []);
  };

  const onSubmit = async (data: SubjectFormData) => {
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('subjects')
          .update(data)
          .eq('id', subject.id);

        if (error) throw error;
        toast({ title: "Success", description: "Subject updated successfully" });
      } else {
        const { error } = await supabase.from('subjects').insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Subject added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save subject",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Subject Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" placeholder="Data Structures" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Subject Code</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" placeholder="CS201" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
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
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Semester</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" max="8" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Credits</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Subject'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
