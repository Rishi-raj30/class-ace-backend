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

const studentSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6).optional(),
  full_name: z.string().min(1, 'Name is required'),
  roll_number: z.string().min(1, 'Roll number is required'),
  class_id: z.string().min(1, 'Class is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: any;
  onSuccess: () => void;
}

export const StudentDialog: React.FC<StudentDialogProps> = ({
  open,
  onOpenChange,
  student,
  onSuccess,
}) => {
  const [classes, setClasses] = useState([]);
  const { toast } = useToast();
  const isEdit = !!student;

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      email: student?.profiles?.email || '',
      full_name: student?.profiles?.full_name || '',
      roll_number: student?.roll_number || '',
      class_id: student?.class_id || '',
      phone: student?.phone || '',
      address: student?.address || '',
      date_of_birth: student?.date_of_birth || '',
    },
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (student) {
      form.reset({
        email: student.profiles?.email || '',
        full_name: student.profiles?.full_name || '',
        roll_number: student.roll_number || '',
        class_id: student.class_id || '',
        phone: student.phone || '',
        address: student.address || '',
        date_of_birth: student.date_of_birth || '',
      });
    }
  }, [student]);

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('*');
    setClasses(data || []);
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (isEdit) {
        // Update existing student
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: data.full_name, email: data.email })
          .eq('user_id', student.user_id);

        if (profileError) throw profileError;

        const { error: studentError } = await supabase
          .from('students')
          .update({
            roll_number: data.roll_number,
            class_id: data.class_id,
            phone: data.phone,
            address: data.address,
            date_of_birth: data.date_of_birth,
          })
          .eq('id', student.id);

        if (studentError) throw studentError;

        toast({ title: "Success", description: "Student updated successfully" });
      } else {
        // Create new student user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password!,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: data.full_name, role: 'student' },
          },
        });

        if (authError) throw authError;

        // Create student record
        const { error: studentError } = await supabase.from('students').insert({
          user_id: authData.user!.id,
          roll_number: data.roll_number,
          class_id: data.class_id,
          phone: data.phone,
          address: data.address,
          date_of_birth: data.date_of_birth,
          status: 'active',
        });

        if (studentError) throw studentError;

        toast({ title: "Success", description: "Student added successfully" });
      }

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save student",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Edit Student' : 'Add New Student'}
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
                name="roll_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Roll Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-dark" />
                    </FormControl>
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
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Date of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="input-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Address</FormLabel>
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
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Student'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
