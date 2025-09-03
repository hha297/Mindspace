'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Chrome, Github, UserPlus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SignUpPage() {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [image, setImage] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isUploading, setIsUploading] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);
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

        const handleAvatarUpload = async (file: File) => {
                setIsUploading(true);
                try {
                        const formData = new FormData();
                        formData.append('file', file);

                        const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                        });

                        if (response.ok) {
                                const data = await response.json();
                                setImage(data.url);
                                toast.success('Avatar uploaded successfully!');
                        } else {
                                toast.error('Failed to upload avatar');
                        }
                } catch (error) {
                        console.error('Failed to upload avatar:', error);
                        toast.error('Failed to upload avatar');
                } finally {
                        setIsUploading(false);
                }
        };

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) {
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                                toast.error('Please select an image file');
                                return;
                        }
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                                toast.error('File size must be less than 5MB');
                                return;
                        }
                        handleAvatarUpload(file);
                }
        };

        const handleEmailSignUp = async (e: React.FormEvent) => {
                e.preventDefault();

                if (password !== confirmPassword) {
                        toast.error("Passwords don't match", {
                                description: 'Please make sure your passwords match.',
                        });
                        return;
                }

                if (password.length < 6) {
                        toast.error('Password too short', {
                                description: 'Password must be at least 6 characters long.',
                        });
                        return;
                }

                setIsLoading(true);

                try {
                        // Create user account
                        const response = await fetch('/api/auth/register', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        name,
                                        email,
                                        password,
                                        image,
                                }),
                        });

                        if (!response.ok) {
                                const error = await response.json();
                                throw new Error(error.message || 'Failed to create account');
                        }

                        // Sign in the user after successful registration
                        const result = await signIn('credentials', {
                                email,
                                password,
                                redirect: false,
                        });

                        if (result?.error) {
                                let errorMessage = 'Please try signing in manually.';

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

                                toast.error('Account created but sign in failed', {
                                        description: errorMessage,
                                });
                        } else {
                                toast.success('Welcome to MindSpace!', {
                                        description: 'Your account has been created successfully.',
                                });
                                router.push('/dashboard');
                        }
                } catch (error) {
                        toast.error('Sign up failed', {
                                description: error instanceof Error ? error.message : 'Please try again later.',
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
                        toast.error('Sign up failed', {
                                description: 'Please try again.',
                        });
                        setIsLoading(false);
                }
        };

        return (
                <div className="min-h-screen p-8 bg-background flex flex-col">
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
                                                        <CardTitle className="text-2xl">Join MindSpace</CardTitle>
                                                        <CardDescription>
                                                                Create your account to start your mental health journey
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
                                                                                Or create account with email
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        <form onSubmit={handleEmailSignUp} className="space-y-4">
                                                                {/* Avatar Upload */}
                                                                <div className="space-y-2">
                                                                        <Label>Profile Picture (Optional)</Label>
                                                                        <div className="flex items-center space-x-4">
                                                                                <div className="relative">
                                                                                        <Avatar className="h-16 w-16">
                                                                                                <AvatarImage
                                                                                                        src={image}
                                                                                                        alt="Profile"
                                                                                                />
                                                                                                <AvatarFallback className="text-lg">
                                                                                                        {name
                                                                                                                ?.split(
                                                                                                                        ' ',
                                                                                                                )
                                                                                                                .map(
                                                                                                                        (
                                                                                                                                n,
                                                                                                                        ) =>
                                                                                                                                n[0],
                                                                                                                )
                                                                                                                .join(
                                                                                                                        '',
                                                                                                                )
                                                                                                                .toUpperCase()}
                                                                                                </AvatarFallback>
                                                                                        </Avatar>
                                                                                        {isUploading && (
                                                                                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                                                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                                                                </div>
                                                                                        )}
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <Button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                        fileInputRef.current?.click()
                                                                                                }
                                                                                                disabled={isUploading}
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                className="bg-white border-primary/50"
                                                                                        >
                                                                                                <Upload className="h-4 w-4 mr-2" />
                                                                                                {isUploading
                                                                                                        ? 'Uploading...'
                                                                                                        : 'Upload Image'}
                                                                                        </Button>
                                                                                        <input
                                                                                                ref={fileInputRef}
                                                                                                type="file"
                                                                                                accept="image/*"
                                                                                                onChange={
                                                                                                        handleFileChange
                                                                                                }
                                                                                                className="hidden"
                                                                                        />
                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                JPG, PNG, GIF up to 5MB
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="name">Full Name</Label>
                                                                        <Input
                                                                                id="name"
                                                                                type="text"
                                                                                placeholder="Enter your full name"
                                                                                value={name}
                                                                                onChange={(e) =>
                                                                                        setName(e.target.value)
                                                                                }
                                                                                required
                                                                                className="bg-white border-primary/50"
                                                                        />
                                                                </div>
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
                                                                                placeholder="Create a password (min. 6 characters)"
                                                                                value={password}
                                                                                onChange={(e) =>
                                                                                        setPassword(e.target.value)
                                                                                }
                                                                                required
                                                                                minLength={6}
                                                                                className="bg-white border-primary/50"
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="confirmPassword">
                                                                                Confirm Password
                                                                        </Label>
                                                                        <Input
                                                                                id="confirmPassword"
                                                                                type="password"
                                                                                placeholder="Confirm your password"
                                                                                value={confirmPassword}
                                                                                onChange={(e) =>
                                                                                        setConfirmPassword(
                                                                                                e.target.value,
                                                                                        )
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
                                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                                        {isLoading
                                                                                ? 'Creating account...'
                                                                                : 'Create Account'}
                                                                </Button>
                                                        </form>

                                                        <div className="text-center text-sm text-muted-foreground">
                                                                <p>
                                                                        Already have an account?{' '}
                                                                        <Link
                                                                                href="/sign-in"
                                                                                className="text-primary font-medium hover:underline"
                                                                        >
                                                                                Sign in
                                                                        </Link>
                                                                </p>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        <div className="text-center text-xs text-muted-foreground">
                                                <p>
                                                        By creating an account, you agree to our{' '}
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
