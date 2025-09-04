'use client';

import { MotivationalQuotes } from '@/components/motivational-quotes';

interface DashboardHeaderProps {
        userName?: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
        const getGreeting = () => {
                const hour = new Date().getHours();
                if (hour < 12) return 'Good morning';
                if (hour < 17) return 'Good afternoon';
                return 'Good evening';
        };

        return (
                <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                                {getGreeting()}, {userName || 'there'}!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                                Welcome to your personal mental health dashboard. How are you feeling today?
                        </p>

                        {/* Motivational Quote */}
                        <div className="mt-6">
                                <MotivationalQuotes />
                        </div>
                </div>
        );
}
