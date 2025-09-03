'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Video, Activity, PenTool, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Resource {
        _id: string;
        title: string;
        description: string;
        content: string;
        category: string;
        type: string;
        duration?: number;
        url?: string;
        tags: string[];
        featured: boolean;
        createdAt: string;
        updatedAt: string;
}

export default function ResourceDetailPage() {
        const params = useParams();
        const resourceId = params.id as string;
        const [resource, setResource] = useState<Resource | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        const fetchResource = useCallback(async () => {
                try {
                        setIsLoading(true);
                        const response = await fetch(`/api/resources/${resourceId}`);

                        if (response.ok) {
                                const data = await response.json();
                                setResource(data.resource);
                        } else {
                                toast.error('Resource not found');
                        }
                } catch (error) {
                        console.error('Error fetching resource:', error);
                        toast.error('Failed to load resource');
                } finally {
                        setIsLoading(false);
                }
        }, [resourceId]);

        useEffect(() => {
                if (resourceId) {
                        fetchResource();
                }
        }, [fetchResource, resourceId]);

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

        const formatDate = (dateString: string) => {
                return new Date(dateString).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                });
        };

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <EmergencyBanner />
                                        <div className="mb-8">
                                                <Skeleton className="h-8 w-64 mb-4" />
                                                <Skeleton className="h-4 w-96" />
                                        </div>
                                        <Card>
                                                <CardHeader>
                                                        <Skeleton className="h-6 w-48 mb-2" />
                                                        <Skeleton className="h-4 w-32" />
                                                </CardHeader>
                                                <CardContent>
                                                        <Skeleton className="h-4 w-full mb-4" />
                                                        <Skeleton className="h-4 w-3/4 mb-4" />
                                                        <Skeleton className="h-4 w-5/6" />
                                                </CardContent>
                                        </Card>
                                </main>
                        </div>
                );
        }

        if (!resource) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                        <EmergencyBanner />
                                        <div className="text-center py-12">
                                                <h1 className="text-2xl font-bold text-foreground mb-4">
                                                        Resource Not Found
                                                </h1>
                                                <p className="text-muted-foreground mb-6">
                                                        The resource you&apos;re looking for doesn&apos;t exist or has
                                                        been removed.
                                                </p>
                                                <Button onClick={() => window.history.back()}>
                                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                                        Go Back
                                                </Button>
                                        </div>
                                </main>
                        </div>
                );
        }

        const IconComponent = getTypeIcon(resource.type);

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />

                                {/* Back Button */}
                                <div className="mb-6">
                                        <Button
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="mb-4"
                                        >
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back to Resources
                                        </Button>
                                </div>

                                {/* Resource Header */}
                                <div className="mb-8">
                                        <div className="flex items-center space-x-3 mb-4">
                                                <div className="bg-primary/10 p-3 rounded-lg">
                                                        <IconComponent className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                        <Badge variant="outline" className="mb-2">
                                                                {resource.category}
                                                        </Badge>
                                                        <h1 className="text-3xl font-bold text-foreground">
                                                                {resource.title}
                                                        </h1>
                                                </div>
                                        </div>
                                        <p className="text-lg text-muted-foreground max-w-3xl">
                                                {resource.description}
                                        </p>
                                </div>

                                {/* Resource Details */}
                                <Card className="mb-8">
                                        <CardHeader>
                                                <CardTitle>Resource Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                        Type
                                                                </h3>
                                                                <div className="flex items-center space-x-2">
                                                                        <IconComponent className="h-4 w-4" />
                                                                        <span className="capitalize">
                                                                                {resource.type}
                                                                        </span>
                                                                </div>
                                                        </div>
                                                        <div>
                                                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                        Duration
                                                                </h3>
                                                                <div className="flex items-center space-x-2">
                                                                        <Clock className="h-4 w-4" />
                                                                        <span>{resource.duration || 5} minutes</span>
                                                                </div>
                                                        </div>
                                                        <div>
                                                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                        Category
                                                                </h3>
                                                                <Badge variant="outline">{resource.category}</Badge>
                                                        </div>
                                                        <div>
                                                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                        Created
                                                                </h3>
                                                                <span>{formatDate(resource.createdAt)}</span>
                                                        </div>
                                                </div>

                                                {resource.tags && resource.tags.length > 0 && (
                                                        <div className="mt-6">
                                                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                                                                        Tags
                                                                </h3>
                                                                <div className="flex flex-wrap gap-2">
                                                                        {resource.tags.map((tag, index) => (
                                                                                <Badge key={index} variant="secondary">
                                                                                        {tag}
                                                                                </Badge>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                )}
                                        </CardContent>
                                </Card>

                                {/* Resource Content */}
                                <Card className="mb-8">
                                        <CardHeader>
                                                <CardTitle>Content</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="prose prose-gray max-w-none">
                                                        {resource.content ? (
                                                                <div className="whitespace-pre-wrap text-foreground">
                                                                        {resource.content}
                                                                </div>
                                                        ) : (
                                                                <p className="text-muted-foreground">
                                                                        No detailed content available for this resource.
                                                                </p>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>

                                {/* External Link */}
                                {resource.url && (
                                        <Card className="mb-8">
                                                <CardHeader>
                                                        <CardTitle>External Resource</CardTitle>
                                                        <CardDescription>
                                                                This resource has additional content available
                                                                externally.
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <Button
                                                                onClick={() => window.open(resource.url, '_blank')}
                                                                className="w-full md:w-auto"
                                                        >
                                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                                Visit External Resource
                                                        </Button>
                                                </CardContent>
                                        </Card>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="flex-1"
                                        >
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back to Resources
                                        </Button>
                                        {resource.url && (
                                                <Button
                                                        onClick={() => window.open(resource.url, '_blank')}
                                                        className="flex-1"
                                                >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Access Resource
                                                </Button>
                                        )}
                                </div>
                        </main>
                </div>
        );
}
