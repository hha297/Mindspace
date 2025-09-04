/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import {
        LineChart,
        Line,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
        PieChart,
        Pie,
        Cell,
} from 'recharts';
import { format } from 'date-fns';

interface AdminStats {
        totalUsers: number;
        totalMoodLogs: number;
        totalResources: number;
        recentUsers: any[];
        moodDistribution: any[];
        dailyActiveUsers: any[];
}

const getMoodLabel = (mood: number) => {
        switch (mood) {
                case 1:
                        return 'Very Sad';
                case 2:
                        return 'Sad';
                case 3:
                        return 'Neutral';
                case 4:
                        return 'Happy';
                case 5:
                        return 'Very Happy';
                default:
                        return 'Unknown';
        }
};

const getMoodColor = (mood: number) => {
        switch (mood) {
                case 1:
                        return '#ef4444'; // red
                case 2:
                        return '#f97316'; // orange
                case 3:
                        return '#6b7280'; // gray
                case 4:
                        return '#22c55e'; // green
                case 5:
                        return '#10b981'; // emerald
                default:
                        return '#6b7280';
        }
};

export default function AdminDashboard() {
        const [stats, setStats] = useState<AdminStats | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                fetchStats();
        }, []);

        const fetchStats = async () => {
                try {
                        const response = await fetch('/api/admin/stats');
                        if (response.ok) {
                                const data = await response.json();
                                setStats(data);
                        }
                } catch (error) {
                        console.error('Failed to fetch admin stats:', error);
                } finally {
                        setIsLoading(false);
                }
        };

        if (isLoading) {
                return (
                        <div className="p-4 md:p-8">
                                <div className="mb-8">
                                        <Skeleton className="h-8 w-64 mb-2" />
                                        <Skeleton className="h-4 w-96" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        {[...Array(4)].map((_, i) => (
                                                <Skeleton key={i} className="h-32" />
                                        ))}
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Skeleton className="h-80" />
                                        <Skeleton className="h-80" />
                                </div>
                        </div>
                );
        }

        const moodDistributionData =
                stats?.moodDistribution.map((item) => ({
                        name: getMoodLabel(item._id),
                        value: item.count,
                        color: getMoodColor(item._id),
                })) || [];

        return (
                <div className="p-4 md:p-8">
                        <div className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                                <p className="text-muted-foreground">
                                        Overview of MindSpace platform usage and user engagement
                                </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                                                <p className="text-xs text-muted-foreground">Registered students</p>
                                        </CardContent>
                                </Card>

                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Mood Logs</CardTitle>
                                                <Heart className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">{stats?.totalMoodLogs || 0}</div>
                                                <p className="text-xs text-muted-foreground">Total mood entries</p>
                                        </CardContent>
                                </Card>

                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Resources</CardTitle>
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">{stats?.totalResources || 0}</div>
                                                <p className="text-xs text-muted-foreground">Published resources</p>
                                        </CardContent>
                                </Card>

                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                                <div className="text-2xl font-bold">
                                                        {stats?.totalMoodLogs && stats?.totalUsers
                                                                ? (stats.totalMoodLogs / stats.totalUsers).toFixed(1)
                                                                : '0.0'}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Avg logs per user</p>
                                        </CardContent>
                                </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                {/* Daily Active Users Chart */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Daily Active Users</CardTitle>
                                                <CardDescription>
                                                        Users who logged moods in the past 7 days
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={stats?.dailyActiveUsers || []}>
                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                <XAxis
                                                                        dataKey="date"
                                                                        fontSize={12}
                                                                        tickFormatter={(value) =>
                                                                                format(new Date(value), 'MMM d')
                                                                        }
                                                                />
                                                                <YAxis fontSize={12} />
                                                                <Tooltip
                                                                        labelFormatter={(value) =>
                                                                                format(new Date(value), 'MMM d, yyyy')
                                                                        }
                                                                        formatter={(value: number) => [
                                                                                value,
                                                                                'Active Users',
                                                                        ]}
                                                                />
                                                                <Line
                                                                        type="monotone"
                                                                        dataKey="activeUsers"
                                                                        stroke="hsl(var(--primary))"
                                                                        strokeWidth={2}
                                                                        dot={{
                                                                                fill: 'hsl(var(--primary))',
                                                                                strokeWidth: 2,
                                                                                r: 4,
                                                                        }}
                                                                />
                                                        </LineChart>
                                                </ResponsiveContainer>
                                        </CardContent>
                                </Card>

                                {/* Mood Distribution Chart */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Mood Distribution</CardTitle>
                                                <CardDescription>
                                                        Overall mood patterns across all users
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                                <Pie
                                                                        data={moodDistributionData}
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        outerRadius={80}
                                                                        fill="#8884d8"
                                                                        dataKey="value"
                                                                        label={({ name, percent }) =>
                                                                                `${name} ${(percent * 100).toFixed(0)}%`
                                                                        }
                                                                >
                                                                        {moodDistributionData.map((entry, index) => (
                                                                                <Cell
                                                                                        key={`cell-${index}`}
                                                                                        fill={entry.color}
                                                                                />
                                                                        ))}
                                                                </Pie>
                                                                <Tooltip />
                                                        </PieChart>
                                                </ResponsiveContainer>
                                        </CardContent>
                                </Card>
                        </div>

                        {/* Recent Users */}
                        <Card className="mb-8">
                                <CardHeader>
                                        <CardTitle>Recent Users</CardTitle>
                                        <CardDescription>Latest user registrations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <div className="space-y-4">
                                                {stats?.recentUsers.map((user) => (
                                                        <div
                                                                key={user._id}
                                                                className="flex items-center justify-between p-4 border rounded-lg"
                                                        >
                                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                <span className="text-sm font-medium text-primary">
                                                                                        {user.name?.charAt(0) ||
                                                                                                user.email.charAt(0)}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                                <p className="font-medium text-sm truncate">
                                                                                        {user.name || 'Anonymous'}
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground truncate">
                                                                                        {user.email}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                                <div className="text-right flex-shrink-0 ml-2">
                                                                        <Badge variant="secondary" className="text-xs">
                                                                                {user.streakCount} day streak
                                                                        </Badge>
                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                                <Calendar className="h-3 w-3 inline mr-1" />
                                                                                {format(
                                                                                        new Date(user.createdAt),
                                                                                        'MMM d, yyyy',
                                                                                )}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </CardContent>
                        </Card>

                        {/* Platform Summary */}
                        <Card>
                                <CardHeader>
                                        <CardTitle>Platform Summary</CardTitle>
                                        <CardDescription>Key insights and statistics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="text-center">
                                                        <div className="text-2xl font-bold text-primary">
                                                                {stats?.totalMoodLogs && stats?.totalUsers
                                                                        ? Math.round(
                                                                                  stats.totalMoodLogs /
                                                                                          stats.totalUsers,
                                                                          )
                                                                        : 0}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                                Avg mood logs per user
                                                        </p>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">
                                                                {stats?.dailyActiveUsers &&
                                                                stats.dailyActiveUsers.length > 0
                                                                        ? Math.round(
                                                                                  stats.dailyActiveUsers.reduce(
                                                                                          (sum, day) =>
                                                                                                  sum + day.activeUsers,
                                                                                          0,
                                                                                  ) / stats.dailyActiveUsers.length,
                                                                          )
                                                                        : 0}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                                Avg daily active users
                                                        </p>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-2xl font-bold text-blue-600">
                                                                {stats?.moodDistribution &&
                                                                stats.moodDistribution.length > 0
                                                                        ? Math.round(
                                                                                  stats.moodDistribution.reduce(
                                                                                          (sum, mood) =>
                                                                                                  sum + mood.count,
                                                                                          0,
                                                                                  ) / stats.moodDistribution.length,
                                                                          )
                                                                        : 0}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">Avg mood score</p>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        );
}
