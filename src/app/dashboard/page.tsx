'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Dashboard Components
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { SelfHelpTools } from '@/components/dashboard/self-help-tools';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

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

        // Listen for mood logged events
        useEffect(() => {
                const handleMoodLogged = () => {
                        fetchUserStats();
                };

                window.addEventListener('mood-logged', handleMoodLogged);
                return () => {
                        window.removeEventListener('mood-logged', handleMoodLogged);
                };
        }, []);

        const fetchUserStats = async () => {
                try {
                        const [userResponse, moodResponse, badgesResponse] = await Promise.all([
                                fetch('/api/user/profile'),
                                fetch('/api/mood?limit=100'),
                                fetch('/api/user/achievements'),
                        ]);

                        if (userResponse.ok && moodResponse.ok && badgesResponse.ok) {
                                const userData = await userResponse.json();
                                const moodData = await moodResponse.json();
                                const badgesData = await badgesResponse.json();

                                if (!moodData.moods) {
                                        return;
                                }

                                const averageMood =
                                        moodData.moods.length > 0
                                                ? moodData.moods.reduce(
                                                          (acc: number, log: { moodScore: number }) =>
                                                                  acc + log.moodScore,
                                                          0,
                                                  ) / moodData.moods.length
                                                : 0;

                                setUserStats({
                                        streakCount: userData.user.streakCount || 0,
                                        badges: badgesData.badges || [],
                                        totalMoodLogs: moodData.moods.length,
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

        const handleAchievementUnlocked = (achievement: { title: string }) => {
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
                                <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />

                                {/* Dashboard Header */}
                                <DashboardHeader userName={session.user?.name} />

                                {/* Stats Cards */}
                                <StatsCards userStats={userStats} />

                                {/* Main Content */}
                                <DashboardContent
                                        userStats={userStats}
                                        onStreakMilestone={handleStreakMilestone}
                                        onAchievementUnlocked={handleAchievementUnlocked}
                                        onMoodLogged={handleMoodLogged}
                                />

                                {/* Self-Help Tools */}
                                <SelfHelpTools />
                        </main>
                </div>
        );
}
