'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/shared/form-input';
import { BrandLogo } from '@/components/shared/brand-logo';
import { useToast } from '@/hooks/use-toast';
import { post } from '@/lib/apiClient';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function SignupView() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSignup = async data => {
    try {
      setIsLoading(true);

      await post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast({ title: 'Account created. Please sign in.' });
      router.push('/login');
    } catch (err) {
      toast({
        title: 'Signup failed',
        description: err?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border-border shadow-elevated">
      <CardHeader className="space-y-3">
        <BrandLogo variant="light" size="sm" className="justify-center" />
        <div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started with your account</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
          <FormInput
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            placeholder="John Doe"
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="name@company.com"
          />

          <FormInput
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            register={register}
            error={errors.password}
            placeholder="••••••••"
            icon={
              showPassword ? (
                <EyeOff
                  className="cursor-pointer size-4"
                  onClick={() => setShowPassword(false)}
                  aria-label="Hide password"
                />
              ) : (
                <Eye
                  className="cursor-pointer size-4"
                  onClick={() => setShowPassword(true)}
                  aria-label="Show password"
                />
              )
            }
          />

          <FormInput
            label="Confirm password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            register={register}
            error={errors.confirmPassword}
            placeholder="••••••••"
            icon={
              showConfirmPassword ? (
                <EyeOff
                  className="cursor-pointer size-4"
                  onClick={() => setShowConfirmPassword(false)}
                  aria-label="Hide confirm password"
                />
              ) : (
                <Eye
                  className="cursor-pointer size-4"
                  onClick={() => setShowConfirmPassword(true)}
                  aria-label="Show confirm password"
                />
              )
            }
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
