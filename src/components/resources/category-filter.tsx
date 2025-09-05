'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Category {
        name: string;
        count: number;
}

interface CategoryFilterProps {
        categories: Category[];
        selectedCategory: string | null;
        onCategorySelect: (category: string | null) => void;
        showFeaturedOnly: boolean;
        onFeaturedToggle: () => void;
        featuredCount: number;
}

export function CategoryFilter({
        categories,
        selectedCategory,
        onCategorySelect,
        showFeaturedOnly,
        onFeaturedToggle,
        featuredCount,
}: CategoryFilterProps) {
        return (
                <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                                <Button
                                        variant={selectedCategory === null && !showFeaturedOnly ? 'default' : 'outline'}
                                        size="sm"
                                        className="w-full sm:w-auto justify-center"
                                        onClick={() => {
                                                onCategorySelect(null);
                                                if (showFeaturedOnly) onFeaturedToggle();
                                        }}
                                >
                                        All Resources
                                </Button>
                                <Button
                                        variant={showFeaturedOnly ? 'default' : 'outline'}
                                        size="sm"
                                        className="w-full sm:w-auto justify-center"
                                        onClick={() => {
                                                onFeaturedToggle();
                                                if (selectedCategory) onCategorySelect(null);
                                        }}
                                >
                                        Featured Only
                                        <Badge variant="secondary" className="ml-2">
                                                {featuredCount}
                                        </Badge>
                                </Button>
                                {categories.map((category) => (
                                        <Button
                                                key={category.name}
                                                variant={
                                                        selectedCategory === category.name && !showFeaturedOnly
                                                                ? 'default'
                                                                : 'outline'
                                                }
                                                size="sm"
                                                className="w-full sm:w-auto justify-center"
                                                onClick={() => {
                                                        onCategorySelect(category.name);
                                                        if (showFeaturedOnly) onFeaturedToggle();
                                                }}
                                        >
                                                {category.name}
                                                <Badge variant="secondary" className="ml-2">
                                                        {category.count}
                                                </Badge>
                                        </Button>
                                ))}
                        </div>
                </div>
        );
}
