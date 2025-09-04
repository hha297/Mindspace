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
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
        return (
                <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
                        <div className="flex flex-wrap gap-2">
                                <Button
                                        variant={selectedCategory === null ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => onCategorySelect(null)}
                                >
                                        All Resources
                                </Button>
                                {categories.map((category) => (
                                        <Button
                                                key={category.name}
                                                variant={selectedCategory === category.name ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => onCategorySelect(category.name)}
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
