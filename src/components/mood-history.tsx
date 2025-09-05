'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
        Calendar,
        TrendingUp,
        TrendingDown,
        Minus,
        ChevronDown,
        ChevronUp,
        MoreHorizontal,
        Edit,
        Trash2,
} from 'lucide-react';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDialog } from '@/components/delete-dialog';
import { MoodEditModal } from '@/components/mood-edit-modal';
import { format, isToday, isYesterday } from 'date-fns';

interface MoodLog {
        _id: string;
        mood: string;
        moodScore: number;
        note?: string;
        tags: string[];
        createdAt: string;
}

const moodEmojis: Record<string, string> = {
        'very-sad': '😢',
        sad: '😔',
        neutral: '😐',
        happy: '😊',
        'very-happy': '😄',
};

const moodLabels: Record<string, string> = {
        'very-sad': 'Very Sad',
        sad: 'Sad',
        neutral: 'Neutral',
        happy: 'Happy',
        'very-happy': 'Very Happy',
};

const moodColors: Record<string, string> = {
        'very-sad': 'bg-red-100 text-red-800',
        sad: 'bg-orange-100 text-orange-800',
        neutral: 'bg-gray-300 text-gray-800',
        happy: 'bg-green-600 text-white',
        'very-happy': 'bg-primary text-primary-foreground',
};

export function MoodHistory() {
        const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [currentPage, setCurrentPage] = useState(1);
        const [sortBy, setSortBy] = useState<'date' | 'mood'>('date');
        const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
        const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
        const [editingLog, setEditingLog] = useState<MoodLog | null>(null);
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const itemsPerPage = 5;

        useEffect(() => {
                fetchMoodLogs();

                // Listen for mood logged events
                const handleMoodLogged = () => {
                        fetchMoodLogs();
                };

                window.addEventListener('mood-logged', handleMoodLogged);
                return () => {
                        window.removeEventListener('mood-logged', handleMoodLogged);
                };
        }, []);

        const fetchMoodLogs = async () => {
                try {
                        const response = await fetch('/api/mood');
                        if (response.ok) {
                                const data = await response.json();
                                console.log('Mood history data:', data);
                                setMoodLogs(data.moods);
                        }
                } catch (error) {
                        console.error('Failed to fetch mood logs:', error);
                } finally {
                        setIsLoading(false);
                }
        };

        const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                if (isToday(date)) return 'Today';
                if (isYesterday(date)) return 'Yesterday';
                return format(date, 'MMM d, yyyy');
        };

        const formatTime = (dateString: string) => {
                return format(new Date(dateString), 'h:mm a');
        };

        const toggleExpanded = (logId: string) => {
                setExpandedLogs((prev) => {
                        const newSet = new Set(prev);
                        if (newSet.has(logId)) {
                                newSet.delete(logId);
                        } else {
                                newSet.add(logId);
                        }
                        return newSet;
                });
        };

        const handleEdit = (log: MoodLog) => {
                setEditingLog(log);
                setIsEditModalOpen(true);
        };

        const handleDeleteMood = async (logId: string) => {
                try {
                        const response = await fetch(`/api/mood/${logId}`, {
                                method: 'DELETE',
                        });

                        if (response.ok) {
                                setMoodLogs((prev) => prev.filter((log) => log._id !== logId));
                                // Dispatch event to update other components
                                window.dispatchEvent(new CustomEvent('mood-logged'));
                        }
                } catch (error) {
                        console.error('Failed to delete mood log:', error);
                }
        };

        const handleSaveEdit = (updatedLog: MoodLog) => {
                setMoodLogs((prev) => prev.map((log) => (log._id === updatedLog._id ? updatedLog : log)));
                // Dispatch event to update other components
                window.dispatchEvent(new CustomEvent('mood-logged'));
        };

        const getAverageMood = () => {
                if (!moodLogs || moodLogs.length === 0) return 0;
                const sum = moodLogs.reduce((acc, log) => acc + log.moodScore, 0);
                return sum / moodLogs.length;
        };

        const getTrend = () => {
                if (!moodLogs || moodLogs.length < 2) return 'neutral';
                const recent = moodLogs.slice(0, 3);
                const older = moodLogs.slice(3, 6);

                if (recent.length === 0 || older.length === 0) return 'neutral';

                const recentAvg = recent.reduce((acc, log) => acc + log.moodScore, 0) / recent.length;
                const olderAvg = older.reduce((acc, log) => acc + log.moodScore, 0) / older.length;

                if (recentAvg > olderAvg + 0.3) return 'up';
                if (recentAvg < olderAvg - 0.3) return 'down';
                return 'neutral';
        };

        // Sort mood logs
        const sortedLogs = [...(moodLogs || [])].sort((a, b) => {
                if (sortBy === 'date') {
                        const dateA = new Date(a.createdAt).getTime();
                        const dateB = new Date(b.createdAt).getTime();
                        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                } else {
                        const scoreA = a.moodScore;
                        const scoreB = b.moodScore;
                        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
                }
        });

        // Pagination
        const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const displayedLogs = sortedLogs.slice(startIndex, startIndex + itemsPerPage);

        if (isLoading) {
                return (
                        <Card>
                                <CardHeader>
                                        <CardTitle>Mood History</CardTitle>
                                        <CardDescription>Your recent mood entries</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center space-x-4">
                                                        <Skeleton className="h-12 w-12 rounded-full" />
                                                        <div className="space-y-2 flex-1">
                                                                <Skeleton className="h-4 w-[200px]" />
                                                                <Skeleton className="h-4 w-[150px]" />
                                                        </div>
                                                </div>
                                        ))}
                                </CardContent>
                        </Card>
                );
        }

        if (!moodLogs || moodLogs.length === 0) {
                return (
                        <Card>
                                <CardHeader>
                                        <CardTitle>Mood History</CardTitle>
                                        <CardDescription>Your recent mood entries</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <div className="text-center py-8">
                                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
                                                <p className="text-muted-foreground">
                                                        Start tracking your mood to see patterns and insights over time.
                                                </p>
                                        </div>
                                </CardContent>
                        </Card>
                );
        }

        const averageMood = getAverageMood();
        const trend = getTrend();
        console.log(trend);
        return (
                <>
                        <Card>
                                <CardHeader>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                        <CardTitle>Mood History</CardTitle>
                                                        <CardDescription>
                                                                Your recent mood entries and trends
                                                        </CardDescription>
                                                </div>
                                                <div className="text-center sm:text-right">
                                                        <div className="text-sm text-muted-foreground">
                                                                Average Mood
                                                        </div>
                                                        <div className="flex items-center justify-center sm:justify-end space-x-2">
                                                                <span className="text-2xl font-bold">
                                                                        {averageMood.toFixed(1)}
                                                                </span>
                                                                {trend === 'up' && (
                                                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                                                )}
                                                                {trend === 'down' && (
                                                                        <TrendingDown className="h-4 w-4 text-red-600" />
                                                                )}
                                                                {trend === 'neutral' && (
                                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                                )}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Sorting Controls */}
                                        <div className="flex flex-col gap-4 mt-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center  gap-2">
                                                                <Label className="text-sm">Sort by:</Label>
                                                                <div className="flex gap-2">
                                                                        <Select
                                                                                value={sortBy}
                                                                                onValueChange={(
                                                                                        value: 'date' | 'mood',
                                                                                ) => {
                                                                                        setSortBy(value);
                                                                                        setCurrentPage(1);
                                                                                }}
                                                                        >
                                                                                <SelectTrigger className="w-[120px] bg-white border border-primary/50">
                                                                                        <SelectValue placeholder="Sort by" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                        <SelectItem value="date">
                                                                                                Date
                                                                                        </SelectItem>
                                                                                        <SelectItem value="mood">
                                                                                                Mood Score
                                                                                        </SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <Select
                                                                                value={sortOrder}
                                                                                onValueChange={(
                                                                                        value: 'asc' | 'desc',
                                                                                ) => {
                                                                                        setSortOrder(value);
                                                                                        setCurrentPage(1);
                                                                                }}
                                                                        >
                                                                                <SelectTrigger className="w-[130px] bg-white border border-primary/50">
                                                                                        <SelectValue placeholder="Order" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                        <SelectItem value="desc">
                                                                                                Descending
                                                                                        </SelectItem>
                                                                                        <SelectItem value="asc">
                                                                                                Ascending
                                                                                        </SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                </div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground text-center sm:text-right">
                                                                Page {currentPage} of {totalPages} ({sortedLogs.length}{' '}
                                                                total entries)
                                                        </div>
                                                </div>
                                        </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        {displayedLogs.map((log) => {
                                                const isExpanded = expandedLogs.has(log._id);
                                                const hasLongContent =
                                                        (log.note && log.note.length > 200) || log.tags.length > 5;

                                                return (
                                                        <div
                                                                key={log._id}
                                                                className="flex items-start space-x-4 p-4 rounded-lg border border-primary/50 bg-white group"
                                                        >
                                                                <div className="text-3xl flex-shrink-0">
                                                                        {moodEmojis[log.mood]}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                                                <Badge className={moodColors[log.mood]}>
                                                                                        {moodLabels[log.mood]}
                                                                                </Badge>
                                                                                <span className="text-sm text-muted-foreground">
                                                                                        {formatDate(log.createdAt)} at{' '}
                                                                                        {formatTime(log.createdAt)}
                                                                                </span>
                                                                                <div className="ml-auto">
                                                                                        <DropdownMenu>
                                                                                                <DropdownMenuTrigger
                                                                                                        asChild
                                                                                                >
                                                                                                        <Button
                                                                                                                variant="ghost"
                                                                                                                size="sm"
                                                                                                                className="h-6 w-6 p-0"
                                                                                                                title="More options"
                                                                                                        >
                                                                                                                <MoreHorizontal className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                </DropdownMenuTrigger>
                                                                                                <DropdownMenuContent align="end">
                                                                                                        <DropdownMenuItem
                                                                                                                onClick={() =>
                                                                                                                        handleEdit(
                                                                                                                                log,
                                                                                                                        )
                                                                                                                }
                                                                                                                className="cursor-pointer "
                                                                                                                title="Edit mood entry"
                                                                                                        >
                                                                                                                <Edit className="h-4 w-4 mr-2 hover:text-white" />
                                                                                                                Edit
                                                                                                                Entry
                                                                                                        </DropdownMenuItem>
                                                                                                        <DeleteDialog
                                                                                                                title="Delete Mood Entry"
                                                                                                                description="Are you sure you want to delete this mood entry? This action cannot be undone."
                                                                                                                onDelete={() =>
                                                                                                                        handleDeleteMood(
                                                                                                                                log._id,
                                                                                                                        )
                                                                                                                }
                                                                                                                trigger={
                                                                                                                        <DropdownMenuItem
                                                                                                                                onSelect={(
                                                                                                                                        e,
                                                                                                                                ) =>
                                                                                                                                        e.preventDefault()
                                                                                                                                }
                                                                                                                                className="cursor-pointer text-destructive"
                                                                                                                                title="Delete mood entry"
                                                                                                                        >
                                                                                                                                <Trash2 className="h-4 w-4 mr-2  hover:text-white" />
                                                                                                                                Delete
                                                                                                                                Entry
                                                                                                                        </DropdownMenuItem>
                                                                                                                }
                                                                                                        />
                                                                                                </DropdownMenuContent>
                                                                                        </DropdownMenu>
                                                                                </div>
                                                                        </div>
                                                                        {log.note && (
                                                                                <p
                                                                                        className={`text-sm text-muted-foreground mb-2 ${
                                                                                                !isExpanded &&
                                                                                                hasLongContent
                                                                                                        ? 'line-clamp-2'
                                                                                                        : ''
                                                                                        }`}
                                                                                >
                                                                                        {log.note}
                                                                                </p>
                                                                        )}
                                                                        {hasLongContent && (
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() =>
                                                                                                toggleExpanded(log._id)
                                                                                        }
                                                                                        className="mb-2 p-1 h-auto text-xs text-primary hover:text-white"
                                                                                >
                                                                                        {isExpanded ? (
                                                                                                <>
                                                                                                        <ChevronUp className="h-3 w-3 mr-1" />
                                                                                                        See less
                                                                                                </>
                                                                                        ) : (
                                                                                                <>
                                                                                                        <ChevronDown className="h-3 w-3 mr-1" />
                                                                                                        See more
                                                                                                </>
                                                                                        )}
                                                                                </Button>
                                                                        )}
                                                                        {log.tags.length > 0 && (
                                                                                <div
                                                                                        className={`flex flex-wrap gap-1 ${
                                                                                                !isExpanded &&
                                                                                                log.tags.length > 5
                                                                                                        ? 'max-h-6 overflow-hidden'
                                                                                                        : ''
                                                                                        }`}
                                                                                >
                                                                                        {log.tags.map((tag) => (
                                                                                                <Badge
                                                                                                        key={tag}
                                                                                                        variant="outline"
                                                                                                        className="text-xs"
                                                                                                >
                                                                                                        {tag}
                                                                                                </Badge>
                                                                                        ))}
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        </div>
                                                );
                                        })}

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                                <div className="flex flex-col items-center gap-3 pt-4">
                                                        <div className="flex items-center gap-2">
                                                                <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                                setCurrentPage(
                                                                                        Math.max(1, currentPage - 1),
                                                                                )
                                                                        }
                                                                        disabled={currentPage === 1}
                                                                >
                                                                        Previous
                                                                </Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                                setCurrentPage(
                                                                                        Math.min(
                                                                                                totalPages,
                                                                                                currentPage + 1,
                                                                                        ),
                                                                                )
                                                                        }
                                                                        disabled={currentPage === totalPages}
                                                                >
                                                                        Next
                                                                </Button>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground text-center">
                                                                Page {currentPage} of {totalPages}
                                                        </span>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>

                        {/* Edit Modal */}
                        <MoodEditModal
                                isOpen={isEditModalOpen}
                                onClose={() => {
                                        setIsEditModalOpen(false);
                                        setEditingLog(null);
                                }}
                                moodLog={editingLog}
                                onSave={handleSaveEdit}
                        />
                </>
        );
}
