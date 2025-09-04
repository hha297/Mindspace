'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface PasswordData {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
}

interface ShowPasswords {
        current: boolean;
        new: boolean;
        confirm: boolean;
}

interface PasswordChangeProps {
        passwordData: PasswordData;
        setPasswordData: (data: PasswordData) => void;
        showPasswords: ShowPasswords;
        setShowPasswords: (show: ShowPasswords) => void;
        onPasswordChange: () => void;
        isChangingPassword: boolean;
}

export function PasswordChange({
        passwordData,
        setPasswordData,
        showPasswords,
        setShowPasswords,
        onPasswordChange,
        isChangingPassword,
}: PasswordChangeProps) {
        const updatePasswordData = (field: keyof PasswordData, value: string) => {
                setPasswordData({ ...passwordData, [field]: value });
        };

        const togglePasswordVisibility = (field: keyof ShowPasswords) => {
                setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
        };

        return (
                <Card>
                        <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Change Password
                                </CardTitle>
                                <CardDescription>Update your account password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                                <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                                <Input
                                                        id="currentPassword"
                                                        type={showPasswords.current ? 'text' : 'password'}
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) =>
                                                                updatePasswordData('currentPassword', e.target.value)
                                                        }
                                                        placeholder="Enter current password"
                                                />
                                                <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => togglePasswordVisibility('current')}
                                                >
                                                        {showPasswords.current ? (
                                                                <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                                <Eye className="h-4 w-4" />
                                                        )}
                                                </Button>
                                        </div>
                                </div>

                                <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                                <Input
                                                        id="newPassword"
                                                        type={showPasswords.new ? 'text' : 'password'}
                                                        value={passwordData.newPassword}
                                                        onChange={(e) =>
                                                                updatePasswordData('newPassword', e.target.value)
                                                        }
                                                        placeholder="Enter new password"
                                                />
                                                <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => togglePasswordVisibility('new')}
                                                >
                                                        {showPasswords.new ? (
                                                                <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                                <Eye className="h-4 w-4" />
                                                        )}
                                                </Button>
                                        </div>
                                </div>

                                <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <div className="relative">
                                                <Input
                                                        id="confirmPassword"
                                                        type={showPasswords.confirm ? 'text' : 'password'}
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) =>
                                                                updatePasswordData('confirmPassword', e.target.value)
                                                        }
                                                        placeholder="Confirm new password"
                                                />
                                                <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => togglePasswordVisibility('confirm')}
                                                >
                                                        {showPasswords.confirm ? (
                                                                <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                                <Eye className="h-4 w-4" />
                                                        )}
                                                </Button>
                                        </div>
                                </div>

                                <Button onClick={onPasswordChange} disabled={isChangingPassword} className="w-full">
                                        {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                                </Button>
                        </CardContent>
                </Card>
        );
}
