'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User, Phone, Target, Shield, Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
        name: string;
        email: string;
        provider: 'email' | 'google' | 'github';
        image?: string;
        emergencyContact?: string;
        personalGoals?: string;
        notificationsEnabled: boolean;
        privacyLevel: 'public' | 'private';
}

export default function ProfilePage() {
        const { data: session, status, update } = useSession();
        const router = useRouter();
        const [profile, setProfile] = useState<UserProfile | null>(null);
        const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [isSaving, setIsSaving] = useState(false);
        const [isUploading, setIsUploading] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);

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
                                const profileData = {
                                        name: data.user.name || '',
                                        email: data.user.email || '',
                                        provider: data.user.provider || 'email',
                                        image: data.user.image || '',
                                        emergencyContact: data.user.emergencyContact || '',
                                        personalGoals: data.user.personalGoals || '',
                                        notificationsEnabled: data.user.notificationsEnabled ?? true,
                                        privacyLevel: data.user.privacyLevel || 'private',
                                };
                                setProfile(profileData);
                                setOriginalProfile(profileData);
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
                                // Update original profile to reflect saved state
                                setOriginalProfile(profile);
                                // Store updated name in localStorage for immediate navbar update
                                localStorage.setItem('userName', profile.name);
                                // Emit event to notify navbar
                                window.dispatchEvent(new Event('profile-updated'));
                                // Update session to refresh navbar
                                await update({
                                        name: profile.name,
                                        email: profile.email,
                                        image: profile.image,
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
                                setProfile({
                                        ...profile!,
                                        image: data.url,
                                });
                                toast.success('Avatar updated successfully!');
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

        const isOAuthUser = profile?.provider === 'google' || profile?.provider === 'github';

        // Check if there are any changes compared to original profile (excluding email)
        const hasChanges =
                originalProfile &&
                profile &&
                // Only check name changes for non-OAuth users
                ((!isOAuthUser && profile.name !== originalProfile.name) ||
                        profile.image !== originalProfile.image ||
                        profile.emergencyContact !== originalProfile.emergencyContact ||
                        profile.personalGoals !== originalProfile.personalGoals ||
                        profile.notificationsEnabled !== originalProfile.notificationsEnabled ||
                        profile.privacyLevel !== originalProfile.privacyLevel);

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
                                        {/* Avatar Section */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center space-x-2">
                                                                <Camera className="h-5 w-5" />
                                                                <span>Profile Picture</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Upload a profile picture to personalize your account
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="flex items-center space-x-4">
                                                                <div className="relative">
                                                                        <Avatar className="h-20 w-20">
                                                                                <AvatarImage
                                                                                        src={profile?.image}
                                                                                        alt={profile?.name}
                                                                                />
                                                                                <AvatarFallback className="text-lg">
                                                                                        {profile?.name
                                                                                                ?.split(' ')
                                                                                                .map((n) => n[0])
                                                                                                .join('')
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
                                                                                onClick={() =>
                                                                                        fileInputRef.current?.click()
                                                                                }
                                                                                disabled={isUploading}
                                                                                variant="outline"
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
                                                                                onChange={handleFileChange}
                                                                                className="hidden"
                                                                        />
                                                                        <p className="text-sm text-muted-foreground">
                                                                                JPG, PNG, GIF up to 5MB
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Personal Information */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center space-x-2">
                                                                <User className="h-5 w-5" />
                                                                <span>Personal Information</span>
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Update your basic profile information
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
                                                                        {isOAuthUser && (
                                                                                <p className="text-xs text-muted-foreground">
                                                                                        Name is managed by your{' '}
                                                                                        {profile?.provider === 'google'
                                                                                                ? 'Google'
                                                                                                : 'GitHub'}{' '}
                                                                                        account
                                                                                </p>
                                                                        )}
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
                                                                                disabled={true}
                                                                                className="bg-white border-primary/50 cursor-not-allowed opacity-60"
                                                                        />
                                                                        <p className="text-xs text-muted-foreground">
                                                                                Email address cannot be changed
                                                                        </p>
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
                                                <Button
                                                        onClick={handleSave}
                                                        disabled={isSaving || isLoading || !hasChanges}
                                                        size="lg"
                                                        className={cn(!hasChanges && 'opacity-50 cursor-not-allowed')}
                                                >
                                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
