'use client';

import { useState, useEffect } from 'react';

import { Navbar } from '@/components/navbar';
import { EmergencyBanner } from '@/components/emergency-banner';
import { Input } from '@/components/ui/input';
import {
        Pagination,
        PaginationContent,
        PaginationItem,
        PaginationLink,
        PaginationNext,
        PaginationPrevious,
} from '@/components/ui/pagination';
import { Search } from 'lucide-react';
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
        const [currentPage, setCurrentPage] = useState(1);
        const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
        const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const itemsPerPage = 6;

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

                                // Calculate total pages will be updated in getFilteredResources

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
                setCurrentPage(1); // Reset to first page when filter changes
        };

        const handleFeaturedToggle = () => {
                setShowFeaturedOnly(!showFeaturedOnly);
                setCurrentPage(1); // Reset to first page when filter changes
        };

        const handleSearchChange = (query: string) => {
                setSearchQuery(query);
                setCurrentPage(1); // Reset to first page when search changes
        };

        // Filter resources based on selected category, featured status, and search query
        const getFilteredResources = () => {
                let filtered = resources;

                // Filter by search query
                if (searchQuery.trim()) {
                        filtered = filtered.filter(
                                (resource) =>
                                        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        resource.category.toLowerCase().includes(searchQuery.toLowerCase()),
                        );
                }

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

        // Calculate pagination based on filtered resources
        const filteredResources = getFilteredResources();
        const totalItems = filteredResources.length;
        const totalPagesCalculated = Math.ceil(totalItems / itemsPerPage);

        // Update total pages only when it changes
        useEffect(() => {
                setTotalPages(totalPagesCalculated);
                // Reset to page 1 if current page exceeds total pages
                if (currentPage > totalPagesCalculated) {
                        setCurrentPage(1);
                }
        }, [totalPagesCalculated, currentPage]);

        // Apply pagination to filtered resources
        const getPaginatedResources = () => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                return filteredResources.slice(startIndex, endIndex);
        };

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <EmergencyBanner />
                                {/* Header */}
                                <ResourcesHeader />

                                {/* Search */}
                                <div className="mb-6">
                                        <div className="relative max-w-md">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                        placeholder="Search resources..."
                                                        value={searchQuery}
                                                        onChange={(e) => handleSearchChange(e.target.value)}
                                                        className="pl-10 bg-white border-primary/50"
                                                />
                                        </div>
                                </div>

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
                                        resources={getPaginatedResources()}
                                        isLoading={isLoading}
                                        selectedCategory={selectedCategory}
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                        <div className="mt-8 flex justify-center">
                                                <Pagination>
                                                        <PaginationContent>
                                                                <PaginationItem>
                                                                        <PaginationPrevious
                                                                                onClick={() =>
                                                                                        setCurrentPage(
                                                                                                Math.max(
                                                                                                        1,
                                                                                                        currentPage - 1,
                                                                                                ),
                                                                                        )
                                                                                }
                                                                                className={
                                                                                        currentPage === 1
                                                                                                ? 'pointer-events-none opacity-50'
                                                                                                : 'cursor-pointer'
                                                                                }
                                                                        />
                                                                </PaginationItem>

                                                                {Array.from(
                                                                        { length: totalPages },
                                                                        (_, i) => i + 1,
                                                                ).map((page) => (
                                                                        <PaginationItem key={page}>
                                                                                <PaginationLink
                                                                                        onClick={() =>
                                                                                                setCurrentPage(page)
                                                                                        }
                                                                                        isActive={currentPage === page}
                                                                                        className="cursor-pointer"
                                                                                >
                                                                                        {page}
                                                                                </PaginationLink>
                                                                        </PaginationItem>
                                                                ))}

                                                                <PaginationItem>
                                                                        <PaginationNext
                                                                                onClick={() =>
                                                                                        setCurrentPage(
                                                                                                Math.min(
                                                                                                        totalPages,
                                                                                                        currentPage + 1,
                                                                                                ),
                                                                                        )
                                                                                }
                                                                                className={
                                                                                        currentPage === totalPages
                                                                                                ? 'pointer-events-none opacity-50'
                                                                                                : 'cursor-pointer'
                                                                                }
                                                                        />
                                                                </PaginationItem>
                                                        </PaginationContent>
                                                </Pagination>
                                        </div>
                                )}
                        </main>
                </div>
        );
}
