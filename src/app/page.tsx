'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Navbar } from '@/components/navbar';
import { Heart, BarChart3, BookOpen, Users, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
        const searchParams = useSearchParams();
        const { data: session } = useSession();

        useEffect(() => {
                const message = searchParams.get('message');
                if (message === 'already-signed-in') {
                        toast.info('You are already signed in!', {
                                description: 'Welcome back to MindSpace.',
                        });
                }
        }, [searchParams]);

        const handleSignUpClick = (e: React.MouseEvent) => {
                if (session) {
                        e.preventDefault();
                        toast.info('You are already signed in!', {
                                description: 'Welcome back to MindSpace.',
                        });
                        return;
                }
                // If not signed in, allow normal navigation to sign-up page
        };

        const features = [
                {
                        icon: BarChart3,
                        title: 'Mood Tracking',
                        description:
                                'Log your daily emotions and track patterns over time to better understand your mental health journey.',
                },
                {
                        icon: BookOpen,
                        title: 'Self-Help Resources',
                        description:
                                'Access curated articles, videos, and exercises designed specifically for student mental health needs.',
                },
                {
                        icon: Users,
                        title: 'Community Support',
                        description:
                                'Connect with others who understand your experiences in a safe, moderated environment.',
                },
                {
                        icon: Shield,
                        title: 'Privacy First',
                        description:
                                'Your mental health data is encrypted and private. You control what you share and with whom.',
                },
                {
                        icon: Sparkles,
                        title: 'Personalized Insights',
                        description:
                                'Get tailored recommendations and insights based on your mood patterns and preferences.',
                },
                {
                        icon: Heart,
                        title: 'Crisis Support',
                        description:
                                'Immediate access to crisis resources and professional support when you need it most.',
                },
        ];

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="py-8">
                                        <EmergencyBanner />

                                        {/* Hero Section */}
                                        <div className="text-center py-16">
                                                <div className="max-w-3xl mx-auto">
                                                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                                                                Your Mental Health{' '}
                                                                <span className="text-primary">Matters</span>
                                                        </h1>
                                                        <p className="text-xl text-muted-foreground mb-8 text-pretty">
                                                                MindSpace is a safe, supportive platform designed
                                                                specifically for students. Track your mood, access
                                                                helpful resources, and take control of your mental
                                                                well-being.
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                                <Button size="lg" asChild>
                                                                        <Link
                                                                                href="/dashboard"
                                                                                onClick={handleSignUpClick}
                                                                        >
                                                                                Get Started
                                                                        </Link>
                                                                </Button>
                                                                <Button size="lg" variant="outline" asChild>
                                                                        <Link href="/resources">Explore Resources</Link>
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Quick Help Section */}
                                        <div className="py-16 bg-muted rounded-2xl mb-16">
                                                <div className="max-w-4xl mx-auto px-6">
                                                        <h2 className="text-3xl font-bold text-center mb-8 text-balance">
                                                                Need Help Right Now?
                                                        </h2>
                                                        <div className="grid md:grid-cols-3 gap-6">
                                                                <Card className="text-center">
                                                                        <CardHeader>
                                                                                <CardTitle className="text-lg">
                                                                                        Feeling Overwhelmed?
                                                                                </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                                <p className="text-sm text-muted-foreground mb-4">
                                                                                        Try our 5-minute breathing
                                                                                        exercise to help calm your mind.
                                                                                </p>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        asChild
                                                                                >
                                                                                        <Link href="/tools">
                                                                                                Start Breathing Exercise
                                                                                        </Link>
                                                                                </Button>
                                                                        </CardContent>
                                                                </Card>

                                                                <Card className="text-center">
                                                                        <CardHeader>
                                                                                <CardTitle className="text-lg">
                                                                                        Need to Talk?
                                                                                </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                                <p className="text-sm text-muted-foreground mb-4">
                                                                                        Connect with trained counselors
                                                                                        who understand student life.
                                                                                </p>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        asChild
                                                                                >
                                                                                        <Link href="/resources">
                                                                                                Find Support
                                                                                        </Link>
                                                                                </Button>
                                                                        </CardContent>
                                                                </Card>

                                                                <Card className="text-center">
                                                                        <CardHeader>
                                                                                <CardTitle className="text-lg">
                                                                                        Track Your Mood
                                                                                </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                                <p className="text-sm text-muted-foreground mb-4">
                                                                                        Log how you&apos;re feeling
                                                                                        today and start building healthy
                                                                                        habits.
                                                                                </p>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        asChild
                                                                                >
                                                                                        <Link href="/dashboard">
                                                                                                Log Mood
                                                                                        </Link>
                                                                                </Button>
                                                                        </CardContent>
                                                                </Card>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Features Section */}
                                        <div className="py-16">
                                                <div className="text-center mb-12">
                                                        <h2 className="text-3xl font-bold mb-4 text-balance">
                                                                Everything You Need for Better Mental Health
                                                        </h2>
                                                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                                                                Our platform combines evidence-based tools with a
                                                                supportive community to help you thrive during your
                                                                academic journey.
                                                        </p>
                                                </div>

                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {features.map((feature, index) => (
                                                                <Card key={index} className="h-full">
                                                                        <CardHeader>
                                                                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                                                        <feature.icon className="h-6 w-6 text-primary" />
                                                                                </div>
                                                                                <CardTitle className="text-xl">
                                                                                        {feature.title}
                                                                                </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                                <CardDescription className="text-base">
                                                                                        {feature.description}
                                                                                </CardDescription>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* CTA Section */}
                                        <div className="py-16 text-center">
                                                <div className="max-w-2xl mx-auto">
                                                        <h2 className="text-3xl font-bold mb-4 text-balance">
                                                                Ready to Start Your Journey?
                                                        </h2>
                                                        <p className="text-lg text-muted-foreground mb-8 text-pretty">
                                                                Join thousands of students who are taking control of
                                                                their mental health with MindSpace.
                                                        </p>
                                                        <Button size="lg" asChild>
                                                                <Link href="/sign-up" onClick={handleSignUpClick}>
                                                                        Sign Up Free
                                                                </Link>
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
