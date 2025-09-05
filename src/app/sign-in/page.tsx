'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Mail, Chrome, Github, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SignInPage() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const router = useRouter();
        const { status } = useSession();

        // Redirect if already authenticated
        useEffect(() => {
                if (status === 'authenticated') {
                        router.push('/');
                }
        }, [status, router]);

        // Show loading while checking authentication
        if (status === 'loading') {
                return (
                        <div
                                className="min-h-screen flex items-center justify-center"
                                style={{
                                        backgroundImage: 'url(/wallpaper/wallpaper1.jpg)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                }}
                        >
                                <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-white">Loading...</p>
                                </div>
                        </div>
                );
        }

        const handleEmailSignIn = async (e: React.FormEvent) => {
                e.preventDefault();
                setIsLoading(true);

                try {
                        const result = await signIn('credentials', {
                                email,
                                password,
                                redirect: false,
                        });

                        if (result?.error) {
                                console.log('Sign in error:', result.error);
                                let errorMessage = 'Please check your credentials and try again.';

                                // Provide more specific error messages
                                if (result.error === 'CredentialsSignin') {
                                        errorMessage = 'Invalid email or password. Please try again.';
                                } else if (result.error === 'OAuthSignin') {
                                        errorMessage = 'OAuth sign in failed. Please try again.';
                                } else if (result.error === 'OAuthCallback') {
                                        errorMessage = 'OAuth callback failed. Please try again.';
                                } else if (result.error === 'OAuthCreateAccount') {
                                        errorMessage = 'Could not create OAuth account. Please try again.';
                                } else if (result.error === 'EmailCreateAccount') {
                                        errorMessage = 'Could not create email account. Please try again.';
                                } else if (result.error === 'Callback') {
                                        errorMessage = 'Callback failed. Please try again.';
                                } else if (result.error === 'OAuthAccountNotLinked') {
                                        errorMessage = 'This email is already associated with another account.';
                                } else if (result.error === 'EmailSignin') {
                                        errorMessage = 'Email sign in failed. Please try again.';
                                } else if (result.error === 'SessionRequired') {
                                        errorMessage = 'Session required. Please sign in again.';
                                } else if (result.error === 'Default') {
                                        errorMessage = 'An unexpected error occurred. Please try again.';
                                }

                                toast.error('Sign in failed', {
                                        description: errorMessage,
                                });
                        } else {
                                toast.success('Welcome back!');
                                router.push('/dashboard');
                        }
                } catch {
                        toast.error('Something went wrong', {
                                description: 'Please try again later.',
                        });
                } finally {
                        setIsLoading(false);
                }
        };

        const handleProviderSignIn = async (provider: 'google' | 'github') => {
                setIsLoading(true);
                try {
                        await signIn(provider, { callbackUrl: '/dashboard' });
                } catch {
                        toast.error('Sign in failed', {
                                description: 'Please try again.',
                        });
                        setIsLoading(false);
                }
        };

        return (
                <div
                        className="min-h-screen p-4 sm:p-8 flex flex-col"
                        style={{
                                backgroundImage: 'url(/wallpaper/wallpaper1.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                        }}
                >
                        <div className="flex-1 flex items-center justify-center sm:px-6 lg:px-8">
                                <div className="max-w-md w-full space-y-6 sm:space-y-8">
                                        <div className="text-center">
                                                <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                                                        <Image src="/logo.png" alt="MindSpace" width={32} height={32} />
                                                        <span className="font-semibold text-2xl text-white">
                                                                MindSpace
                                                        </span>
                                                </Link>
                                        </div>

                                        <EmergencyBanner />

                                        <Card>
                                                <CardHeader className="text-center">
                                                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                                                        <CardDescription>
                                                                Sign in to continue your mental health journey
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <div className="space-y-3">
                                                                <Button
                                                                        onClick={() => handleProviderSignIn('google')}
                                                                        disabled={isLoading}
                                                                        variant="outline"
                                                                        className="w-full bg-white border-primary/50"
                                                                >
                                                                        <Chrome className="mr-2 h-4 w-4" />
                                                                        Continue with Google
                                                                </Button>

                                                                <Button
                                                                        onClick={() => handleProviderSignIn('github')}
                                                                        disabled={isLoading}
                                                                        variant="outline"
                                                                        className="w-full bg-white border-primary/50"
                                                                >
                                                                        <Github className="mr-2 h-4 w-4" />
                                                                        Continue with GitHub
                                                                </Button>
                                                        </div>

                                                        <div className="relative">
                                                                <div className="absolute inset-0 flex items-center">
                                                                        <Separator className="w-full" />
                                                                </div>
                                                                <div className="relative flex justify-center text-xs uppercase">
                                                                        <span className="bg-background px-2 text-muted-foreground">
                                                                                Or continue with email
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        <form onSubmit={handleEmailSignIn} className="space-y-4">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="email">Email</Label>
                                                                        <Input
                                                                                id="email"
                                                                                type="email"
                                                                                placeholder="your.email@university.edu"
                                                                                value={email}
                                                                                onChange={(e) =>
                                                                                        setEmail(e.target.value)
                                                                                }
                                                                                required
                                                                                className="bg-white border-primary/50"
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="password">Password</Label>
                                                                        <div className="relative">
                                                                                <Input
                                                                                        id="password"
                                                                                        type={
                                                                                                showPassword
                                                                                                        ? 'text'
                                                                                                        : 'password'
                                                                                        }
                                                                                        placeholder="Enter your password"
                                                                                        value={password}
                                                                                        onChange={(e) =>
                                                                                                setPassword(
                                                                                                        e.target.value,
                                                                                                )
                                                                                        }
                                                                                        required
                                                                                        className="bg-white border-primary/50 pr-10"
                                                                                />
                                                                                <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="absolute right-0 top-0 h-full px-3"
                                                                                        tabIndex={-1}
                                                                                        onClick={() =>
                                                                                                setShowPassword(
                                                                                                        !showPassword,
                                                                                                )
                                                                                        }
                                                                                >
                                                                                        {showPassword ? (
                                                                                                <EyeOff className="h-4 w-4 hover:text-primary" />
                                                                                        ) : (
                                                                                                <Eye className="h-4 w-4 hover:text-primary" />
                                                                                        )}
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                                <Button
                                                                        type="submit"
                                                                        disabled={isLoading}
                                                                        className="w-full"
                                                                >
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                                                </Button>
                                                        </form>

                                                        <div className="text-center text-sm text-muted-foreground">
                                                                <p>
                                                                        New to MindSpace?{' '}
                                                                        <Link
                                                                                href="/sign-up"
                                                                                className="text-primary font-medium hover:underline"
                                                                        >
                                                                                Create an account
                                                                        </Link>
                                                                </p>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </div>
                        </div>
                </div>
        );
}
