'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { BreathingExercise } from '@/components/breathing-exercise';
import { JournalingTool } from '@/components/journaling-tool';
import { SelfAssessmentQuiz } from '@/components/self-assessment-quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Activity, PenTool, ClipboardList, Heart } from 'lucide-react';

function ToolsPageContent() {
        const router = useRouter();
        const searchParams = useSearchParams();
        const [activeTab, setActiveTab] = useState('breathing');

        // Get initial tab from URL params and sync URL if needed
        useEffect(() => {
                const tabParam = searchParams.get('tab');
                if (tabParam && ['breathing', 'journaling', 'assessment', 'more'].includes(tabParam)) {
                        setActiveTab(tabParam);
                } else {
                        // If no tab param, set default and update URL
                        const params = new URLSearchParams(searchParams);
                        params.set('tab', 'breathing');
                        router.replace(`/tools?${params.toString()}`, { scroll: false });
                }
        }, [searchParams, router]);

        // Update URL when tab changes
        const handleTabChange = (value: string) => {
                setActiveTab(value);
                const params = new URLSearchParams(searchParams);
                params.set('tab', value);
                router.push(`/tools?${params.toString()}`, { scroll: false });
        };

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />

                                <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-foreground mb-4">Self-Help Tools</h1>
                                        <p className="text-lg text-muted-foreground max-w-3xl">
                                                Explore interactive tools designed to support your mental health
                                                journey. These evidence-based techniques can help you manage stress,
                                                process emotions, and build resilience.
                                        </p>
                                </div>

                                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                                        <TabsList className="grid w-full grid-cols-4">
                                                <TabsTrigger
                                                        value="breathing"
                                                        className="flex items-center space-x-2  cursor-pointer"
                                                >
                                                        <Activity className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Breathing</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                        value="journaling"
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                        <PenTool className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Journaling</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                        value="assessment"
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                        <ClipboardList className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Assessment</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                        value="more"
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                        <Heart className="h-4 w-4" />
                                                        <span className="hidden sm:inline">More Tools</span>
                                                </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="breathing" className="space-y-6">
                                                <div className="text-center mb-8">
                                                        <h2 className="text-2xl font-semibold mb-4">
                                                                Breathing Exercises
                                                        </h2>
                                                        <p className="text-muted-foreground max-w-2xl mx-auto">
                                                                Guided breathing exercises can help reduce anxiety,
                                                                lower stress, and improve focus. Choose from different
                                                                techniques based on your needs and experience level.
                                                        </p>
                                                </div>
                                                <BreathingExercise />
                                        </TabsContent>

                                        <TabsContent value="journaling" className="space-y-6">
                                                <div className="text-center mb-8">
                                                        <h2 className="text-2xl font-semibold mb-4">
                                                                Digital Journaling
                                                        </h2>
                                                        <p className="text-muted-foreground max-w-2xl mx-auto">
                                                                Writing about your thoughts and feelings can help
                                                                process emotions, reduce stress, and gain clarity. Use
                                                                our prompts or write freely about whatever is on your
                                                                mind.
                                                        </p>
                                                </div>
                                                <JournalingTool />
                                        </TabsContent>

                                        <TabsContent value="assessment" className="space-y-6">
                                                <div className="text-center mb-8">
                                                        <h2 className="text-2xl font-semibold mb-4">
                                                                Self-Assessment Tools
                                                        </h2>
                                                        <p className="text-muted-foreground max-w-2xl mx-auto">
                                                                These brief assessments can help you understand your
                                                                current mental health status and identify areas where
                                                                you might benefit from additional support.
                                                        </p>
                                                </div>
                                                <SelfAssessmentQuiz />
                                        </TabsContent>

                                        <TabsContent value="more" className="space-y-6">
                                                <div className="text-center mb-8">
                                                        <h2 className="text-2xl font-semibold mb-4">
                                                                More Self-Help Tools
                                                        </h2>
                                                        <p className="text-muted-foreground max-w-2xl mx-auto">
                                                                Additional tools and resources to support your mental
                                                                health journey. More features coming soon!
                                                        </p>
                                                </div>
                                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                                        <Card className="p-6 text-center">
                                                                <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                                                                <h3 className="text-lg font-semibold mb-2">
                                                                        Mood Tracking
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground mb-4">
                                                                        Track your daily mood and identify patterns
                                                                </p>
                                                                <div className="text-xs text-muted-foreground">
                                                                        Coming Soon
                                                                </div>
                                                        </Card>
                                                        <Card className="p-6 text-center">
                                                                <Activity className="h-12 w-12 mx-auto mb-4 text-primary" />
                                                                <h3 className="text-lg font-semibold mb-2">
                                                                        Meditation Timer
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground mb-4">
                                                                        Guided meditation sessions with timer
                                                                </p>
                                                                <div className="text-xs text-muted-foreground">
                                                                        Coming Soon
                                                                </div>
                                                        </Card>
                                                        <Card className="p-6 text-center">
                                                                <PenTool className="h-12 w-12 mx-auto mb-4 text-primary" />
                                                                <h3 className="text-lg font-semibold mb-2">
                                                                        Goal Setting
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground mb-4">
                                                                        Set and track mental health goals
                                                                </p>
                                                                <div className="text-xs text-muted-foreground">
                                                                        Coming Soon
                                                                </div>
                                                        </Card>
                                                </div>
                                        </TabsContent>
                                </Tabs>
                        </main>
                </div>
        );
}

export default function ToolsPage() {
        return (
                <Suspense
                        fallback={
                                <div className="min-h-screen bg-background">
                                        <Navbar />
                                        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                                                <div className="text-center">
                                                        <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                                        <p className="text-muted-foreground">Loading tools...</p>
                                                </div>
                                        </div>
                                </div>
                        }
                >
                        <ToolsPageContent />
                </Suspense>
        );
}
