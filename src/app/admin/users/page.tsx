'use client';

import type React from 'react';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Calendar, Flame, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface User {
        _id: string;
        name?: string;
        email: string;
        provider: string;
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
                                                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                                <Heart className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">
                                                        {usersData?.users.filter((u) => u.lastMoodLog).length || 0}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Users with mood logs</p>
                                        </CardContent>
                                </Card>

                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Avg Streak</CardTitle>
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
                                                                <TableHead>Joined</TableHead>
                                                                <TableHead>Streak</TableHead>
                                                                <TableHead>Mood Logs</TableHead>
                                                                <TableHead>Last Active</TableHead>
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
                                                                        <TableCell>
                                                                                <div className="flex items-center text-sm text-muted-foreground">
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
                                                                                <div className="flex items-center">
                                                                                        <Flame className="h-4 w-4 text-orange-500 mr-1" />
                                                                                        <span className="font-medium">
                                                                                                {user.streakCount}
                                                                                        </span>
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                                <Badge variant="secondary">
                                                                                        {user.moodLogCount} logs
                                                                                </Badge>
                                                                        </TableCell>
                                                                        <TableCell>
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
                </div>
        );
}
