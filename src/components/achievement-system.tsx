'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Star, Heart, Flame, BookOpen, Calendar, Award, Sparkles } from 'lucide-react';

interface Achievement {
        id: string;
        title: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
        category: 'streak' | 'mood' | 'tools' | 'engagement';
        requirement: number;
        currentProgress: number;
        isUnlocked: boolean;
        unlockedAt?: string;
        color: string;
}

interface AchievementSystemProps {
        userStats: {
                streakCount: number;
                totalMoodLogs: number;
                badges: string[];
        };
        onAchievementUnlocked?: (achievement: Achievement) => void;
}

const achievementDefinitions: Omit<Achievement, 'currentProgress' | 'isUnlocked' | 'unlockedAt'>[] = [
        {
                id: 'first-mood',
                title: 'First Step',
                description: 'Log your first mood entry',
                icon: Heart,
                category: 'mood',
                requirement: 1,
                color: 'bg-pink-100 text-pink-800',
        },
        {
                id: 'mood-week',
                title: 'Week Warrior',
                description: 'Log moods for 7 days',
                icon: Calendar,
                category: 'mood',
                requirement: 7,
                color: 'bg-blue-100 text-blue-800',
        },
        {
                id: 'mood-month',
                title: 'Monthly Master',
                description: 'Log moods for 30 days',
                icon: Star,
                category: 'mood',
                requirement: 30,
                color: 'bg-purple-100 text-purple-800',
        },
        {
                id: 'streak-3',
                title: 'Getting Started',
                description: 'Maintain a 3-day streak',
                icon: Flame,
                category: 'streak',
                requirement: 3,
                color: 'bg-orange-100 text-orange-800',
        },
        {
                id: 'streak-7',
                title: 'Week Champion',
                description: 'Maintain a 7-day streak',
                icon: Trophy,
                category: 'streak',
                requirement: 7,
                color: 'bg-yellow-100 text-yellow-800',
        },
        {
                id: 'streak-30',
                title: 'Consistency King',
                description: 'Maintain a 30-day streak',
                icon: Award,
                category: 'streak',
                requirement: 30,
                color: 'bg-emerald-100 text-emerald-800',
        },
        {
                id: 'self-care',
                title: 'Self-Care Advocate',
                description: 'Use 5 different self-help tools',
                icon: Sparkles,
                category: 'tools',
                requirement: 5,
                color: 'bg-indigo-100 text-indigo-800',
        },
        {
                id: 'explorer',
                title: 'Resource Explorer',
                description: 'Browse mental health resources',
                icon: BookOpen,
                category: 'engagement',
                requirement: 1,
                color: 'bg-green-100 text-green-800',
        },
];

export function AchievementSystem({ userStats, onAchievementUnlocked }: AchievementSystemProps) {
        const [achievements, setAchievements] = useState<Achievement[]>([]);
        const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
        const [showCelebration, setShowCelebration] = useState(false);

        // Get viewed achievements from localStorage
        const getViewedAchievements = (): string[] => {
                if (typeof window === 'undefined') return [];
                const viewed = localStorage.getItem('viewedAchievements');
                return viewed ? JSON.parse(viewed) : [];
        };

        // Save viewed achievement to localStorage
        const markAchievementAsViewed = useCallback((achievementId: string) => {
                if (typeof window === 'undefined') return;
                const viewed = getViewedAchievements();
                if (!viewed.includes(achievementId)) {
                        viewed.push(achievementId);
                        localStorage.setItem('viewedAchievements', JSON.stringify(viewed));
                }
        }, []);

        // Save achievement to database
        const saveAchievementToDatabase = async (achievementId: string) => {
                try {
                        await fetch('/api/user/achievements', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        achievementId: achievementId,
                                }),
                        });
                } catch (error) {
                        console.error('Failed to save achievement:', error);
                }
        };

        const updateAchievements = useCallback(() => {
                const updatedAchievements = achievementDefinitions.map((def) => {
                        let currentProgress = 0;
                        let isUnlocked = false;

                        switch (def.category) {
                                case 'mood':
                                        currentProgress = userStats.totalMoodLogs;
                                        isUnlocked = userStats.totalMoodLogs >= def.requirement;
                                        break;
                                case 'streak':
                                        currentProgress = userStats.streakCount;
                                        isUnlocked = userStats.streakCount >= def.requirement;
                                        break;
                                case 'tools':
                                        // For demo, assume some tools usage
                                        currentProgress = Math.min(
                                                def.requirement,
                                                Math.floor(userStats.totalMoodLogs / 3),
                                        );
                                        isUnlocked = currentProgress >= def.requirement;
                                        break;
                                case 'engagement':
                                        // For demo, assume engagement based on mood logs
                                        currentProgress = userStats.totalMoodLogs > 0 ? 1 : 0;
                                        isUnlocked = currentProgress >= def.requirement;
                                        break;
                        }

                        const wasUnlocked = userStats.badges.includes(def.id);
                        const viewedAchievements = getViewedAchievements();
                        const justUnlocked = isUnlocked && !wasUnlocked && !viewedAchievements.includes(def.id);

                        if (justUnlocked) {
                                const newAchievement: Achievement = {
                                        ...def,
                                        currentProgress,
                                        isUnlocked,
                                        unlockedAt: new Date().toISOString(),
                                };
                                setNewAchievement(newAchievement);
                                setShowCelebration(true);
                                onAchievementUnlocked?.(newAchievement);
                                markAchievementAsViewed(def.id);
                                saveAchievementToDatabase(def.id);
                        }

                        return {
                                ...def,
                                currentProgress,
                                isUnlocked: wasUnlocked || isUnlocked,
                                unlockedAt: wasUnlocked ? new Date().toISOString() : undefined,
                        };
                });

                setAchievements(updatedAchievements);
        }, [
                userStats.badges,
                userStats.totalMoodLogs,
                userStats.streakCount,
                onAchievementUnlocked,
                markAchievementAsViewed,
        ]);

        useEffect(() => {
                updateAchievements();
        }, [updateAchievements, userStats]);

        const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
        const inProgressAchievements = achievements.filter((a) => !a.isUnlocked && a.currentProgress > 0);
        const lockedAchievements = achievements.filter((a) => !a.isUnlocked && a.currentProgress === 0);

        return (
                <>
                        <Card>
                                <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                                <Trophy className="h-5 w-5 text-yellow-500" />
                                                <span>Achievements</span>
                                        </CardTitle>
                                        <CardDescription>
                                                Track your progress and unlock badges for your mental health journey
                                        </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                        {/* Progress Summary */}
                                        <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-white border border-primary/50 rounded-lg">
                                                        <div className="text-2xl font-bold text-primary">
                                                                {unlockedAchievements.length}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">Unlocked</div>
                                                </div>
                                                <div className="text-center p-4 bg-white border border-primary/50 rounded-lg">
                                                        <div className="text-2xl font-bold text-orange-500">
                                                                {inProgressAchievements.length}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">In Progress</div>
                                                </div>
                                        </div>

                                        {/* Unlocked Achievements */}
                                        {unlockedAchievements.length > 0 && (
                                                <div>
                                                        <h3 className="font-semibold mb-3 text-green-700">
                                                                Unlocked Achievements
                                                        </h3>
                                                        <div className="grid gap-3">
                                                                {unlockedAchievements.map((achievement) => {
                                                                        const IconComponent = achievement.icon;
                                                                        return (
                                                                                <div
                                                                                        key={achievement.id}
                                                                                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-primary/50"
                                                                                >
                                                                                        <div className="bg-primary/10 p-2 rounded-full">
                                                                                                <IconComponent className="h-5 w-5 text-green-600" />
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                                <div className="font-medium text-foreground">
                                                                                                        {
                                                                                                                achievement.title
                                                                                                        }
                                                                                                </div>
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                        {
                                                                                                                achievement.description
                                                                                                        }
                                                                                                </div>
                                                                                        </div>
                                                                                        <Badge className="bg-primary/10 text-primary">
                                                                                                Unlocked
                                                                                        </Badge>
                                                                                </div>
                                                                        );
                                                                })}
                                                        </div>
                                                </div>
                                        )}

                                        {/* In Progress Achievements */}
                                        {inProgressAchievements.length > 0 && (
                                                <div>
                                                        <h3 className="font-semibold mb-3 text-orange-700">
                                                                In Progress
                                                        </h3>
                                                        <div className="grid gap-3">
                                                                {inProgressAchievements.map((achievement) => {
                                                                        const IconComponent = achievement.icon;
                                                                        const progress =
                                                                                (achievement.currentProgress /
                                                                                        achievement.requirement) *
                                                                                100;
                                                                        return (
                                                                                <div
                                                                                        key={achievement.id}
                                                                                        className="p-3 bg-white border border-primary/50 rounded-lg"
                                                                                >
                                                                                        <div className="flex items-center space-x-3 mb-2">
                                                                                                <div className="bg-primary/10 p-2 rounded-full">
                                                                                                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                                                                                                </div>
                                                                                                <div className="flex-1">
                                                                                                        <div className="font-medium">
                                                                                                                {
                                                                                                                        achievement.title
                                                                                                                }
                                                                                                        </div>
                                                                                                        <div className="text-sm text-muted-foreground">
                                                                                                                {
                                                                                                                        achievement.description
                                                                                                                }
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                        <div className="space-y-1">
                                                                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                                                                        <span>
                                                                                                                {
                                                                                                                        achievement.currentProgress
                                                                                                                }{' '}
                                                                                                                /{' '}
                                                                                                                {
                                                                                                                        achievement.requirement
                                                                                                                }
                                                                                                        </span>
                                                                                                        <span>
                                                                                                                {Math.round(
                                                                                                                        progress,
                                                                                                                )}
                                                                                                                %
                                                                                                        </span>
                                                                                                </div>
                                                                                                <Progress
                                                                                                        value={progress}
                                                                                                        className="h-2"
                                                                                                />
                                                                                        </div>
                                                                                </div>
                                                                        );
                                                                })}
                                                        </div>
                                                </div>
                                        )}

                                        {/* Locked Achievements */}
                                        {lockedAchievements.length > 0 && (
                                                <div>
                                                        <h3 className="font-semibold mb-3 text-muted-foreground">
                                                                Locked
                                                        </h3>
                                                        <div className="grid gap-3">
                                                                {lockedAchievements.slice(0, 3).map((achievement) => {
                                                                        const IconComponent = achievement.icon;
                                                                        return (
                                                                                <div
                                                                                        key={achievement.id}
                                                                                        className="flex items-center space-x-3 p-3 bg-white border border-primary/50 rounded-lg opacity-60"
                                                                                >
                                                                                        <div className="bg-primary/10 p-2 rounded-full">
                                                                                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                                <div className="font-medium text-muted-foreground">
                                                                                                        {
                                                                                                                achievement.title
                                                                                                        }
                                                                                                </div>
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                        {
                                                                                                                achievement.description
                                                                                                        }
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        );
                                                                })}
                                                        </div>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>

                        {/* Achievement Celebration Dialog */}
                        <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
                                <DialogContent className="text-center">
                                        <DialogHeader>
                                                <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <Trophy className="h-8 w-8 text-yellow-600" />
                                                </div>
                                                <DialogTitle className="text-2xl">Achievement Unlocked!</DialogTitle>
                                                <DialogDescription className="text-lg">
                                                        {newAchievement && (
                                                                <>
                                                                        <span className="font-semibold text-foreground block">
                                                                                {newAchievement.title}
                                                                        </span>
                                                                        <span className="block">
                                                                                {newAchievement.description}
                                                                        </span>
                                                                </>
                                                        )}
                                                </DialogDescription>
                                        </DialogHeader>
                                        <div className="pt-4">
                                                <Button
                                                        onClick={() => setShowCelebration(false)}
                                                        className="bg-yellow-500 hover:bg-yellow-600"
                                                >
                                                        Awesome!
                                                </Button>
                                        </div>
                                </DialogContent>
                        </Dialog>
                </>
        );
}
