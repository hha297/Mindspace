'use client';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Activity, PenTool, ClipboardList, BookOpen } from 'lucide-react';

export function SelfHelpTools() {
        return (
                <div className="mt-8">
                        <div className="flex items-center space-x-2 mb-6">
                                <div className="p-1 bg-green-100 rounded">
                                        <Activity className="h-4 w-4 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Self-Help Tools</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Breathing Exercise Card */}
                                <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow">
                                        <CardContent className="p-6 text-center">
                                                <div className="mb-4">
                                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                <Activity className="h-6 w-6 text-green-600" />
                                                        </div>
                                                        <CardTitle className="text-green-800 font-bold text-lg">
                                                                Breathing Exercise
                                                        </CardTitle>
                                                        <CardDescription className="text-green-600 mt-2">
                                                                Take 5 minutes to calm your mind
                                                        </CardDescription>
                                                </div>
                                                <Link href="/tools">
                                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                                                Start Exercise
                                                        </Button>
                                                </Link>
                                        </CardContent>
                                </Card>

                                {/* Journal Writing Card */}
                                <Card className="bg-purple-50 border-purple-200 hover:shadow-md transition-shadow">
                                        <CardContent className="p-6 text-center">
                                                <div className="mb-4">
                                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                <PenTool className="h-6 w-6 text-purple-600" />
                                                        </div>
                                                        <CardTitle className="text-purple-800 font-bold text-lg">
                                                                Journal Writing
                                                        </CardTitle>
                                                        <CardDescription className="text-purple-600 mt-2">
                                                                Express your thoughts and feelings
                                                        </CardDescription>
                                                </div>
                                                <Link href="/tools">
                                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                                                Start Writing
                                                        </Button>
                                                </Link>
                                        </CardContent>
                                </Card>

                                {/* Self-Assessment Card */}
                                <Card className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow">
                                        <CardContent className="p-6 text-center">
                                                <div className="mb-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                <ClipboardList className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <CardTitle className="text-blue-800 font-bold text-lg">
                                                                Self-Assessment
                                                        </CardTitle>
                                                        <CardDescription className="text-blue-600 mt-2">
                                                                Check in with your mental health
                                                        </CardDescription>
                                                </div>
                                                <Link href="/tools">
                                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                                Take Assessment
                                                        </Button>
                                                </Link>
                                        </CardContent>
                                </Card>

                                {/* Browse Resources Card */}
                                <Card className="bg-orange-50 border-orange-200 hover:shadow-md transition-shadow">
                                        <CardContent className="p-6 text-center">
                                                <div className="mb-4">
                                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                <BookOpen className="h-6 w-6 text-orange-600" />
                                                        </div>
                                                        <CardTitle className="text-orange-800 font-bold text-lg">
                                                                Browse Resources
                                                        </CardTitle>
                                                        <CardDescription className="text-orange-600 mt-2">
                                                                Find helpful articles and tools
                                                        </CardDescription>
                                                </div>
                                                <Link href="/resources">
                                                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                                                Explore Resources
                                                        </Button>
                                                </Link>
                                        </CardContent>
                                </Card>
                        </div>
                </div>
        );
}
