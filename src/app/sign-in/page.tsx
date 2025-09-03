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
import { Mail, Chrome, Github } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SignInPage() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
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
                        <div className="min-h-screen bg-background flex items-center justify-center">
                                <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-muted-foreground">Loading...</p>
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
                                toast.success('Welcome back!', {
                                        description: 'You have been signed in successfully.',
                                });
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
                <div className="min-h-screen bg-background flex flex-col">
                        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                                <div className="max-w-md w-full space-y-8">
                                        <div className="text-center">
                                                <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                                                        <Image src="/logo.png" alt="MindSpace" width={32} height={32} />
                                                        <span className="font-semibold text-2xl text-foreground">
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
                                                                        <Input
                                                                                id="password"
                                                                                type="password"
                                                                                placeholder="Enter your password"
                                                                                value={password}
                                                                                onChange={(e) =>
                                                                                        setPassword(e.target.value)
                                                                                }
                                                                                required
                                                                                className="bg-white border-primary/50"
                                                                        />
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

                                        <div className="text-center text-xs text-muted-foreground">
                                                <p>
                                                        By signing in, you agree to our{' '}
                                                        <Link href="/privacy" className="text-primary hover:underline">
                                                                Privacy Policy
                                                        </Link>{' '}
                                                        and{' '}
                                                        <Link href="/terms" className="text-primary hover:underline">
                                                                Terms of Service
                                                        </Link>
                                                </p>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
