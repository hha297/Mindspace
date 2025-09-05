'use client';

import { useState, useEffect } from 'react';

import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { toast } from 'sonner';

// Resources Components
import { ResourcesHeader } from '@/components/resources/resources-header';
import { CategoryFilter } from '@/components/resources/category-filter';
import { ResourcesGrid } from '@/components/resources/resources-grid';

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

interface Category {
        name: string;
        count: number;
}

export default function ResourcesPage() {
        const [resources, setResources] = useState<Resource[]>([]);
        const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
        const [categories, setCategories] = useState<Category[]>([]);
        const [isLoading, setIsLoading] = useState(true);

        const [totalPages, setTotalPages] = useState(1);
        const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
        const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
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

                                // Calculate total pages for pagination (use all resources for pagination)
                                const totalItems = allData.resources?.length || 0;
                                setTotalPages(Math.ceil(totalItems / itemsPerPage));

                                // Calculate categories with counts
                                const categoryCounts: Record<string, number> = {};
                                allData.resources?.forEach((resource: Resource) => {
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

        const handleCategorySelect = (category: string | null) => {
                setSelectedCategory(category);
        };

        const handleFeaturedToggle = () => {
                setShowFeaturedOnly(!showFeaturedOnly);
        };

        // Filter resources based on selected category and featured status
        const getFilteredResources = () => {
                let filtered = resources;

                // Filter by featured status
                if (showFeaturedOnly) {
                        filtered = filtered.filter((resource) => resource.featured);
                }

                // Filter by category
                if (selectedCategory) {
                        filtered = filtered.filter((resource) => resource.category === selectedCategory);
                }

                return filtered;
        };

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />
                                {/* Header */}
                                <ResourcesHeader />

                                {/* Category Filter */}
                                <CategoryFilter
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        onCategorySelect={handleCategorySelect}
                                        showFeaturedOnly={showFeaturedOnly}
                                        onFeaturedToggle={handleFeaturedToggle}
                                        featuredCount={resources.filter((resource) => resource.featured).length}
                                />

                                {/* Resources Grid */}
                                <ResourcesGrid
                                        resources={getFilteredResources()}
                                        isLoading={isLoading}
                                        selectedCategory={selectedCategory}
                                />
                        </main>
                </div>
        );
}
