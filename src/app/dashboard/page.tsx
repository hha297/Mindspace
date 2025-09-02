/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { MoodTracker } from '@/components/mood-tracker';
import { MoodHistory } from '@/components/mood-history';
import { MoodChart } from '@/components/mood-chart';
import { AchievementSystem } from '@/components/achievement-system';
import { StreakCelebration } from '@/components/streak-celebration';
import { MotivationalQuotes } from '@/components/motivational-quotes';
import { ProgressCelebration } from '@/components/progress-celebration';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Heart, Flame, Trophy, BookOpen, Activity, PenTool, ClipboardList, Sparkles } from 'lucide-react';

interface UserStats {
        streakCount: number;
        badges: string[];
        totalMoodLogs: number;
        averageMood: number;
}

export default function DashboardPage() {
        const { data: session, status } = useSession();
        const router = useRouter();
        const [userStats, setUserStats] = useState<UserStats | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                if (status === 'unauthenticated') {
                        router.push('/sign-in');
                } else if (status === 'authenticated') {
                        fetchUserStats();
                }
        }, [status, router]);

        const fetchUserStats = async () => {
                try {
                        const [userResponse, moodResponse] = await Promise.all([
                                fetch('/api/user/profile'),
                                fetch('/api/moods?limit=100'),
                        ]);

                        if (userResponse.ok && moodResponse.ok) {
                                const userData = await userResponse.json();
                                const moodData = await moodResponse.json();

                                if (!moodData.moodLogs) {
                                        return;
                                }

                                const averageMood =
                                        moodData.moodLogs.length > 0
                                                ? moodData.moodLogs.reduce(
                                                          (acc: number, log: any) => acc + log.moodScore,
                                                          0,
                                                  ) / moodData.moodLogs.length
                                                : 0;

                                setUserStats({
                                        streakCount: userData.user.streakCount || 0,
                                        badges: userData.user.badges || [],
                                        totalMoodLogs: moodData.moodLogs.length,
                                        averageMood: averageMood || 0,
                                });
                        }
                } catch (error) {
                        console.error('Failed to fetch user stats:', error);
                } finally {
                        setIsLoading(false);
                }
        };

        const handleMoodLogged = () => {
                fetchUserStats();
        };

        const handleAchievementUnlocked = (achievement: any) => {
                toast.success('Achievement Unlocked! 🏆', {
                        description: `You've earned the "${achievement.title}" badge!`,
                });
        };

        const handleStreakMilestone = (milestone: number) => {
                toast.success(`${milestone} Day Streak! 🔥`, {
                        description: "You're building incredible mental health habits!",
                });
        };

        if (status === 'loading' || isLoading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <div className="space-y-6">
                                                <Skeleton className="h-8 w-64" />
                                                <div className="grid md:grid-cols-4 gap-4">
                                                        {[...Array(4)].map((_, i) => (
                                                                <Skeleton key={i} className="h-24" />
                                                        ))}
                                                </div>
                                                <Skeleton className="h-96" />
                                        </div>
                                </main>
                        </div>
                );
        }

        if (!session) {
                return null;
        }

        const getGreeting = () => {
                const hour = new Date().getHours();
                if (hour < 12) return 'Good morning';
                if (hour < 17) return 'Good afternoon';
                return 'Good evening';
        };

        const getMoodEmoji = (score: number) => {
                if (score >= 4.5) return '😄';
                if (score >= 3.5) return '😊';
                if (score >= 2.5) return '😐';
                if (score >= 1.5) return '😔';
                return '😢';
        };

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />

                                {/* Welcome Section */}
                                <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-foreground mb-2">
                                                {getGreeting()}, {session.user?.name || 'there'}!
                                        </h1>
                                        <p className="text-lg text-muted-foreground">
                                                Welcome to your personal mental health dashboard. How are you feeling
                                                today?
                                        </p>
                                </div>

                                {/* Motivational Quote */}
                                <div className="mb-8">
                                        <MotivationalQuotes />
                                </div>

                                {/* Streak Celebration */}
                                {userStats && (
                                        <div className="mb-8">
                                                <StreakCelebration
                                                        streakCount={userStats.streakCount}
                                                        onStreakMilestone={handleStreakMilestone}
                                                />
                                        </div>
                                )}

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                                                <CardContent className="p-4 text-center">
                                                        <div className="flex items-center justify-center mb-2">
                                                                <Flame className="h-6 w-6 text-orange-500" />
                                                        </div>
                                                        <div className="text-2xl font-bold text-orange-600">
                                                                {userStats?.streakCount || 0}
                                                        </div>
                                                        <div className="text-sm text-orange-600">Day Streak</div>
                                                </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                                                <CardContent className="p-4 text-center">
                                                        <div className="flex items-center justify-center mb-2">
                                                                <Heart className="h-6 w-6 text-pink-500" />
                                                        </div>
                                                        <div className="text-2xl font-bold text-pink-600">
                                                                {userStats?.totalMoodLogs || 0}
                                                        </div>
                                                        <div className="text-sm text-pink-600">Mood Logs</div>
                                                </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                                <CardContent className="p-4 text-center">
                                                        <div className="flex items-center justify-center mb-2">
                                                                <span className="text-2xl">
                                                                        {getMoodEmoji(userStats?.averageMood || 0)}
                                                                </span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-blue-600">
                                                                {userStats?.averageMood.toFixed(1) || '0.0'}
                                                        </div>
                                                        <div className="text-sm text-blue-600">Avg Mood</div>
                                                </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                                                <CardContent className="p-4 text-center">
                                                        <div className="flex items-center justify-center mb-2">
                                                                <Trophy className="h-6 w-6 text-yellow-500" />
                                                        </div>
                                                        <div className="text-2xl font-bold text-yellow-600">
                                                                {userStats?.badges.length || 0}
                                                        </div>
                                                        <div className="text-sm text-yellow-600">Badges</div>
                                                </CardContent>
                                        </Card>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid lg:grid-cols-3 gap-8">
                                        {/* Left Column - Mood Tracker */}
                                        <div className="lg:col-span-1 space-y-8">
                                                <MoodTracker onMoodLogged={handleMoodLogged} />

                                                {/* Achievement System */}
                                                {userStats && (
                                                        <AchievementSystem
                                                                userStats={userStats}
                                                                onAchievementUnlocked={handleAchievementUnlocked}
                                                        />
                                                )}
                                        </div>

                                        {/* Right Column - History and Charts */}
                                        <div className="lg:col-span-2 space-y-8">
                                                {/* Progress Celebration */}
                                                {userStats && (
                                                        <ProgressCelebration
                                                                totalMoodLogs={userStats.totalMoodLogs}
                                                                averageMood={userStats.averageMood}
                                                                streakCount={userStats.streakCount}
                                                        />
                                                )}

                                                <MoodChart />
                                                <MoodHistory />
                                        </div>
                                </div>

                                {/* Self-Help Tools */}
                                <div className="mt-12">
                                        <div className="flex items-center space-x-2 mb-6">
                                                <Sparkles className="h-6 w-6 text-primary" />
                                                <h2 className="text-2xl font-semibold">Self-Help Tools</h2>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4">
                                                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                                        <CardContent className="p-6 text-center">
                                                                <Activity className="h-8 w-8 text-green-600 mx-auto mb-3" />
                                                                <CardTitle className="text-lg mb-2 text-green-800">
                                                                        Breathing Exercise
                                                                </CardTitle>
                                                                <CardDescription className="text-green-600">
                                                                        Take 5 minutes to calm your mind
                                                                </CardDescription>
                                                                <Button
                                                                        className="mt-4 bg-green-600 hover:bg-green-700"
                                                                        variant="default"
                                                                        size="sm"
                                                                        asChild
                                                                >
                                                                        <Link href="/tools?tab=breathing">
                                                                                Start Exercise
                                                                        </Link>
                                                                </Button>
                                                        </CardContent>
                                                </Card>

                                                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                                                        <CardContent className="p-6 text-center">
                                                                <PenTool className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                                                                <CardTitle className="text-lg mb-2 text-purple-800">
                                                                        Journal Writing
                                                                </CardTitle>
                                                                <CardDescription className="text-purple-600">
                                                                        Express your thoughts and feelings
                                                                </CardDescription>
                                                                <Button
                                                                        className="mt-4 bg-purple-600 hover:bg-purple-700"
                                                                        variant="default"
                                                                        size="sm"
                                                                        asChild
                                                                >
                                                                        <Link href="/tools?tab=journaling">
                                                                                Start Writing
                                                                        </Link>
                                                                </Button>
                                                        </CardContent>
                                                </Card>

                                                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                                                        <CardContent className="p-6 text-center">
                                                                <ClipboardList className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                                                <CardTitle className="text-lg mb-2 text-blue-800">
                                                                        Self-Assessment
                                                                </CardTitle>
                                                                <CardDescription className="text-blue-600">
                                                                        Check in with your mental health
                                                                </CardDescription>
                                                                <Button
                                                                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                                                                        variant="default"
                                                                        size="sm"
                                                                        asChild
                                                                >
                                                                        <Link href="/tools?tab=assessment">
                                                                                Take Assessment
                                                                        </Link>
                                                                </Button>
                                                        </CardContent>
                                                </Card>

                                                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                                                        <CardContent className="p-6 text-center">
                                                                <BookOpen className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                                                <CardTitle className="text-lg mb-2 text-amber-800">
                                                                        Browse Resources
                                                                </CardTitle>
                                                                <CardDescription className="text-amber-600">
                                                                        Find helpful articles and tools
                                                                </CardDescription>
                                                                <Button
                                                                        className="mt-4 bg-amber-600 hover:bg-amber-700"
                                                                        variant="default"
                                                                        size="sm"
                                                                        asChild
                                                                >
                                                                        <Link href="/resources">Explore Resources</Link>
                                                                </Button>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
