'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
        Users,
        BookOpen,
        TrendingUp,
        Activity,
        Calendar,
        BarChart3,
        PieChart,
        Target,
        Clock,
        Star,
        Eye,
        Heart,
        Smile,
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
        totalUsers: number;
        totalMoodLogs: number;
        totalResources: number;
        recentUsers: Array<{
                name: string;
                email: string;
                createdAt: string;
                streakCount: number;
        }>;
        moodDistribution: Array<{
                _id: number;
                count: number;
        }>;
        dailyActiveUsers: Array<{
                date: string;
                activeUsers: number;
        }>;
}

export default function AdminAnalyticsPage() {
        const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                fetchAnalytics();
        }, []);

        const fetchAnalytics = async () => {
                try {
                        setIsLoading(true);
                        const response = await fetch('/api/admin/stats');

                        if (response.ok) {
                                const data = await response.json();
                                console.log('Analytics data:', data);
                                setAnalytics(data);
                        } else {
                                const errorData = await response.json();
                                console.error('API Error:', errorData);
                                toast.error(`Failed to load analytics: ${errorData.error || 'Unknown error'}`);
                        }
                } catch (error) {
                        console.error('Error fetching analytics:', error);
                        toast.error('Failed to load analytics');
                } finally {
                        setIsLoading(false);
                }
        };

        const formatNumber = (num: number) => {
                return new Intl.NumberFormat().format(num);
        };

        const formatDate = (dateString: string) => {
                return new Date(dateString).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                });
        };

        const getMoodEmoji = (mood: number) => {
                switch (mood) {
                        case 1:
                                return '😢';
                        case 2:
                                return '😕';
                        case 3:
                                return '😐';
                        case 4:
                                return '🙂';
                        case 5:
                                return '😊';
                        default:
                                return '😐';
                }
        };

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

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <div className="mb-8">
                                                <Skeleton className="h-8 w-64 mb-2" />
                                                <Skeleton className="h-4 w-96" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                {[...Array(4)].map((_, i) => (
                                                        <Card key={i}>
                                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                                        <Skeleton className="h-4 w-24" />
                                                                        <Skeleton className="h-4 w-4" />
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <Skeleton className="h-8 w-16 mb-2" />
                                                                        <Skeleton className="h-3 w-20" />
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {[...Array(2)].map((_, i) => (
                                                        <Card key={i}>
                                                                <CardHeader>
                                                                        <Skeleton className="h-6 w-32" />
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <Skeleton className="h-64 w-full" />
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </main>
                        </div>
                );
        }

        if (!analytics) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <div className="text-center py-12">
                                                <h1 className="text-2xl font-bold text-foreground mb-4">
                                                        Analytics Not Available
                                                </h1>
                                                <p className="text-muted-foreground mb-6">
                                                        Analytics data is not available at the moment.
                                                </p>
                                                <Button onClick={fetchAnalytics}>Retry</Button>
                                        </div>
                                </main>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />
                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Header */}
                                <div className="mb-8">
                                        <div>
                                                <h1 className="text-3xl font-bold text-foreground mb-2">
                                                        Analytics Dashboard
                                                </h1>
                                                <p className="text-muted-foreground">
                                                        Monitor platform performance and user engagement with real data
                                                </p>
                                        </div>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-sm font-medium">
                                                                Total Users
                                                        </CardTitle>
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="text-2xl font-bold">
                                                                {formatNumber(analytics.totalUsers)}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                                Registered users
                                                        </p>
                                                </CardContent>
                                        </Card>

                                        <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-sm font-medium">
                                                                Total Resources
                                                        </CardTitle>
                                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="text-2xl font-bold">
                                                                {formatNumber(analytics.totalResources)}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                                Available resources
                                                        </p>
                                                </CardContent>
                                        </Card>

                                        <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-sm font-medium">Mood Logs</CardTitle>
                                                        <Heart className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="text-2xl font-bold">
                                                                {formatNumber(analytics.totalMoodLogs)}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                                Total mood entries
                                                        </p>
                                                </CardContent>
                                        </Card>

                                        <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-sm font-medium">
                                                                Active Users (7d)
                                                        </CardTitle>
                                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="text-2xl font-bold">
                                                                {formatNumber(
                                                                        analytics.dailyActiveUsers.reduce(
                                                                                (sum, day) => sum + day.activeUsers,
                                                                                0,
                                                                        ),
                                                                )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                                                </CardContent>
                                        </Card>
                                </div>

                                {/* Charts and Details */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                        {/* Mood Distribution */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Mood Distribution</CardTitle>
                                                        <CardDescription>
                                                                Distribution of user mood logs
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="space-y-3">
                                                                {analytics.moodDistribution.map((mood) => (
                                                                        <div
                                                                                key={mood._id}
                                                                                className="flex items-center justify-between"
                                                                        >
                                                                                <div className="flex items-center space-x-2">
                                                                                        <span className="text-lg">
                                                                                                {getMoodEmoji(mood._id)}
                                                                                        </span>
                                                                                        <span className="text-sm">
                                                                                                {getMoodLabel(mood._id)}
                                                                                        </span>
                                                                                </div>
                                                                                <Badge variant="secondary">
                                                                                        {mood.count}
                                                                                </Badge>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Daily Active Users */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Daily Active Users</CardTitle>
                                                        <CardDescription>
                                                                User activity over the last 7 days
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="space-y-3">
                                                                {analytics.dailyActiveUsers.map((day) => (
                                                                        <div
                                                                                key={day.date}
                                                                                className="flex items-center justify-between"
                                                                        >
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                                        <span className="text-sm">
                                                                                                {day.date}
                                                                                        </span>
                                                                                </div>
                                                                                <Badge variant="secondary">
                                                                                        {day.activeUsers} users
                                                                                </Badge>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </div>

                                {/* Recent Users */}
                                <Card className="mb-8">
                                        <CardHeader>
                                                <CardTitle>Recent Users</CardTitle>
                                                <CardDescription>Latest registered users</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {analytics.recentUsers.map((user, index) => (
                                                                <div
                                                                        key={index}
                                                                        className="flex items-center justify-between p-3 border rounded-lg"
                                                                >
                                                                        <div className="flex items-center space-x-3">
                                                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                                                        <span className="text-sm font-medium text-primary">
                                                                                                {index + 1}
                                                                                        </span>
                                                                                </div>
                                                                                <div>
                                                                                        <h4 className="font-medium">
                                                                                                {user.name}
                                                                                        </h4>
                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                {user.email}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-4">
                                                                                <div className="text-right">
                                                                                        <div className="text-sm font-medium">
                                                                                                {user.streakCount} days
                                                                                        </div>
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                                streak
                                                                                        </div>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                        <div className="text-sm font-medium">
                                                                                                {formatDate(
                                                                                                        user.createdAt,
                                                                                                )}
                                                                                        </div>
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                                joined
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </CardContent>
                                </Card>

                                {/* Summary Stats */}
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Platform Summary</CardTitle>
                                                <CardDescription>Key insights and statistics</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="text-center">
                                                                <div className="text-2xl font-bold text-primary">
                                                                        {analytics.totalMoodLogs > 0
                                                                                ? Math.round(
                                                                                          analytics.totalMoodLogs /
                                                                                                  analytics.totalUsers,
                                                                                  )
                                                                                : 0}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Avg mood logs per user
                                                                </p>
                                                        </div>
                                                        <div className="text-center">
                                                                <div className="text-2xl font-bold text-green-600">
                                                                        {analytics.dailyActiveUsers.length > 0
                                                                                ? Math.round(
                                                                                          analytics.dailyActiveUsers.reduce(
                                                                                                  (sum, day) =>
                                                                                                          sum +
                                                                                                          day.activeUsers,
                                                                                                  0,
                                                                                          ) /
                                                                                                  analytics
                                                                                                          .dailyActiveUsers
                                                                                                          .length,
                                                                                  )
                                                                                : 0}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Avg daily active users
                                                                </p>
                                                        </div>
                                                        <div className="text-center">
                                                                <div className="text-2xl font-bold text-blue-600">
                                                                        {analytics.moodDistribution.length > 0
                                                                                ? analytics.moodDistribution.reduce(
                                                                                          (sum, mood) =>
                                                                                                  sum + mood.count,
                                                                                          0,
                                                                                  ) / analytics.moodDistribution.length
                                                                                : 0}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Avg mood score
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>
                        </main>
                </div>
        );
}
