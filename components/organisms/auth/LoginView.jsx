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
import { post, setAuthToken, setRefreshToken } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginView() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async data => {
    try {
      setIsLoading(true);

      const res = await post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      // API returns { success, data: { user, accessToken, refreshToken, expiresIn, refreshExpiresIn } }
      const token =
        res?.data?.accessToken ??
        res?.data?.token ??
        res?.token ??
        res?.accessToken ??
        res?.data?.access_token;
      const refreshToken =
        res?.data?.refreshToken ??
        res?.data?.refresh_token ??
        res?.refreshToken ??
        res?.refresh_token;
      if (token) setAuthToken(token);
      if (refreshToken) setRefreshToken(refreshToken);
      const userData = res?.data?.user ?? res?.user;
      if (userData) setUser(userData);

      toast({ title: 'Welcome back!' });
      router.push('/dashboard');
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err?.message || 'Invalid email or password.',
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
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
