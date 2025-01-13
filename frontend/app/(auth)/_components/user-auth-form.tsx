'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const { toast } = useToast();
  const hardcodedEmail = process.env.NEXT_PUBLIC_HARDCODED_EMAIL;
  const hardcodedPassword = process.env.NEXT_PUBLIC_HARDCODED_PASSWORD;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {

    if (!hardcodedEmail || !hardcodedPassword) {
      toast({
        variant:"destructive",
        title:"Environment variables are not properly configured."
      });
      return;
    }

    if (data.email === hardcodedEmail && data.password === hardcodedPassword) {
      startTransition(() => {
        signIn('credentials', {
          email: data.email,
          password: data.password,
          callbackUrl: callbackUrl ?? '/dashboard/overview'
        }).then((response) => {
          if (response?.error) {
            toast({
              variant: "destructive",
              title: "Invalid email or password. Please try again."
            });
            console.log('Authentication failed');
          } else {
            toast({
              variant: "default",
              title: "Signed In Successfully!"
            });
          }
        });
      });
    } else {
      toast({
        variant:"destructive",
        title:"Invalid email or password. Please try again."
      });
      console.log('Authentication failed');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="ml-auto w-full" type="submit" disabled={loading}>
          Sign In
        </Button>
      </form>
    </Form>
  );
}