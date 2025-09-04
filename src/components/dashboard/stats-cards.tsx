'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart, Flame, Trophy, BookOpen } from 'lucide-react';

interface UserStats {
        streakCount: number;
        badges: string[];
        totalMoodLogs: number;
        averageMood: number;
}

interface StatsCardsProps {
        userStats: UserStats | null;
}

export function StatsCards({ userStats }: StatsCardsProps) {
        const getMoodEmoji = (score: number) => {
                if (score >= 4.5) return '😄';
                if (score >= 3.5) return '😊';
                if (score >= 2.5) return '😐';
                if (score >= 1.5) return '😔';
                return '😢';
        };

        return (
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
                                                {userStats?.averageMood ? getMoodEmoji(userStats.averageMood) : '😊'}
                                        </div>
                                        <div className="text-sm text-pink-600">Average Mood</div>
                                </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                <CardContent className="p-4 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                                <BookOpen className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">
                                                {userStats?.totalMoodLogs || 0}
                                        </div>
                                        <div className="text-sm text-blue-600">Mood Logs</div>
                                </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                                <CardContent className="p-4 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                                <Trophy className="h-6 w-6 text-yellow-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-yellow-600">
                                                {userStats?.badges?.length || 0}
                                        </div>
                                        <div className="text-sm text-yellow-600">Achievements</div>
                                </CardContent>
                        </Card>
                </div>
        );
}
