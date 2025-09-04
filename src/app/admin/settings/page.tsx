'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, RefreshCw, Database, Shield, Bell, Globe, Mail, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface SystemSettings {
        general: {
                siteName: string;
                siteDescription: string;
                maintenanceMode: boolean;
                allowRegistration: boolean;
        };
        email: {
                smtpHost: string;
                smtpPort: number;
                smtpUser: string;
                smtpPass: string;
                fromEmail: string;
                fromName: string;
        };
        security: {
                sessionTimeout: number;
                maxLoginAttempts: number;
                requireEmailVerification: boolean;
                enableTwoFactor: boolean;
        };
        notifications: {
                emailNotifications: boolean;
                pushNotifications: boolean;
                moodReminders: boolean;
                achievementNotifications: boolean;
        };
        appearance: {
                primaryColor: string;
                darkMode: boolean;
                customCSS: string;
        };
}

export default function AdminSettingsPage() {
        const [settings, setSettings] = useState<SystemSettings>({
                general: {
                        siteName: 'MindSpace',
                        siteDescription: 'Mental Health Support Platform for Students',
                        maintenanceMode: false,
                        allowRegistration: true,
                },
                email: {
                        smtpHost: '',
                        smtpPort: 587,
                        smtpUser: '',
                        smtpPass: '',
                        fromEmail: 'noreply@mindspace.com',
                        fromName: 'MindSpace Team',
                },
                security: {
                        sessionTimeout: 24,
                        maxLoginAttempts: 5,
                        requireEmailVerification: false,
                        enableTwoFactor: false,
                },
                notifications: {
                        emailNotifications: true,
                        pushNotifications: true,
                        moodReminders: true,
                        achievementNotifications: true,
                },
                appearance: {
                        primaryColor: '#6366f1',
                        darkMode: false,
                        customCSS: '',
                },
        });
        const [isLoading, setIsLoading] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const [currentDate, setCurrentDate] = useState('');

        useEffect(() => {
                loadSettings();
                // Set current date on client side to prevent hydration mismatch
                setCurrentDate(new Date().toLocaleDateString());
        }, []);

        const loadSettings = async () => {
                try {
                        setIsLoading(true);
                        //TODO: Fetch settings from API
                } catch (error) {
                        console.error('Error loading settings:', error);
                        toast.error('Failed to load settings');
                } finally {
                        setIsLoading(false);
                }
        };

        const saveSettings = async () => {
                try {
                        setIsSaving(true);
                        //TODO: Save settings to API

                        toast.success('Settings saved successfully');
                } catch (error) {
                        console.error('Error saving settings:', error);
                        toast.error('Failed to save settings');
                } finally {
                        setIsSaving(false);
                }
        };

        const resetSettings = () => {
                if (confirm('Are you sure you want to reset all settings to default?')) {
                        loadSettings();
                        toast.success('Settings reset to default');
                }
        };

        const updateSetting = (section: keyof SystemSettings, key: string, value: string | number | boolean) => {
                setSettings((prev) => ({
                        ...prev,
                        [section]: {
                                ...prev[section],
                                [key]: value,
                        },
                }));
        };

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-background">
                                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <div className="text-center py-12">
                                                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-muted-foreground">Loading settings...</p>
                                        </div>
                                </main>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-background">
                        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Header */}
                                <div className="mb-8">
                                        <div className="flex items-center  flex-col md:flex-row justify-between">
                                                <div>
                                                        <h1 className="text-3xl font-bold text-foreground mb-2">
                                                                System Settings
                                                        </h1>
                                                        <p className="text-muted-foreground">
                                                                Configure platform settings and preferences
                                                        </p>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                        <Button variant="outline" onClick={resetSettings}>
                                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                                Reset
                                                        </Button>
                                                        <Button onClick={saveSettings} disabled={isSaving}>
                                                                <Save className="h-4 w-4 mr-2" />
                                                                {isSaving ? 'Saving...' : 'Save Settings'}
                                                        </Button>
                                                </div>
                                        </div>
                                </div>

                                <div className="space-y-6">
                                        {/* General Settings */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <Globe className="h-5 w-5" />
                                                                General Settings
                                                        </CardTitle>
                                                        <CardDescription>Basic platform configuration</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="siteName">Site Name</Label>
                                                                        <Input
                                                                                id="siteName"
                                                                                value={settings.general.siteName}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'general',
                                                                                                'siteName',
                                                                                                e.target.value,
                                                                                        )
                                                                                }
                                                                                placeholder="MindSpace"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="siteDescription">
                                                                                Site Description
                                                                        </Label>
                                                                        <Input
                                                                                id="siteDescription"
                                                                                value={settings.general.siteDescription}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'general',
                                                                                                'siteDescription',
                                                                                                e.target.value,
                                                                                        )
                                                                                }
                                                                                placeholder="Mental Health Support Platform"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="maintenanceMode">
                                                                                Maintenance Mode
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Temporarily disable the platform for
                                                                                maintenance
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="maintenanceMode"
                                                                        checked={settings.general.maintenanceMode}
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'general',
                                                                                        'maintenanceMode',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="allowRegistration">
                                                                                Allow Registration
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Allow new users to register
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="allowRegistration"
                                                                        checked={settings.general.allowRegistration}
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'general',
                                                                                        'allowRegistration',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Email Settings */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <Mail className="h-5 w-5" />
                                                                Email Configuration
                                                        </CardTitle>
                                                        <CardDescription>
                                                                SMTP settings for email notifications
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="smtpHost">SMTP Host</Label>
                                                                        <Input
                                                                                id="smtpHost"
                                                                                value={settings.email.smtpHost}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'email',
                                                                                                'smtpHost',
                                                                                                e.target.value,
                                                                                        )
                                                                                }
                                                                                placeholder="smtp.gmail.com"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="smtpPort">SMTP Port</Label>
                                                                        <Input
                                                                                id="smtpPort"
                                                                                type="number"
                                                                                value={settings.email.smtpPort}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'email',
                                                                                                'smtpPort',
                                                                                                parseInt(
                                                                                                        e.target.value,
                                                                                                ),
                                                                                        )
                                                                                }
                                                                                placeholder="587"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="smtpUser">SMTP Username</Label>
                                                                        <Input
                                                                                id="smtpUser"
                                                                                value={settings.email.smtpUser}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'email',
                                                                                                'smtpUser',
                                                                                                e.target.value,
                                                                                        )
                                                                                }
                                                                                placeholder="your-email@gmail.com"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="smtpPass">SMTP Password</Label>
                                                                        <Input
                                                                                id="smtpPass"
                                                                                type="password"
                                                                                value={settings.email.smtpPass}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'email',
                                                                                                'smtpPass',
                                                                                                e.target.value,
                                                                                        )
                                                                                }
                                                                                placeholder="••••••••"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Security Settings */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <Shield className="h-5 w-5" />
                                                                Security Settings
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Configure security and authentication settings
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="sessionTimeout">
                                                                                Session Timeout (hours)
                                                                        </Label>
                                                                        <Input
                                                                                id="sessionTimeout"
                                                                                type="number"
                                                                                value={settings.security.sessionTimeout}
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'security',
                                                                                                'sessionTimeout',
                                                                                                parseInt(
                                                                                                        e.target.value,
                                                                                                ),
                                                                                        )
                                                                                }
                                                                                min="1"
                                                                                max="168"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="maxLoginAttempts">
                                                                                Max Login Attempts
                                                                        </Label>
                                                                        <Input
                                                                                id="maxLoginAttempts"
                                                                                type="number"
                                                                                value={
                                                                                        settings.security
                                                                                                .maxLoginAttempts
                                                                                }
                                                                                onChange={(e) =>
                                                                                        updateSetting(
                                                                                                'security',
                                                                                                'maxLoginAttempts',
                                                                                                parseInt(
                                                                                                        e.target.value,
                                                                                                ),
                                                                                        )
                                                                                }
                                                                                min="1"
                                                                                max="10"
                                                                                className="border-primary/50 bg-white focus:border-primary"
                                                                        />
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="requireEmailVerification">
                                                                                Require Email Verification
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Users must verify their email before
                                                                                accessing the platform
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="requireEmailVerification"
                                                                        checked={
                                                                                settings.security
                                                                                        .requireEmailVerification
                                                                        }
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'security',
                                                                                        'requireEmailVerification',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="enableTwoFactor">
                                                                                Enable Two-Factor Authentication
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Add an extra layer of security with 2FA
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="enableTwoFactor"
                                                                        checked={settings.security.enableTwoFactor}
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'security',
                                                                                        'enableTwoFactor',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Notification Settings */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <Bell className="h-5 w-5" />
                                                                Notification Settings
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Configure notification preferences
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="emailNotifications">
                                                                                Email Notifications
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Send notifications via email
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="emailNotifications"
                                                                        checked={
                                                                                settings.notifications
                                                                                        .emailNotifications
                                                                        }
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'notifications',
                                                                                        'emailNotifications',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="pushNotifications">
                                                                                Push Notifications
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Send browser push notifications
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="pushNotifications"
                                                                        checked={
                                                                                settings.notifications.pushNotifications
                                                                        }
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'notifications',
                                                                                        'pushNotifications',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="moodReminders">
                                                                                Mood Reminders
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Send daily mood logging reminders
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="moodReminders"
                                                                        checked={settings.notifications.moodReminders}
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'notifications',
                                                                                        'moodReminders',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="achievementNotifications">
                                                                                Achievement Notifications
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Notify users when they earn achievements
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="achievementNotifications"
                                                                        checked={
                                                                                settings.notifications
                                                                                        .achievementNotifications
                                                                        }
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'notifications',
                                                                                        'achievementNotifications',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Appearance Settings */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <Palette className="h-5 w-5" />
                                                                Appearance Settings
                                                        </CardTitle>
                                                        <CardDescription>Customize platform appearance</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <div className="space-y-2">
                                                                <Label htmlFor="primaryColor">Primary Color</Label>
                                                                <Input
                                                                        id="primaryColor"
                                                                        type="color"
                                                                        value={settings.appearance.primaryColor}
                                                                        onChange={(e) =>
                                                                                updateSetting(
                                                                                        'appearance',
                                                                                        'primaryColor',
                                                                                        e.target.value,
                                                                                )
                                                                        }
                                                                        className="w-20 h-10 border-primary/50 bg-white focus:border-primary"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <Label htmlFor="darkMode">Dark Mode</Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Enable dark theme for the platform
                                                                        </p>
                                                                </div>
                                                                <Switch
                                                                        id="darkMode"
                                                                        checked={settings.appearance.darkMode}
                                                                        onCheckedChange={(checked) =>
                                                                                updateSetting(
                                                                                        'appearance',
                                                                                        'darkMode',
                                                                                        checked,
                                                                                )
                                                                        }
                                                                        className="border-primary/50 data-[state=unchecked]:bg-white data-[state=unchecked]:border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&>span]:data-[state=unchecked]:bg-primary [&>span]:data-[state=checked]:bg-white"
                                                                />
                                                        </div>
                                                        <div className="space-y-2">
                                                                <Label htmlFor="customCSS">Custom CSS</Label>
                                                                <Textarea
                                                                        id="customCSS"
                                                                        value={settings.appearance.customCSS}
                                                                        onChange={(e) =>
                                                                                updateSetting(
                                                                                        'appearance',
                                                                                        'customCSS',
                                                                                        e.target.value,
                                                                                )
                                                                        }
                                                                        placeholder="/* Add custom CSS here */"
                                                                        rows={4}
                                                                        className="border-primary/50 bg-white focus:border-primary"
                                                                />
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                        Add custom CSS to override default styles
                                                                </p>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* System Information */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                                <Database className="h-5 w-5" />
                                                                System Information
                                                        </CardTitle>
                                                        <CardDescription>
                                                                Platform status and system details
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                        <Label>Platform Version</Label>
                                                                        <p className="text-sm font-medium">1.0.0</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                        <Label>Database Status</Label>
                                                                        <Badge variant="default" className="bg-primary">
                                                                                Connected
                                                                        </Badge>
                                                                </div>
                                                                <div className="space-y-1">
                                                                        <Label>Last Backup</Label>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                {currentDate || 'Loading...'}
                                                                        </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                        <Label>System Status</Label>
                                                                        <Badge variant="default" className="bg-primary">
                                                                                Operational
                                                                        </Badge>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </div>
                        </main>
                </div>
        );
}
