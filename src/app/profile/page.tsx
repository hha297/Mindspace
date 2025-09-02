'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { User, Phone, Target, Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
        name: string;
        email: string;
        provider: 'email' | 'google' | 'github';
        emergencyContact?: string;
        personalGoals?: string;
        notificationsEnabled: boolean;
        privacyLevel: 'public' | 'private';
}

export default function ProfilePage() {
        const { data: session, status, update } = useSession();
        const router = useRouter();
        const [profile, setProfile] = useState<UserProfile | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [isSaving, setIsSaving] = useState(false);

        useEffect(() => {
                if (status === 'unauthenticated') {
                        router.push('/sign-in');
                } else if (status === 'authenticated') {
                        fetchProfile();
                }
        }, [status, router]);

        const fetchProfile = async () => {
                try {
                        const response = await fetch('/api/user/profile');
                        if (response.ok) {
                                const data = await response.json();
                                console.log(data);
                                setProfile({
                                        name: data.user.name || '',
                                        email: data.user.email || '',
                                        provider: data.user.provider || 'email',
                                        emergencyContact: data.user.emergencyContact || '',
                                        personalGoals: data.user.personalGoals || '',
                                        notificationsEnabled: data.user.notificationsEnabled ?? true,
                                        privacyLevel: data.user.privacyLevel || 'private',
                                });
                        }
                } catch (error) {
                        console.error('Failed to fetch profile:', error);
                        toast.error('Failed to load profile');
                } finally {
                        setIsLoading(false);
                }
        };

        const handleSave = async () => {
                if (!profile) return;

                setIsSaving(true);
                try {
                        const response = await fetch('/api/user/profile', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(profile),
                        });

                        if (response.ok) {
                                toast.success('Profile updated successfully!');
                                // Store updated name in localStorage for immediate navbar update
                                localStorage.setItem('userName', profile.name);
                                // Emit event to notify navbar
                                window.dispatchEvent(new Event('profile-updated'));
                                // Update session to refresh navbar
                                await update({
                                        name: profile.name,
                                        email: profile.email,
                                });
                        } else {
                                toast.error('Failed to update profile');
                        }
                } catch (error) {
                        console.error('Failed to save profile:', error);
                        toast.error('Failed to update profile');
                } finally {
                        setIsSaving(false);
                }
        };

        const isOAuthUser = profile?.provider === 'google' || profile?.provider === 'github';

        if (status === 'loading' || isLoading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <Skeleton className="h-8 w-48 mb-8" />
                                        <div className="space-y-6">
                                                <Skeleton className="h-64" />
                                                <Skeleton className="h-48" />
                                        </div>
                                </main>
                        </div>
                );
        }

        if (!session || !profile) {
                return null;
        }

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />

                                <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
                                        <p className="text-lg text-muted-foreground">
                                                Manage your personal information and preferences
                                        </p>
                                </div>

                                <div className="space-y-6">
                                        {/* Personal Information */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center space-x-2">
                                                                <User className="h-5 w-5" />
                                                                <span>Personal Information</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Update your basic profile information
                                                                {isOAuthUser && (
                                                                        <span className="block mt-1 text-amber-600 dark:text-amber-400">
                                                                                <Lock className="inline h-3 w-3 mr-2 mb-1" />
                                                                                Name and email are managed by your{' '}
                                                                                {profile?.provider === 'google'
                                                                                        ? 'Google'
                                                                                        : 'GitHub'}{' '}
                                                                                account. So you can&apos;t change it
                                                                                here.
                                                                        </span>
                                                                )}
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="name">Full Name</Label>
                                                                        <Input
                                                                                id="name"
                                                                                value={profile?.name || ''}
                                                                                onChange={(e) =>
                                                                                        setProfile({
                                                                                                ...profile!,
                                                                                                name: e.target.value,
                                                                                        })
                                                                                }
                                                                                placeholder="Enter your full name"
                                                                                disabled={isOAuthUser}
                                                                                className={cn(
                                                                                        'bg-white border-primary/50',
                                                                                        isOAuthUser &&
                                                                                                'cursor-not-allowed opacity-60',
                                                                                )}
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="email">Email Address</Label>
                                                                        <Input
                                                                                id="email"
                                                                                type="email"
                                                                                value={profile?.email || ''}
                                                                                onChange={(e) =>
                                                                                        setProfile({
                                                                                                ...profile!,
                                                                                                email: e.target.value,
                                                                                        })
                                                                                }
                                                                                placeholder="Enter your email"
                                                                                disabled={isOAuthUser}
                                                                                className={cn(
                                                                                        'bg-white border-primary/50',
                                                                                        isOAuthUser &&
                                                                                                'cursor-not-allowed opacity-60',
                                                                                )}
                                                                        />
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Emergency Contact */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center space-x-2">
                                                                <Phone className="h-5 w-5" />
                                                                <span>Emergency Contact</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Someone we can contact in case of emergency
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <Input
                                                                value={profile.emergencyContact || ''}
                                                                onChange={(e) =>
                                                                        setProfile({
                                                                                ...profile,
                                                                                emergencyContact: e.target.value,
                                                                        })
                                                                }
                                                                placeholder="Emergency contact name and phone number"
                                                                className="bg-white border-primary/50"
                                                        />
                                                </CardContent>
                                        </Card>

                                        {/* Personal Goals */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center space-x-2">
                                                                <Target className="h-5 w-5" />
                                                                <span>Personal Goals</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Set your mental health and wellness goals
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <Textarea
                                                                value={profile.personalGoals || ''}
                                                                onChange={(e) =>
                                                                        setProfile({
                                                                                ...profile,
                                                                                personalGoals: e.target.value,
                                                                        })
                                                                }
                                                                placeholder="What are your mental health goals? (e.g., reduce anxiety, improve sleep, build healthy habits)"
                                                                rows={4}
                                                                className="bg-white border-primary/50"
                                                        />
                                                </CardContent>
                                        </Card>

                                        {/* Privacy & Notifications */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center space-x-2">
                                                                <Shield className="h-5 w-5" />
                                                                <span>Privacy & Notifications</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Control your privacy and notification preferences
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                                <div className="space-y-2">
                                                                        <Label>Email Notifications</Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Receive reminders and updates
                                                                        </p>
                                                                </div>
                                                                <Button
                                                                        variant={
                                                                                profile.notificationsEnabled
                                                                                        ? 'default'
                                                                                        : 'outline'
                                                                        }
                                                                        size="sm"
                                                                        onClick={() =>
                                                                                setProfile({
                                                                                        ...profile,
                                                                                        notificationsEnabled:
                                                                                                !profile.notificationsEnabled,
                                                                                })
                                                                        }
                                                                >
                                                                        {profile.notificationsEnabled
                                                                                ? 'Enabled'
                                                                                : 'Disabled'}
                                                                </Button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                                <div className="space-y-2">
                                                                        <Label>Privacy Level</Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Control who can see your progress
                                                                        </p>
                                                                </div>
                                                                <Button
                                                                        variant={
                                                                                profile.privacyLevel === 'private'
                                                                                        ? 'default'
                                                                                        : 'outline'
                                                                        }
                                                                        size="sm"
                                                                        onClick={() =>
                                                                                setProfile({
                                                                                        ...profile,
                                                                                        privacyLevel:
                                                                                                profile.privacyLevel ===
                                                                                                'private'
                                                                                                        ? 'public'
                                                                                                        : 'private',
                                                                                })
                                                                        }
                                                                >
                                                                        {profile.privacyLevel === 'private'
                                                                                ? 'Private'
                                                                                : 'Public'}
                                                                </Button>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Save Button */}
                                        <div className="flex justify-end">
                                                <Button onClick={handleSave} disabled={isSaving} size="lg">
                                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
