/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Activity, PenTool as Tool, Clock, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResourcesPage() {
        const router = useRouter();
        const [resources, setResources] = useState<any[]>([]);
        const [featuredResources, setFeaturedResources] = useState<any[]>([]);
        const [categories, setCategories] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const itemsPerPage = 4;

        useEffect(() => {
                fetchResources();
        }, []);

        const fetchResources = async () => {
                try {
                        setIsLoading(true);

                        // Fetch all resources and featured resources
                        const [allResponse, featuredResponse] = await Promise.all([
                                fetch('/api/resources'),
                                fetch('/api/resources?featured=true'),
                        ]);

                        if (allResponse.ok && featuredResponse.ok) {
                                const allData = await allResponse.json();
                                const featuredData = await featuredResponse.json();

                                setResources(allData.resources || []);
                                setFeaturedResources(featuredData.resources || []);

                                // Calculate total pages for pagination
                                const totalItems = featuredData.resources?.length || 0;
                                setTotalPages(Math.ceil(totalItems / itemsPerPage));

                                // Calculate categories with counts
                                const categoryCounts: Record<string, number> = {};
                                allData.resources?.forEach((resource: any) => {
                                        categoryCounts[resource.category] =
                                                (categoryCounts[resource.category] || 0) + 1;
                                });

                                const categoryList = [
                                        { name: 'Stress Management', count: categoryCounts['Stress Management'] || 0 },
                                        { name: 'Anxiety Support', count: categoryCounts['Anxiety Support'] || 0 },
                                        { name: 'Depression Help', count: categoryCounts['Depression Help'] || 0 },
                                        { name: 'Self-Care', count: categoryCounts['Self-Care'] || 0 },
                                        { name: 'Academic Pressure', count: categoryCounts['Academic Pressure'] || 0 },
                                        { name: 'Relationships', count: categoryCounts['Relationships'] || 0 },
                                ];

                                setCategories(categoryList);
                        }
                } catch (error) {
                        console.error('Error fetching resources:', error);
                        toast.error('Failed to load resources');
                } finally {
                        setIsLoading(false);
                }
        };

        const seedResources = async () => {
                try {
                        const response = await fetch('/api/resources/seed', { method: 'POST' });
                        if (response.ok) {
                                toast.success('Sample resources loaded successfully!');
                                fetchResources(); // Refresh the data
                        } else {
                                toast.error('Failed to load sample resources');
                        }
                } catch (error) {
                        console.error('Error seeding resources:', error);
                        toast.error('Failed to load sample resources');
                }
        };

        const getTypeIcon = (type: string) => {
                switch (type) {
                        case 'article':
                                return BookOpen;
                        case 'video':
                                return Video;
                        case 'exercise':
                                return Activity;
                        case 'tool':
                                return Tool;
                        default:
                                return BookOpen;
                }
        };

        const handleResourceClick = (resourceId: string) => {
                router.push(`/resources/${resourceId}`);
        };

        const getCurrentPageResources = () => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                return featuredResources.slice(startIndex, endIndex);
        };

        const handlePageChange = (page: number) => {
                setCurrentPage(page);
        };

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />

                                <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-foreground mb-4">
                                                Mental Health Resources
                                        </h1>
                                        <p className="text-lg text-muted-foreground max-w-3xl">
                                                Explore our curated collection of evidence-based resources designed
                                                specifically for students. Find articles, videos, exercises, and tools
                                                to support your mental health journey.
                                        </p>
                                </div>

                                {/* Categories */}
                                <div className="mb-12">
                                        <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-2xl font-semibold">Browse by Category</h2>
                                                {isLoading && resources.length === 0 && (
                                                        <Button onClick={seedResources} variant="outline" size="sm">
                                                                <Loader2 className="h-4 w-4 mr-2" />
                                                                Load Sample Data
                                                        </Button>
                                                )}
                                        </div>
                                        {isLoading ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        {[...Array(6)].map((_, i) => (
                                                                <Card key={i} className="animate-pulse">
                                                                        <CardContent className="p-4 text-center">
                                                                                <div className="h-4 bg-muted rounded mb-2"></div>
                                                                                <div className="h-6 bg-muted rounded"></div>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        ) : (
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        {categories.map((category) => (
                                                                <Card
                                                                        key={category.name}
                                                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                                                >
                                                                        <CardContent className="p-4 text-center">
                                                                                <h3 className="font-medium text-sm mb-2">
                                                                                        {category.name}
                                                                                </h3>
                                                                                <Badge
                                                                                        variant="secondary"
                                                                                        className="text-xs"
                                                                                >
                                                                                        {category.count} resources
                                                                                </Badge>
                                                                        </CardContent>
                                                                </Card>
                                                        ))}
                                                </div>
                                        )}
                                </div>

                                {/* Featured Resources */}
                                <div className="mb-12">
                                        <h2 className="text-2xl font-semibold mb-6">Featured Resources</h2>
                                        {isLoading ? (
                                                <div className="text-center py-8">
                                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                                        <p className="text-muted-foreground">
                                                                Loading featured resources...
                                                        </p>
                                                </div>
                                        ) : featuredResources.length > 0 ? (
                                                <>
                                                        <div className="grid md:grid-cols-2 gap-6">
                                                                {getCurrentPageResources().map((resource, index) => {
                                                                        const IconComponent = getTypeIcon(
                                                                                resource.type,
                                                                        );
                                                                        return (
                                                                                <Card
                                                                                        key={index}
                                                                                        className="h-full hover:shadow-md transition-shadow"
                                                                                >
                                                                                        <CardHeader>
                                                                                                <div className="flex items-start justify-between">
                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                                                                                        <IconComponent className="h-5 w-5 text-primary" />
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                        <Badge
                                                                                                                                variant="outline"
                                                                                                                                className="text-xs mb-2"
                                                                                                                        >
                                                                                                                                {
                                                                                                                                        resource.category
                                                                                                                                }
                                                                                                                        </Badge>
                                                                                                                        <CardTitle className="text-lg">
                                                                                                                                {
                                                                                                                                        resource.title
                                                                                                                                }
                                                                                                                        </CardTitle>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </CardHeader>
                                                                                        <CardContent>
                                                                                                <CardDescription className="text-base mb-4">
                                                                                                        {
                                                                                                                resource.description
                                                                                                        }
                                                                                                </CardDescription>
                                                                                                <div className="flex items-center justify-between">
                                                                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                                                                                <Clock className="h-4 w-4 mr-1" />
                                                                                                                {
                                                                                                                        resource.duration
                                                                                                                }{' '}
                                                                                                                min
                                                                                                        </div>
                                                                                                        <Button
                                                                                                                size="sm"
                                                                                                                onClick={() =>
                                                                                                                        handleResourceClick(
                                                                                                                                resource._id,
                                                                                                                        )
                                                                                                                }
                                                                                                        >
                                                                                                                Access
                                                                                                                Resource
                                                                                                        </Button>
                                                                                                </div>
                                                                                        </CardContent>
                                                                                </Card>
                                                                        );
                                                                })}
                                                        </div>

                                                        {/* Pagination */}
                                                        {totalPages > 1 && (
                                                                <div className="flex justify-center items-center space-x-2 mt-6">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                        handlePageChange(
                                                                                                currentPage - 1,
                                                                                        )
                                                                                }
                                                                                disabled={currentPage === 1}
                                                                        >
                                                                                Previous
                                                                        </Button>
                                                                        <span className="text-sm text-muted-foreground">
                                                                                Page {currentPage} of {totalPages}
                                                                        </span>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                        handlePageChange(
                                                                                                currentPage + 1,
                                                                                        )
                                                                                }
                                                                                disabled={currentPage === totalPages}
                                                                        >
                                                                                Next
                                                                        </Button>
                                                                </div>
                                                        )}
                                                </>
                                        ) : (
                                                <div className="text-center py-8">
                                                        <p className="text-muted-foreground">
                                                                No featured resources available
                                                        </p>
                                                </div>
                                        )}
                                </div>

                                {/* Quick Access */}
                                <div className="bg-muted/30 rounded-2xl p-8">
                                        <div className="text-center mb-8">
                                                <h2 className="text-2xl font-semibold mb-4">
                                                        Need Help Finding Resources?
                                                </h2>
                                                <p className="text-muted-foreground">
                                                        Our resource library is constantly growing. Can&apos;t find what
                                                        you&apos;re looking for?
                                                </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button variant="outline">
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Request a Resource
                                                </Button>
                                                <Button>
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        Browse All Resources
                                                </Button>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
