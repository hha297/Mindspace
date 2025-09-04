'use client';

import { ResourceCard } from './resource-card';
import { Skeleton } from '@/components/ui/skeleton';

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

interface ResourcesGridProps {
        resources: Resource[];
        isLoading: boolean;
        selectedCategory: string | null;
}

export function ResourcesGrid({ resources, isLoading, selectedCategory }: ResourcesGridProps) {
        const filteredResources = selectedCategory
                ? resources.filter((resource) => resource.category === selectedCategory)
                : resources;

        if (isLoading) {
                return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} className="h-64" />
                                ))}
                        </div>
                );
        }

        if (filteredResources.length === 0) {
                return (
                        <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">No resources found</h3>
                                <p className="text-muted-foreground">
                                        {selectedCategory
                                                ? `No resources available in the "${selectedCategory}" category.`
                                                : 'No resources available at the moment.'}
                                </p>
                        </div>
                );
        }

        return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                                <ResourceCard key={resource._id} resource={resource} />
                        ))}
                </div>
        );
}
