'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Activity, PenTool, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface Resource {
        _id: string;
        title: string;
        description: string;
        type: 'article' | 'video' | 'exercise' | 'tool';
        category: string;
        duration?: string;
        views?: number;
        url?: string;
        featured?: boolean;
}

interface ResourceCardProps {
        resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
        const getTypeIcon = (type: string) => {
                switch (type) {
                        case 'article':
                                return BookOpen;
                        case 'video':
                                return Video;
                        case 'exercise':
                                return Activity;
                        case 'tool':
                                return PenTool;
                        default:
                                return BookOpen;
                }
        };

        const getTypeColor = (type: string) => {
                switch (type) {
                        case 'article':
                                return 'bg-blue-100 text-blue-800';
                        case 'video':
                                return 'bg-red-100 text-red-800';
                        case 'exercise':
                                return 'bg-green-100 text-green-800';
                        case 'tool':
                                return 'bg-purple-100 text-purple-800';
                        default:
                                return 'bg-gray-100 text-gray-800';
                }
        };

        const TypeIcon = getTypeIcon(resource.type);

        return (
                <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                                <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                                                <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={getTypeColor(resource.type)}>
                                                                <TypeIcon className="h-3 w-3 mr-1" />
                                                                {resource.type.charAt(0).toUpperCase() +
                                                                        resource.type.slice(1)}
                                                        </Badge>
                                                        <Badge variant="outline">{resource.category}</Badge>
                                                        {resource.featured && (
                                                                <Badge variant="default" className="bg-yellow-500">
                                                                        Featured
                                                                </Badge>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                        </CardHeader>
                        <CardContent>
                                <CardDescription className="mb-4">{resource.description}</CardDescription>
                                <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                {resource.duration && (
                                                        <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {resource.duration} minutes
                                                        </div>
                                                )}
                                                {resource.views && (
                                                        <div className="flex items-center gap-1">
                                                                <Users className="h-4 w-4" />
                                                                {resource.views} views
                                                        </div>
                                                )}
                                        </div>
                                        <Button asChild>
                                                <Link href={`/resources/${resource._id}`}>View Resource</Link>
                                        </Button>
                                </div>
                        </CardContent>
                </Card>
        );
}
