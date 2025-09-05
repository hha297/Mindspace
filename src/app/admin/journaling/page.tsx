'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Heart, Target, PenTool, Calendar, User, Search, Filter } from 'lucide-react';

interface JournalEntry {
        _id: string;
        userId: string;
        content: string;
        prompt?: string;
        category: 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'free-write';
        mood?: number;
        tags?: string[];
        isPrivate: boolean;
        createdAt: string;
        updatedAt: string;
}

const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'reflection', label: 'Reflection' },
        { value: 'gratitude', label: 'Gratitude' },
        { value: 'goals', label: 'Goals' },
        { value: 'emotions', label: 'Emotions' },
        { value: 'free-write', label: 'Free Write' },
];

const getCategoryIcon = (category: string) => {
        switch (category) {
                case 'reflection':
                        return BookOpen;
                case 'gratitude':
                        return Heart;
                case 'goals':
                        return Target;
                case 'emotions':
                        return Heart;
                case 'free-write':
                        return PenTool;
                default:
                        return BookOpen;
        }
};

const getCategoryColor = (category: string) => {
        switch (category) {
                case 'reflection':
                        return 'bg-blue-100 text-blue-800';
                case 'gratitude':
                        return 'bg-green-100 text-green-800';
                case 'goals':
                        return 'bg-purple-100 text-purple-800';
                case 'emotions':
                        return 'bg-pink-100 text-pink-800';
                case 'free-write':
                        return 'bg-gray-100 text-gray-800';
                default:
                        return 'bg-gray-100 text-gray-800';
        }
};

export default function AdminJournalingPage() {
        const [entries, setEntries] = useState<JournalEntry[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [selectedCategory, setSelectedCategory] = useState('all');
        const [selectedUser, setSelectedUser] = useState('all');
        const [searchQuery, setSearchQuery] = useState('');
        const [uniqueUsers, setUniqueUsers] = useState<string[]>([]);
        const [totalEntries, setTotalEntries] = useState(0);

        const fetchEntries = useCallback(async () => {
                try {
                        const params = new URLSearchParams();
                        if (selectedCategory !== 'all') params.set('category', selectedCategory);
                        if (selectedUser !== 'all') params.set('userId', selectedUser);

                        const response = await fetch(`/api/admin/journal?${params.toString()}`);
                        if (response.ok) {
                                const data = await response.json();
                                setEntries(data.entries);
                                setUniqueUsers(data.uniqueUsers);
                                setTotalEntries(data.totalEntries);
                        } else {
                                toast.error('Failed to fetch journal entries');
                        }
                } catch (error) {
                        console.error('Error fetching journal entries:', error);
                        toast.error('Failed to fetch journal entries');
                } finally {
                        setIsLoading(false);
                }
        }, [selectedCategory, selectedUser]);

        useEffect(() => {
                fetchEntries();
        }, [fetchEntries]);

        const filteredEntries = entries.filter((entry) => {
                if (searchQuery) {
                        return (
                                entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                entry.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                entry.userId.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                }
                return true;
        });

        if (isLoading) {
                return (
                        <div className="p-4 md:p-8">
                                <div className="mb-8">
                                        <Skeleton className="h-8 w-64 mb-2" />
                                        <Skeleton className="h-4 w-96" />
                                </div>
                                <Skeleton className="h-96 w-full" />
                        </div>
                );
        }

        return (
                <div className="p-4 md:p-8">
                        <div className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-2">Journal Entries</h1>
                                <p className="text-muted-foreground">
                                        View and manage user journal entries from the Digital Journaling Tool
                                </p>
                        </div>

                        {/* Filters */}
                        <Card className="mb-6">
                                <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                                <Filter className="h-5 w-5" />
                                                <span>Filters</span>
                                        </CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                        <label className="text-sm font-medium mb-2 block">Search</label>
                                                        <div className="relative">
                                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input
                                                                        placeholder="Search entries..."
                                                                        value={searchQuery}
                                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                                        className="pl-10 bg-white border-primary/50"
                                                                />
                                                        </div>
                                                </div>
                                                <div>
                                                        <label className="text-sm font-medium mb-2 block">
                                                                Filters
                                                        </label>
                                                        <div className="flex gap-2">
                                                                <Select
                                                                        value={selectedCategory}
                                                                        onValueChange={setSelectedCategory}
                                                                >
                                                                        <SelectTrigger className="bg-white border border-primary/50">
                                                                                <SelectValue placeholder="Category" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {categories.map((cat) => (
                                                                                        <SelectItem
                                                                                                key={cat.value}
                                                                                                value={cat.value}
                                                                                        >
                                                                                                {cat.label}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                                <Select
                                                                        value={selectedUser}
                                                                        onValueChange={setSelectedUser}
                                                                >
                                                                        <SelectTrigger className="bg-white border border-primary/50">
                                                                                <SelectValue placeholder="User" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                <SelectItem value="all">
                                                                                        All Users
                                                                                </SelectItem>
                                                                                {uniqueUsers.map((user) => (
                                                                                        <SelectItem
                                                                                                key={user}
                                                                                                value={user}
                                                                                        >
                                                                                                {user}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <Card>
                                        <CardContent className="p-4">
                                                <div className="flex items-center space-x-2">
                                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                                        <div className="flex flex-row items-center space-x-2">
                                                                <p className="text-2xl font-bold">{totalEntries}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Total Entries
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardContent className="p-4">
                                                <div className="flex items-center space-x-2">
                                                        <User className="h-5 w-5 text-green-600" />
                                                        <div className="flex flex-row items-center space-x-2">
                                                                <p className="text-2xl font-bold">
                                                                        {uniqueUsers.length}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Active Users
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardContent className="p-4">
                                                <div className="flex items-center space-x-2">
                                                        <Calendar className="h-5 w-5 text-purple-600" />
                                                        <div className="flex flex-row items-center space-x-2">
                                                                <p className="text-2xl font-bold">
                                                                        {
                                                                                entries.filter((entry) => {
                                                                                        const today = new Date();
                                                                                        const entryDate = new Date(
                                                                                                entry.createdAt,
                                                                                        );
                                                                                        return (
                                                                                                entryDate.toDateString() ===
                                                                                                today.toDateString()
                                                                                        );
                                                                                }).length
                                                                        }
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Today&apos;s Entries
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardContent className="p-4">
                                                <div className="flex items-center  space-x-2">
                                                        <Heart className="h-5 w-5 text-pink-600" />
                                                        <div className="flex flex-row items-center space-x-2">
                                                                <p className="text-2xl font-bold">
                                                                        {
                                                                                entries.filter(
                                                                                        (entry) =>
                                                                                                entry.category ===
                                                                                                'gratitude',
                                                                                ).length
                                                                        }
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Gratitude Entries
                                                                </p>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>
                        </div>

                        {/* Entries List */}
                        <Card>
                                <CardHeader>
                                        <CardTitle>Journal Entries ({filteredEntries.length})</CardTitle>
                                        <CardDescription>Recent journal entries from users</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <ScrollArea className="h-[600px]">
                                                <div className="space-y-4">
                                                        {filteredEntries.map((entry) => {
                                                                const CategoryIcon = getCategoryIcon(entry.category);
                                                                return (
                                                                        <div
                                                                                key={entry._id}
                                                                                className="p-4 border rounded-lg"
                                                                        >
                                                                                <div className="flex items-start justify-between mb-3">
                                                                                        <div className="flex items-center space-x-3">
                                                                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                                                                        <CategoryIcon className="h-5 w-5 text-primary" />
                                                                                                </div>
                                                                                                <div>
                                                                                                        <div className="flex items-center space-x-2 mb-1">
                                                                                                                <Badge
                                                                                                                        className={getCategoryColor(
                                                                                                                                entry.category,
                                                                                                                        )}
                                                                                                                        variant="secondary"
                                                                                                                >
                                                                                                                        {
                                                                                                                                entry.category
                                                                                                                        }
                                                                                                                </Badge>
                                                                                                                <span className="text-sm text-muted-foreground">
                                                                                                                        {
                                                                                                                                entry.userId
                                                                                                                        }
                                                                                                                </span>
                                                                                                        </div>
                                                                                                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                                                                                <div className="flex items-center space-x-1">
                                                                                                                        <Calendar className="h-3 w-3" />
                                                                                                                        <span>
                                                                                                                                {format(
                                                                                                                                        new Date(
                                                                                                                                                entry.createdAt,
                                                                                                                                        ),
                                                                                                                                        'MMM d, yyyy h:mm a',
                                                                                                                                )}
                                                                                                                        </span>
                                                                                                                </div>
                                                                                                                {entry.mood && (
                                                                                                                        <div className="flex items-center space-x-1">
                                                                                                                                <Heart className="h-3 w-3" />
                                                                                                                                <span>
                                                                                                                                        Mood:{' '}
                                                                                                                                        {
                                                                                                                                                entry.mood
                                                                                                                                        }
                                                                                                                                        /5
                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                {entry.prompt && (
                                                                                        <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                                                                                                <p className="text-sm text-muted-foreground italic">
                                                                                                        &quot;
                                                                                                        {entry.prompt}
                                                                                                        &quot;
                                                                                                </p>
                                                                                        </div>
                                                                                )}

                                                                                <div className="mb-3">
                                                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                                                                {entry.content}
                                                                                        </p>
                                                                                </div>

                                                                                {entry.tags &&
                                                                                        entry.tags.length > 0 && (
                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                        {entry.tags.map(
                                                                                                                (
                                                                                                                        tag,
                                                                                                                        index,
                                                                                                                ) => (
                                                                                                                        <Badge
                                                                                                                                key={
                                                                                                                                        index
                                                                                                                                }
                                                                                                                                variant="outline"
                                                                                                                                className="text-xs"
                                                                                                                        >
                                                                                                                                {
                                                                                                                                        tag
                                                                                                                                }
                                                                                                                        </Badge>
                                                                                                                ),
                                                                                                        )}
                                                                                                </div>
                                                                                        )}
                                                                        </div>
                                                                );
                                                        })}

                                                        {filteredEntries.length === 0 && (
                                                                <div className="text-center py-8">
                                                                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                                        <h3 className="text-lg font-medium mb-2">
                                                                                No journal entries found
                                                                        </h3>
                                                                        <p className="text-muted-foreground">
                                                                                Try adjusting your filters or check back
                                                                                later.
                                                                        </p>
                                                                </div>
                                                        )}
                                                </div>
                                        </ScrollArea>
                                </CardContent>
                        </Card>
                </div>
        );
}
