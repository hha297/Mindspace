/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MoodTracker } from '@/components/mood-tracker';
import { MoodHistory } from '@/components/mood-history';
import { MoodChart } from '@/components/mood-chart';
import { AchievementSystem } from '@/components/achievement-system';
import { StreakCelebration } from '@/components/streak-celebration';
import { ProgressCelebration } from '@/components/progress-celebration';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface UserStats {
        streakCount: number;
        badges: string[];
        totalMoodLogs: number;
        averageMood: number;
}

interface DashboardContentProps {
        userStats: UserStats | null;
        onStreakMilestone: (milestone: number) => void;
        onAchievementUnlocked: (achievement: any) => void;
        onMoodLogged: () => void;
}

export function DashboardContent({
        userStats,
        onStreakMilestone,
        onAchievementUnlocked,
        onMoodLogged,
}: DashboardContentProps) {
        return (
                <div className="space-y-8">
                        {/* Streak Celebration */}
                        {userStats && (
                                <div>
                                        <StreakCelebration
                                                streakCount={userStats.streakCount}
                                                onStreakMilestone={onStreakMilestone}
                                        />
                                </div>
                        )}

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-8">
                                        {/* Mood Tracker */}
                                        <div>
                                                <MoodTracker onMoodLogged={onMoodLogged} />
                                        </div>

                                        {/* Mood History */}
                                        <div>
                                                <MoodHistory />
                                        </div>

                                        {/* Mood Chart */}
                                        <div>
                                                <MoodChart />
                                        </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-8">
                                        {/* Achievement System */}
                                        <div>
                                                <AchievementSystem
                                                        userStats={userStats}
                                                        onAchievementUnlocked={onAchievementUnlocked}
                                                />
                                        </div>

                                        {/* Weekly Goal */}
                                        <div>
                                                <ProgressCelebration
                                                        totalMoodLogs={userStats?.totalMoodLogs || 0}
                                                        averageMood={userStats?.averageMood || 0}
                                                        streakCount={userStats?.streakCount || 0}
                                                />
                                        </div>

                                        {/* Progress Insight */}
                                        <div>
                                                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                                        <CardContent className="p-6">
                                                                <div className="flex items-center space-x-2 mb-4">
                                                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                                                        <h3 className="font-semibold text-blue-800">
                                                                                Progress Insight
                                                                        </h3>
                                                                </div>
                                                                <div className="space-y-4">
                                                                        <div className="flex items-center justify-between">
                                                                                <span className="text-sm text-blue-600">
                                                                                        Mood Consistency
                                                                                </span>
                                                                                <span className="text-sm font-medium text-blue-800">
                                                                                        {userStats?.totalMoodLogs &&
                                                                                        userStats.totalMoodLogs > 0
                                                                                                ? 'Good'
                                                                                                : 'Getting Started'}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                                <span className="text-sm text-blue-600">
                                                                                        Average Mood
                                                                                </span>
                                                                                <span className="text-sm font-medium text-blue-800">
                                                                                        {userStats?.averageMood
                                                                                                ? userStats.averageMood.toFixed(
                                                                                                          1,
                                                                                                  )
                                                                                                : 'N/A'}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                                <span className="text-sm text-blue-600">
                                                                                        Current Streak
                                                                                </span>
                                                                                <span className="text-sm font-medium text-blue-800">
                                                                                        {userStats?.streakCount || 0}{' '}
                                                                                        days
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
