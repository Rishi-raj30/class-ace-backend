import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: any;
  onSuccess: () => void;
}

export const DepartmentDialog: React.FC<DepartmentDialogProps> = ({
  open,
  onOpenChange,
  department,
  onSuccess,
}) => {
  const { toast } = useToast();
  const isEdit = !!department;

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || '',
      code: department?.code || '',
      description: department?.description || '',
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name || '',
        code: department.code || '',
        description: department.description || '',
      });
    }
  }, [department]);

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('departments')
          .update(data)
          .eq('id', department.id);

        if (error) throw error;
        toast({ title: "Success", description: "Department updated successfully" });
      } else {
        const { error } = await supabase.from('departments').insert(data);

        if (error) throw error;
        toast({ title: "Success", description: "Department added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save department",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Department' : 'Add New Department'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Department Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="input-dark" placeholder="Computer Science" />
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
                  <FormLabel className="text-white">Department Code</FormLabel>
                  <FormControl>
                    <Input {...field} className="input-dark" placeholder="CS" />
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Department'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
