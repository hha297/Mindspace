'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Target } from 'lucide-react';

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

interface ProfileFormProps {
        profile: UserProfile | null;
        setProfile: (profile: UserProfile | null) => void;
}

export function ProfileForm({ profile, setProfile }: ProfileFormProps) {
        const updateProfile = (field: keyof UserProfile, value: string | boolean) => {
                if (!profile) return;
                setProfile({ ...profile, [field]: value });
        };

        if (!profile) return null;

        return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <Card>
                                <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Personal Information
                                        </CardTitle>
                                        <CardDescription>Update your basic information</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                        id="name"
                                                        value={profile.name}
                                                        onChange={(e) => updateProfile('name', e.target.value)}
                                                        placeholder="Enter your full name"
                                                        className="bg-white border-primary/50"
                                                />
                                        </div>
                                        <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                        id="email"
                                                        value={profile.email}
                                                        disabled
                                                        className="bg-white border-primary/50"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                        Email cannot be changed for {profile.provider} accounts
                                                </p>
                                        </div>
                                        <div className="space-y-2">
                                                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                                <Input
                                                        id="emergencyContact"
                                                        value={profile.emergencyContact}
                                                        onChange={(e) =>
                                                                updateProfile('emergencyContact', e.target.value)
                                                        }
                                                        placeholder="Phone number or email"
                                                        className="bg-white border-primary/50"
                                                />
                                        </div>
                                </CardContent>
                        </Card>

                        {/* Goals and Preferences */}
                        <Card>
                                <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5" />
                                                Goals & Preferences
                                        </CardTitle>
                                        <CardDescription>Set your mental health goals and preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                                <Label htmlFor="personalGoals">Personal Goals</Label>
                                                <Textarea
                                                        id="personalGoals"
                                                        value={profile.personalGoals}
                                                        onChange={(e) => updateProfile('personalGoals', e.target.value)}
                                                        placeholder="What are your mental health goals?"
                                                        rows={3}
                                                        className="bg-white border-primary/50"
                                                />
                                        </div>
                                        <div className="space-y-2">
                                                <Label htmlFor="privacyLevel">Privacy Level</Label>
                                                <Select
                                                        value={profile.privacyLevel}
                                                        onValueChange={(value) => updateProfile('privacyLevel', value)}
                                                >
                                                        <SelectTrigger className="bg-white border-primary/50">
                                                                <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                <SelectItem value="private">Private</SelectItem>
                                                                <SelectItem value="public">Public</SelectItem>
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                        <Label>Email Notifications</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                                Receive updates and reminders
                                                        </p>
                                                </div>
                                                <Switch
                                                        checked={profile.notificationsEnabled}
                                                        onCheckedChange={(checked) =>
                                                                updateProfile('notificationsEnabled', checked)
                                                        }
                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                />
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        );
}
