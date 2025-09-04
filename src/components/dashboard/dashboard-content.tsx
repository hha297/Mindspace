/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MoodTracker } from '@/components/mood-tracker';
import { MoodHistory } from '@/components/mood-history';
import { MoodChart } from '@/components/mood-chart';
import { AchievementSystem } from '@/components/achievement-system';
import { StreakCelebration } from '@/components/streak-celebration';
import { ProgressCelebration } from '@/components/progress-celebration';

import { SelfHelpTools } from '@/components/dashboard/self-help-tools';

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
                                {/* Left Column - Full Width Mood Chart */}
                                <div className="lg:col-span-2">
                                        <MoodChart />
                                </div>

                                {/* Left Column */}
                                <div className="space-y-8">
                                        {/* Mood Tracker */}
                                        <div>
                                                <MoodTracker onMoodLogged={onMoodLogged} />
                                        </div>

                                        {/* Mood History - Hidden on PC, shown on mobile */}
                                        <div className="lg:hidden">
                                                <MoodHistory />
                                        </div>

                                        {/* Achievement System - Shown on PC in left column */}
                                        <div className="hidden lg:block">
                                                <AchievementSystem
                                                        userStats={userStats}
                                                        onAchievementUnlocked={onAchievementUnlocked}
                                                />
                                        </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-8">
                                        {/* Achievement System - Hidden on PC, shown on mobile */}
                                        <div className="lg:hidden">
                                                <AchievementSystem
                                                        userStats={userStats}
                                                        onAchievementUnlocked={onAchievementUnlocked}
                                                />
                                        </div>

                                        {/* Mood History - Shown on PC in right column */}
                                        <div className="hidden lg:block">
                                                <MoodHistory />
                                        </div>

                                        {/* Weekly Goal */}
                                        <div>
                                                <ProgressCelebration
                                                        totalMoodLogs={userStats?.totalMoodLogs || 0}
                                                        averageMood={userStats?.averageMood || 0}
                                                        streakCount={userStats?.streakCount || 0}
                                                />
                                        </div>
                                        {/* Self-Help Tools - Shown on PC in right column */}
                                        <div className="hidden lg:block">
                                                <SelfHelpTools />
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
