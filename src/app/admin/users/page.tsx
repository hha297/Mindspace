'use client';

import type React from 'react';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Users, Calendar, Flame, Heart, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DeleteDialog } from '@/components/delete-dialog';

interface User {
        _id: string;
        name?: string;
        email: string;
        provider: string;
        role: 'user' | 'admin';
        createdAt: string;
        streakCount: number;
        badges: string[];
        lastMoodLog?: string;
        moodLogCount: number;
}

interface UsersResponse {
        users: User[];
        totalUsers: number;
        totalPages: number;
        currentPage: number;
}

export default function AdminUsersPage() {
        const [usersData, setUsersData] = useState<UsersResponse | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [deletingUsers, setDeletingUsers] = useState<Set<string>>(new Set());
        const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

        const [updateDialog, setUpdateDialog] = useState<{ open: boolean; user: User | null; newRole: string }>({
                open: false,
                user: null,
                newRole: '',
        });

        const fetchUsers = useCallback(async () => {
                setIsLoading(true);
                try {
                        const params = new URLSearchParams({
                                page: currentPage.toString(),
                                limit: '10',
                                ...(searchTerm && { search: searchTerm }),
                        });

                        const response = await fetch(`/api/admin/users?${params}`);
                        if (response.ok) {
                                const data = await response.json();
                                setUsersData(data);
                        }
                } catch (error) {
                        console.error('Failed to fetch users:', error);
                } finally {
                        setIsLoading(false);
                }
        }, [currentPage, searchTerm]);

        useEffect(() => {
                fetchUsers();
        }, [fetchUsers]);

        const handleSearch = (e: React.FormEvent) => {
                e.preventDefault();
                setCurrentPage(1);
                fetchUsers();
        };

        const handleDeleteUser = async (userId: string, userName: string, userRole: string) => {
                try {
                        setDeletingUsers((prev) => new Set(prev).add(userId));
                        const response = await fetch(`/api/admin/users/${userId}`, {
                                method: 'DELETE',
                        });

                        if (response.ok) {
                                toast.success('User deleted successfully');
                                fetchUsers(); // Refresh the list
                        } else {
                                const error = await response.json();
                                toast.error(error.message || 'Failed to delete user');
                        }
                } catch (error) {
                        console.error('Error deleting user:', error);
                        toast.error('Failed to delete user');
                } finally {
                        setDeletingUsers((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(userId);
                                return newSet;
                        });
                }
        };

        const handleUpdateUser = (userId: string) => {
                const user = usersData?.users.find((u) => u._id === userId);
                if (user) {
                        setUpdateDialog({ open: true, user, newRole: user.role });
                }
        };

        const confirmUpdateUser = async () => {
                if (!updateDialog.user) return;

                const { user, newRole } = updateDialog;
                setUpdatingUsers((prev) => new Set(prev).add(user._id));
                try {
                        const response = await fetch(`/api/admin/users?id=${user._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ role: newRole }),
                        });

                        if (response.ok) {
                                toast.success(`User "${user.name || user.email}" role updated to ${newRole}`);
                                fetchUsers(); // Refresh the list
                                setUpdateDialog({ open: false, user: null, newRole: '' });
                        } else {
                                const error = await response.json();
                                toast.error(error.error || 'Failed to update user');
                        }
                } catch (error) {
                        console.error('Failed to update user:', error);
                        toast.error('Failed to update user');
                } finally {
                        setUpdatingUsers((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(user._id);
                                return newSet;
                        });
                }
        };

        if (isLoading && !usersData) {
                return (
                        <div className="p-8">
                                <div className="mb-8">
                                        <Skeleton className="h-8 w-64 mb-2" />
                                        <Skeleton className="h-4 w-96" />
                                </div>
                                <Skeleton className="h-96 w-full" />
                        </div>
                );
        }

        return (
                <div className="p-8">
                        <div className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
                                <p className="text-muted-foreground">Manage registered users and view their activity</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">{usersData?.totalUsers || 0}</div>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Mood Logs</CardTitle>
                                                <Heart className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">
                                                        {usersData?.users.length
                                                                ? usersData.users.reduce(
                                                                          (sum, u) => sum + u.moodLogCount,
                                                                          0,
                                                                  )
                                                                : 0}
                                                </div>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Average Streak</CardTitle>
                                                <Flame className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">
                                                        {usersData?.users.length
                                                                ? (
                                                                          usersData.users.reduce(
                                                                                  (sum, u) => sum + u.streakCount,
                                                                                  0,
                                                                          ) / usersData.users.length
                                                                  ).toFixed(1)
                                                                : '0.0'}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Days per user</p>
                                        </CardContent>
                                </Card>
                        </div>

                        {/* Search and Filters */}
                        <Card className="mb-6">
                                <CardHeader>
                                        <CardTitle>Search Users</CardTitle>
                                        <CardDescription>Find users by name or email</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <form onSubmit={handleSearch} className="flex gap-4">
                                                <div className="flex-1">
                                                        <Input
                                                                placeholder="Search by name or email..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="bg-white border-primary/50"
                                                        />
                                                </div>
                                                <Button type="submit">
                                                        <Search className="h-4 w-4 mr-2" />
                                                        Search
                                                </Button>
                                        </form>
                                </CardContent>
                        </Card>

                        {/* Users Table */}
                        <Card>
                                <CardHeader>
                                        <CardTitle>Users ({usersData?.totalUsers || 0})</CardTitle>
                                        <CardDescription>All registered users and their activity</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <Table>
                                                <TableHeader>
                                                        <TableRow>
                                                                <TableHead>User</TableHead>
                                                                <TableHead>Provider</TableHead>
                                                                <TableHead className="text-center">Role</TableHead>
                                                                <TableHead className="text-center">Joined</TableHead>
                                                                <TableHead className="text-center">Streak</TableHead>
                                                                <TableHead className="text-center">Mood Logs</TableHead>
                                                                <TableHead className="text-center">
                                                                        Last Active
                                                                </TableHead>
                                                                <TableHead className="text-center">Actions</TableHead>
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                        {usersData?.users.map((user) => (
                                                                <TableRow key={user._id}>
                                                                        <TableCell>
                                                                                <div>
                                                                                        <div className="font-medium">
                                                                                                {user.name ||
                                                                                                        'Anonymous'}
                                                                                        </div>
                                                                                        <div className="text-sm text-muted-foreground">
                                                                                                {user.email}
                                                                                        </div>
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <Badge
                                                                                        variant="outline"
                                                                                        className="capitalize"
                                                                                >
                                                                                        {user.provider}
                                                                                </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                                <Badge
                                                                                        variant={
                                                                                                user.role === 'admin'
                                                                                                        ? 'default'
                                                                                                        : 'secondary'
                                                                                        }
                                                                                        className="capitalize"
                                                                                >
                                                                                        {user.role}
                                                                                </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <div className="flex items-center justify-center text-sm text-muted-foreground">
                                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                                        {format(
                                                                                                new Date(
                                                                                                        user.createdAt,
                                                                                                ),
                                                                                                'MMM d, yyyy',
                                                                                        )}
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <div className="flex items-center justify-center">
                                                                                        <Flame className="h-4 w-4 text-orange-500 mr-1" />
                                                                                        <span className="font-medium">
                                                                                                {user.streakCount}
                                                                                        </span>
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                                <Badge variant="secondary">
                                                                                        {user.moodLogCount} logs
                                                                                </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                                {user.lastMoodLog ? (
                                                                                        <div className="text-sm text-muted-foreground">
                                                                                                {format(
                                                                                                        new Date(
                                                                                                                user.lastMoodLog,
                                                                                                        ),
                                                                                                        'MMM d, yyyy',
                                                                                                )}
                                                                                        </div>
                                                                                ) : (
                                                                                        <span className="text-sm text-muted-foreground">
                                                                                                Never
                                                                                        </span>
                                                                                )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <div className="flex gap-2 items-center justify-center">
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                        handleUpdateUser(
                                                                                                                user._id,
                                                                                                        )
                                                                                                }
                                                                                                disabled={updatingUsers.has(
                                                                                                        user._id,
                                                                                                )}
                                                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                                        >
                                                                                                <Edit className="h-4 w-4 mr-1" />
                                                                                                {updatingUsers.has(
                                                                                                        user._id,
                                                                                                )
                                                                                                        ? 'Updating...'
                                                                                                        : 'Edit'}
                                                                                        </Button>
                                                                                        <DeleteDialog
                                                                                                title="Delete User"
                                                                                                description={`Are you sure you want to delete ${
                                                                                                        user.role
                                                                                                } "${
                                                                                                        user.name ||
                                                                                                        user.email
                                                                                                }"? This action cannot be undone and will also delete all their mood logs.`}
                                                                                                onDelete={() =>
                                                                                                        handleDeleteUser(
                                                                                                                user._id,
                                                                                                                user.name ||
                                                                                                                        user.email,
                                                                                                                user.role,
                                                                                                        )
                                                                                                }
                                                                                                trigger={
                                                                                                        <Button
                                                                                                                variant="outline"
                                                                                                                size="sm"
                                                                                                                disabled={
                                                                                                                        deletingUsers.has(
                                                                                                                                user._id,
                                                                                                                        ) ||
                                                                                                                        user.role ===
                                                                                                                                'admin'
                                                                                                                }
                                                                                                                className={cn(
                                                                                                                        'text-red-600 hover:text-red-700 hover:bg-red-50',
                                                                                                                        user.role ===
                                                                                                                                'admin' &&
                                                                                                                                'opacity-50 cursor-not-allowed',
                                                                                                                )}
                                                                                                        >
                                                                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                                                                {deletingUsers.has(
                                                                                                                        user._id,
                                                                                                                )
                                                                                                                        ? 'Deleting...'
                                                                                                                        : 'Delete'}
                                                                                                        </Button>
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                        </TableCell>
                                                                </TableRow>
                                                        ))}
                                                </TableBody>
                                        </Table>

                                        {/* Pagination */}
                                        {usersData && usersData.totalPages > 1 && (
                                                <div className="flex items-center justify-between mt-6">
                                                        <div className="text-sm text-muted-foreground">
                                                                Page {usersData.currentPage} of {usersData.totalPages}
                                                        </div>
                                                        <div className="flex gap-2">
                                                                <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                                setCurrentPage(
                                                                                        Math.max(1, currentPage - 1),
                                                                                )
                                                                        }
                                                                        disabled={currentPage === 1}
                                                                >
                                                                        Previous
                                                                </Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                                setCurrentPage(
                                                                                        Math.min(
                                                                                                usersData.totalPages,
                                                                                                currentPage + 1,
                                                                                        ),
                                                                                )
                                                                        }
                                                                        disabled={currentPage === usersData.totalPages}
                                                                >
                                                                        Next
                                                                </Button>
                                                        </div>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>

                        {/* Update User Dialog */}
                        <Dialog
                                open={updateDialog.open}
                                onOpenChange={(open) => setUpdateDialog({ open, user: null, newRole: '' })}
                        >
                                <DialogContent>
                                        <DialogHeader>
                                                <DialogTitle>Update User Role</DialogTitle>
                                                <DialogDescription>
                                                        Change the role for user &quot;
                                                        {updateDialog.user?.name || updateDialog.user?.email}&quot;
                                                </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                                <div className="space-y-2">
                                                        <Label htmlFor="role">Role</Label>
                                                        <Select
                                                                value={updateDialog.newRole}
                                                                onValueChange={(value) =>
                                                                        setUpdateDialog((prev) => ({
                                                                                ...prev,
                                                                                newRole: value,
                                                                        }))
                                                                }
                                                        >
                                                                <SelectTrigger>
                                                                        <SelectValue placeholder="Select role" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        <SelectItem value="user">User</SelectItem>
                                                                        <SelectItem value="admin">Admin</SelectItem>
                                                                </SelectContent>
                                                        </Select>
                                                </div>
                                        </div>
                                        <DialogFooter>
                                                <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                                setUpdateDialog({
                                                                        open: false,
                                                                        user: null,
                                                                        newRole: '',
                                                                })
                                                        }
                                                >
                                                        Cancel
                                                </Button>
                                                <Button
                                                        onClick={confirmUpdateUser}
                                                        disabled={
                                                                updatingUsers.has(updateDialog.user?._id || '') ||
                                                                !updateDialog.newRole
                                                        }
                                                >
                                                        {updatingUsers.has(updateDialog.user?._id || '')
                                                                ? 'Updating...'
                                                                : 'Update User'}
                                                </Button>
                                        </DialogFooter>
                                </DialogContent>
                        </Dialog>
                </div>
        );
}
