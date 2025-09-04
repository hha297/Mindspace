'use client';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

import { Activity, PenTool, ClipboardList, Sparkles } from 'lucide-react';

export function QuickActions() {
        return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Activity className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                        <CardTitle className="text-sm">Track Mood</CardTitle>
                                                        <CardDescription className="text-xs">
                                                                Log your current mood
                                                        </CardDescription>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                        <PenTool className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                        <CardTitle className="text-sm">Journal</CardTitle>
                                                        <CardDescription className="text-xs">
                                                                Write your thoughts
                                                        </CardDescription>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                        <ClipboardList className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                        <CardTitle className="text-sm">Resources</CardTitle>
                                                        <CardDescription className="text-xs">
                                                                Find helpful content
                                                        </CardDescription>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-yellow-100 rounded-lg">
                                                        <Sparkles className="h-5 w-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                        <CardTitle className="text-sm">Chat</CardTitle>
                                                        <CardDescription className="text-xs">
                                                                Talk to AI assistant
                                                        </CardDescription>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        );
}
