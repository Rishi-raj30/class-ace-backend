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

const classSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  department_id: z.string().min(1, 'Department is required'),
  semester: z.coerce.number().min(1).max(8),
  section: z.string().min(1, 'Section is required'),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: any;
  onSuccess: () => void;
}

export const ClassDialog: React.FC<ClassDialogProps> = ({
  open,
  onOpenChange,
  classData,
  onSuccess,
}) => {
  const [departments, setDepartments] = useState([]);
  const { toast } = useToast();
  const isEdit = !!classData;

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: classData?.name || '',
      department_id: classData?.department_id || '',
      semester: classData?.semester || 1,
      section: classData?.section || '',
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (classData) {
      form.reset({
        name: classData.name || '',
        department_id: classData.department_id || '',
        semester: classData.semester || 1,
        section: classData.section || '',
      });
    }
  }, [classData]);

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('*');
    setDepartments(data || []);
  };

  const onSubmit = async (data: ClassFormData) => {
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('classes')
          .update(data)
          .eq('id', classData.id);

        if (error) throw error;
        toast({ title: "Success", description: "Class updated successfully" });
      } else {
        const { error } = await supabase.from('classes').insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Class added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save class",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Class' : 'Add New Class'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Class Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="input-dark" placeholder="B.Tech Computer Science" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Section</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" placeholder="A" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Class'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
