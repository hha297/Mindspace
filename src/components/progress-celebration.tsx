'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Heart, Sparkles, HandHeartIcon } from 'lucide-react';

interface ProgressCelebrationProps {
        totalMoodLogs: number;
        averageMood: number;
        streakCount: number;
        weeklyGoal?: number;
}

export function ProgressCelebration({
        totalMoodLogs,
        averageMood,
        streakCount,
        weeklyGoal = 7,
}: ProgressCelebrationProps) {
        const [weeklyProgress, setWeeklyProgress] = useState(0);

        useEffect(() => {
                const progress = Math.min((streakCount / weeklyGoal) * 100, 100);
                setWeeklyProgress(progress);
        }, [streakCount, weeklyGoal]);

        const getMoodEmoji = (score: number) => {
                if (score >= 4.5) return '😄';
                if (score >= 3.5) return '😊';
                if (score >= 2.5) return '😐';
                if (score >= 1.5) return '😔';
                return '😢';
        };

        const getMoodColor = (score: number) => {
                if (score >= 4) return 'text-green-600';
                if (score >= 3) return 'text-yellow-600';
                if (score >= 2) return 'text-orange-600';
                return 'text-red-600';
        };

        const getProgressMessage = () => {
                if (weeklyProgress >= 100) return "Amazing! You've completed your weekly goal!";
                if (weeklyProgress >= 75) return "So close! You're almost there!";
                if (weeklyProgress >= 50) return 'Great progress! Keep it up!';
                if (weeklyProgress >= 25) return "Good start! You're on your way!";
                return 'Every journey begins with a single step!';
        };

        const getProgressColor = () => {
                if (weeklyProgress >= 100) return 'from-green-400 to-emerald-500';
                if (weeklyProgress >= 75) return 'from-blue-400 to-indigo-500';
                if (weeklyProgress >= 50) return 'from-yellow-400 to-orange-500';
                return 'from-gray-400 to-gray-500';
        };

        return (
                <div className="space-y-4">
                        {/* Weekly Progress */}
                        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                                <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-2">
                                                        <Target className="h-5 w-5 text-purple-600" />
                                                        <h3 className="font-semibold text-purple-800">
                                                                Weekly Goal Progress
                                                        </h3>
                                                </div>
                                                <Badge variant="outline" className="text-purple-600 border-purple-300">
                                                        {Math.round(weeklyProgress)}%
                                                </Badge>
                                        </div>

                                        <div className="space-y-2">
                                                <div className="flex justify-between text-sm text-purple-600">
                                                        <span>{getProgressMessage()}</span>
                                                        <span>
                                                                {streakCount} / {weeklyGoal} days
                                                        </span>
                                                </div>
                                                <div className="w-full bg-purple-200 rounded-full h-3">
                                                        <div
                                                                className={`bg-gradient-to-r ${getProgressColor()} h-3 rounded-full transition-all duration-500`}
                                                                style={{ width: `${weeklyProgress}%` }}
                                                        />
                                                </div>
                                        </div>

                                        {weeklyProgress >= 100 && (
                                                <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                                                        <div className="flex items-center space-x-2 text-green-700">
                                                                <Sparkles className="h-4 w-4" />
                                                                <span className="font-medium">
                                                                        Congratulations! Goal achieved!
                                                                </span>
                                                        </div>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>

                        {/* Mood Insights */}
                        <Card>
                                <CardContent className="p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-semibold text-blue-800">Your Progress Insights</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-blue-50 border border-blue-400 rounded-lg">
                                                        <div className="text-2xl mb-2">{getMoodEmoji(averageMood)}</div>
                                                        <div
                                                                className={`text-lg font-bold ${getMoodColor(
                                                                        averageMood,
                                                                )}`}
                                                        >
                                                                {averageMood.toFixed(1)}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                                Average Mood
                                                        </div>
                                                </div>

                                                <div className="text-center p-4 bg-green-50 border border-green-400 rounded-lg">
                                                        <div className="text-2xl mb-2">📊</div>
                                                        <div className="text-lg font-bold text-green-600">
                                                                {totalMoodLogs}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                                Total Entries
                                                        </div>
                                                </div>

                                                <div className="text-center p-4 bg-orange-50 border border-orange-400 rounded-lg">
                                                        <div className="text-2xl mb-2">🔥</div>
                                                        <div className="text-lg font-bold text-orange-600">
                                                                {streakCount}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                                Current Streak
                                                        </div>
                                                </div>
                                        </div>

                                        {averageMood >= 3 && (
                                                <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                                                        <div className="flex items-center space-x-2 text-green-700">
                                                                <Heart className="size-6" />
                                                                <span className="font-medium text-sm">
                                                                        You&apos;re doing great! Your mood trend is
                                                                        positive.
                                                                </span>
                                                        </div>
                                                </div>
                                        )}

                                        {averageMood < 3 && (
                                                <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                                                        <div className="flex items-center space-x-2 text-blue-700">
                                                                <HandHeartIcon className="size-6" />
                                                                <span className="font-medium text-sm">
                                                                        Remember, it&apos;s okay to have difficult days.
                                                                        Life challenges everyone, no matter how kind
                                                                        they are. Struggles don’t mean you’re not good
                                                                        enough.
                                                                </span>
                                                        </div>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>
                </div>
        );
}
