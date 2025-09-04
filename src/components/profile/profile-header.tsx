'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, User } from 'lucide-react';

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

interface ProfileHeaderProps {
        profile: UserProfile | null;
        onImageUpload: () => void;
        isUploading: boolean;
}

export function ProfileHeader({ profile, onImageUpload, isUploading }: ProfileHeaderProps) {
        const getInitials = (name: string) => {
                return name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
        };

        return (
                <Card className="mb-8">
                        <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Profile Information
                                </CardTitle>
                                <CardDescription>Manage your personal information and account settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                                <div className="flex items-center space-x-6">
                                        <div className="relative">
                                                <Avatar className="h-24 w-24">
                                                        <AvatarImage src={profile?.image} alt={profile?.name} />
                                                        <AvatarFallback className="text-lg">
                                                                {profile?.name ? getInitials(profile.name) : 'U'}
                                                        </AvatarFallback>
                                                </Avatar>
                                                <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                                        onClick={onImageUpload}
                                                        disabled={isUploading}
                                                >
                                                        {isUploading ? (
                                                                <Upload className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                                <Camera className="h-4 w-4" />
                                                        )}
                                                </Button>
                                        </div>
                                        <div className="flex-1">
                                                <h2 className="text-2xl font-bold">{profile?.name || 'User'}</h2>
                                                <p className="text-muted-foreground">{profile?.email}</p>
                                                <p className="text-sm text-muted-foreground capitalize">
                                                        {profile?.provider} account
                                                </p>
                                        </div>
                                </div>
                        </CardContent>
                </Card>
        );
}
