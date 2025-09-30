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

const facultySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  full_name: z.string().min(1, 'Name is required'),
  employee_id: z.string().min(1, 'Employee ID is required'),
  department_id: z.string().min(1, 'Department is required'),
  designation: z.string().optional(),
  phone: z.string().optional(),
});

type FacultyFormData = z.infer<typeof facultySchema>;

interface FacultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty?: any;
  onSuccess: () => void;
}

export const FacultyDialog: React.FC<FacultyDialogProps> = ({
  open,
  onOpenChange,
  faculty,
  onSuccess,
}) => {
  const [departments, setDepartments] = useState([]);
  const { toast } = useToast();
  const isEdit = !!faculty;

  const form = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      email: faculty?.profiles?.email || '',
      full_name: faculty?.profiles?.full_name || '',
      employee_id: faculty?.employee_id || '',
      department_id: faculty?.department_id || '',
      designation: faculty?.designation || '',
      phone: faculty?.phone || '',
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (faculty) {
      form.reset({
        email: faculty.profiles?.email || '',
        full_name: faculty.profiles?.full_name || '',
        employee_id: faculty.employee_id || '',
        department_id: faculty.department_id || '',
        designation: faculty.designation || '',
        phone: faculty.phone || '',
      });
    }
  }, [faculty]);

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('*');
    setDepartments(data || []);
  };

  const onSubmit = async (data: FacultyFormData) => {
    try {
      if (isEdit) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: data.full_name, email: data.email })
          .eq('user_id', faculty.user_id);

        if (profileError) throw profileError;

        const { error: facultyError } = await supabase
          .from('faculty')
          .update({
            employee_id: data.employee_id,
            department_id: data.department_id,
            designation: data.designation,
            phone: data.phone,
          })
          .eq('id', faculty.id);

        if (facultyError) throw facultyError;

        toast({ title: "Success", description: "Faculty updated successfully" });
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password!,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: data.full_name, role: 'faculty' },
          },
        });

        if (authError) throw authError;

        const { error: facultyError } = await supabase.from('faculty').insert({
          user_id: authData.user!.id,
          employee_id: data.employee_id,
          department_id: data.department_id,
          designation: data.designation,
          phone: data.phone,
          status: 'active',
        });

        if (facultyError) throw facultyError;

        toast({ title: "Success", description: "Faculty added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save faculty",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Faculty' : 'Add New Faculty'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="input-dark" disabled={isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Employee ID</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" />
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Designation</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" placeholder="Professor, Associate Professor..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Phone</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" />
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Faculty'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
