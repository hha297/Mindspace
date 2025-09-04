'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Profile Components
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileForm } from '@/components/profile/profile-form';
import { PasswordChange } from '@/components/profile/password-change';

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
        const [isChangingPassword, setIsChangingPassword] = useState(false);
        const [passwordData, setPasswordData] = useState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
        });

        const [showPasswords, setShowPasswords] = useState({
                current: false,
                new: false,
                confirm: false,
        });
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
                                setOriginalProfile(profile);
                                // Update session with new name
                                await update({ name: profile.name });
                        } else {
                                toast.error('Failed to update profile');
                        }
                } catch (error) {
                        console.error('Failed to update profile:', error);
                        toast.error('Failed to update profile');
                } finally {
                        setIsSaving(false);
                }
        };

        const handleImageUpload = () => {
                fileInputRef.current?.click();
        };

        const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (!file) return;

                setIsUploading(true);
                try {
                        const formData = new FormData();
                        formData.append('image', file);

                        const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                        });

                        if (response.ok) {
                                const data = await response.json();
                                setProfile((prev) => (prev ? { ...prev, image: data.url } : null));
                                toast.success('Profile picture updated!');
                                // Update session with new image
                                await update({ image: data.url });
                        } else {
                                toast.error('Failed to upload image');
                        }
                } catch (error) {
                        console.error('Failed to upload image:', error);
                        toast.error('Failed to upload image');
                } finally {
                        setIsUploading(false);
                }
        };

        const handlePasswordChange = async () => {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                        toast.error('New passwords do not match');
                        return;
                }

                if (passwordData.newPassword.length < 6) {
                        toast.error('Password must be at least 6 characters long');
                        return;
                }

                setIsChangingPassword(true);
                try {
                        const response = await fetch('/api/user/change-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        currentPassword: passwordData.currentPassword,
                                        newPassword: passwordData.newPassword,
                                }),
                        });

                        if (response.ok) {
                                toast.success('Password changed successfully!');
                                setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: '',
                                });
                        } else {
                                const error = await response.json();
                                toast.error(error.message || 'Failed to change password');
                        }
                } catch (error) {
                        console.error('Failed to change password:', error);
                        toast.error('Failed to change password');
                } finally {
                        setIsChangingPassword(false);
                }
        };

        if (status === 'loading' || isLoading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <div className="space-y-6">
                                                <Skeleton className="h-32" />
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        <Skeleton className="h-64" />
                                                        <Skeleton className="h-64" />
                                                </div>
                                        </div>
                                </main>
                        </div>
                );
        }

        if (!session) {
                return null;
        }

        const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />
                        <EmergencyBanner />

                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Hidden file input */}
                                <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                />

                                {/* Profile Header */}
                                <ProfileHeader
                                        profile={profile}
                                        onImageUpload={handleImageUpload}
                                        isUploading={isUploading}
                                />

                                {/* Profile Form */}
                                <ProfileForm profile={profile} setProfile={setProfile} />

                                {/* Password Change - Only show for email provider */}
                                {profile?.provider === 'email' ? (
                                        <div className="mt-8">
                                                <PasswordChange
                                                        passwordData={passwordData}
                                                        setPasswordData={setPasswordData}
                                                        showPasswords={showPasswords}
                                                        setShowPasswords={setShowPasswords}
                                                        onPasswordChange={handlePasswordChange}
                                                        isChangingPassword={isChangingPassword}
                                                />
                                        </div>
                                ) : (
                                        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-dashed">
                                                <div className="text-center">
                                                        <p className="text-sm text-muted-foreground">
                                                                Password management is handled by your{' '}
                                                                {profile?.provider === 'google' ? 'Google' : 'GitHub'}{' '}
                                                                account.
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                To change your password, please visit your{' '}
                                                                {profile?.provider === 'google' ? 'Google' : 'GitHub'}{' '}
                                                                account settings.
                                                        </p>
                                                </div>
                                        </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between mt-8 pt-8 border-t">
                                        <div className="flex gap-4">
                                                <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
                                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                                {hasChanges && (
                                                        <Button
                                                                variant="outline"
                                                                onClick={() => setProfile(originalProfile)}
                                                        >
                                                                Cancel
                                                        </Button>
                                                )}
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
