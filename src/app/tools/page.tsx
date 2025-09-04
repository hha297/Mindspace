import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { BreathingExercise } from '@/components/breathing-exercise';
import { JournalingTool } from '@/components/journaling-tool';
import { SelfAssessmentQuiz } from '@/components/self-assessment-quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, PenTool, ClipboardList, Heart } from 'lucide-react';

export default function ToolsPage() {
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

                                <Tabs defaultValue="breathing" className="space-y-8">
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
                                                                Additional Tools
                                                        </h2>
                                                        <p className="text-muted-foreground max-w-2xl mx-auto">
                                                                More self-help tools and resources to support your
                                                                mental health journey.
                                                        </p>
                                                </div>

                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                                                <CardHeader>
                                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                                                <Heart className="h-6 w-6 text-primary" />
                                                                        </div>
                                                                        <CardTitle>Gratitude Practice</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <CardDescription>
                                                                                Daily gratitude exercises to improve
                                                                                mood and overall well-being.
                                                                        </CardDescription>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                                                <CardHeader>
                                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                                                <Activity className="h-6 w-6 text-primary" />
                                                                        </div>
                                                                        <CardTitle>
                                                                                Progressive Muscle Relaxation
                                                                        </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <CardDescription>
                                                                                Guided exercises to release physical
                                                                                tension and promote relaxation.
                                                                        </CardDescription>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                                                <CardHeader>
                                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                                                <ClipboardList className="h-6 w-6 text-primary" />
                                                                        </div>
                                                                        <CardTitle>Thought Challenging</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                        <CardDescription>
                                                                                Cognitive behavioral techniques to
                                                                                identify and challenge negative thought
                                                                                patterns.
                                                                        </CardDescription>
                                                                </CardContent>
                                                        </Card>
                                                </div>

                                                <div className="text-center">
                                                        <p className="text-muted-foreground mb-4">
                                                                More tools coming soon!
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                                Have a suggestion for a tool you&apos;d like to see? Let
                                                                us know through our feedback form.
                                                        </p>
                                                </div>
                                        </TabsContent>
                                </Tabs>
                        </main>
                </div>
        );
}
