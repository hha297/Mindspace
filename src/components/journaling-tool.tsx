/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, BookOpen, Lightbulb, Heart, Target } from 'lucide-react';
import { format } from 'date-fns';

interface JournalPrompt {
        id: string;
        category: 'reflection' | 'gratitude' | 'goals' | 'emotions';
        prompt: string;
        icon: any;
}

const journalPrompts: JournalPrompt[] = [
        {
                id: 'daily-reflection',
                category: 'reflection',
                prompt: 'What were the three most significant moments of your day, and how did they make you feel?',
                icon: BookOpen,
        },
        {
                id: 'gratitude',
                category: 'gratitude',
                prompt: "What are three things you're grateful for today, and why do they matter to you?",
                icon: Heart,
        },
        {
                id: 'emotions',
                category: 'emotions',
                prompt: 'Describe your emotional state right now. What might be contributing to these feelings?',
                icon: Heart,
        },
        {
                id: 'challenges',
                category: 'reflection',
                prompt: 'What challenge did you face today, and what did you learn from it?',
                icon: Lightbulb,
        },
        {
                id: 'goals',
                category: 'goals',
                prompt: "What's one small step you can take tomorrow to move closer to your goals?",
                icon: Target,
        },
        {
                id: 'self-care',
                category: 'reflection',
                prompt: 'How did you take care of yourself today? What could you do differently tomorrow?',
                icon: Heart,
        },
        {
                id: 'relationships',
                category: 'reflection',
                prompt: 'How did your interactions with others affect your mood today?',
                icon: Heart,
        },
        {
                id: 'stress',
                category: 'emotions',
                prompt: 'What stressed you out today, and how did you cope with it?',
                icon: Lightbulb,
        },
];

export function JournalingTool() {
        const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
        const [journalEntry, setJournalEntry] = useState('');
        const [isSaving, setIsSaving] = useState(false);
        const [savedEntries, setSavedEntries] = useState<any[]>([]);

        useEffect(() => {
                // Load saved entries from localStorage
                const saved = localStorage.getItem('journal-entries');
                if (saved) {
                        setSavedEntries(JSON.parse(saved));
                }
        }, []);

        const saveEntry = async () => {
                if (!journalEntry.trim()) {
                        toast.error('Entry is empty', {
                                description: 'Please write something before saving.',
                        });
                        return;
                }

                setIsSaving(true);

                try {
                        // Save to database
                        const response = await fetch('/api/journal', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        content: journalEntry,
                                        prompt: selectedPrompt?.prompt || null,
                                        category: selectedPrompt?.category || 'free-write',
                                        isPrivate: true,
                                }),
                        });

                        if (!response.ok) {
                                throw new Error('Failed to save to database');
                        }

                        const data = await response.json();

                        // Also save to localStorage for immediate display
                        const entry = {
                                id: data.entry._id,
                                content: journalEntry,
                                prompt: selectedPrompt?.prompt || null,
                                category: selectedPrompt?.category || 'free-write',
                                createdAt: new Date().toISOString(),
                        };

                        const updatedEntries = [entry, ...savedEntries];
                        setSavedEntries(updatedEntries);
                        localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));

                        toast.success('Entry saved!', {
                                description: 'Your journal entry has been saved successfully.',
                        });

                        // Clear the form
                        setJournalEntry('');
                        setSelectedPrompt(null);
                } catch (error) {
                        toast.error('Failed to save entry', {
                                description: 'Please try again.',
                        });
                        console.error(error);
                } finally {
                        setIsSaving(false);
                }
        };

        const startFreeWrite = () => {
                setSelectedPrompt(null);
                setJournalEntry('');
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
                        default:
                                return 'bg-gray-100 text-gray-800';
                }
        };

        return (
                <div className="space-y-6">
                        <Card>
                                <CardHeader>
                                        <CardTitle>Daily Journaling</CardTitle>
                                        <CardDescription>
                                                Express your thoughts and feelings through writing. Choose a prompt or
                                                start with free writing.
                                        </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                        {/* Prompt Selection */}
                                        {!selectedPrompt && (
                                                <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                                <h3 className="text-lg font-semibold">
                                                                        Choose a writing prompt
                                                                </h3>
                                                                <Button
                                                                        onClick={startFreeWrite}
                                                                        variant="outline"
                                                                        size="sm"
                                                                >
                                                                        Free Write
                                                                </Button>
                                                        </div>
                                                        <div className="grid md:grid-cols-2 gap-3">
                                                                {journalPrompts.map((prompt) => {
                                                                        const IconComponent = prompt.icon;
                                                                        return (
                                                                                <button
                                                                                        key={prompt.id}
                                                                                        onClick={() =>
                                                                                                setSelectedPrompt(
                                                                                                        prompt,
                                                                                                )
                                                                                        }
                                                                                        className="p-4 cursor-pointer text-left rounded-lg border border-primary/40 bg-white hover:bg-gray-100 hover:border-primary/40 transition-colors"
                                                                                >
                                                                                        <div className="flex items-start space-x-3">
                                                                                                <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                                                                                                <div className="flex-1">
                                                                                                        <Badge
                                                                                                                className={`${getCategoryColor(
                                                                                                                        prompt.category,
                                                                                                                )} mb-2`}
                                                                                                                variant="secondary"
                                                                                                        >
                                                                                                                {
                                                                                                                        prompt.category
                                                                                                                }
                                                                                                        </Badge>
                                                                                                        <p className="text-sm">
                                                                                                                {
                                                                                                                        prompt.prompt
                                                                                                                }
                                                                                                        </p>
                                                                                                </div>
                                                                                        </div>
                                                                                </button>
                                                                        );
                                                                })}
                                                        </div>
                                                </div>
                                        )}

                                        {/* Writing Area */}
                                        {(selectedPrompt || journalEntry) && (
                                                <div className="space-y-4">
                                                        {selectedPrompt && (
                                                                <div className="p-4 bg-white border border-primary/40 rounded-lg">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                                <Badge
                                                                                        className={getCategoryColor(
                                                                                                selectedPrompt.category,
                                                                                        )}
                                                                                        variant="secondary"
                                                                                >
                                                                                        {selectedPrompt.category}
                                                                                </Badge>
                                                                                <Button
                                                                                        onClick={() =>
                                                                                                setSelectedPrompt(null)
                                                                                        }
                                                                                        variant="default"
                                                                                        size="sm"
                                                                                >
                                                                                        Change Prompt
                                                                                </Button>
                                                                        </div>
                                                                        <p className="text-sm font-medium">
                                                                                {selectedPrompt.prompt}
                                                                        </p>
                                                                </div>
                                                        )}

                                                        <div className="space-y-2">
                                                                <Textarea
                                                                        placeholder={
                                                                                selectedPrompt
                                                                                        ? 'Take your time and write from the heart...'
                                                                                        : "What's on your mind today? Write freely about anything..."
                                                                        }
                                                                        value={journalEntry}
                                                                        onChange={(e) =>
                                                                                setJournalEntry(e.target.value)
                                                                        }
                                                                        className="min-h-[200px] bg-white border border-primary/50 rounded-lg"
                                                                />
                                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                        <span>{journalEntry.length} characters</span>
                                                                        <span>
                                                                                {format(
                                                                                        new Date(),
                                                                                        "MMMM d, yyyy 'at' h:mm a",
                                                                                )}
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        <div className="flex justify-end space-x-2">
                                                                <Button
                                                                        onClick={() => {
                                                                                setJournalEntry('');
                                                                                setSelectedPrompt(null);
                                                                        }}
                                                                        variant="outline"
                                                                >
                                                                        Clear
                                                                </Button>
                                                                <Button
                                                                        onClick={saveEntry}
                                                                        disabled={isSaving || !journalEntry.trim()}
                                                                >
                                                                        {isSaving ? (
                                                                                'Saving...'
                                                                        ) : (
                                                                                <>
                                                                                        <Save className="h-4 w-4 mr-2" />
                                                                                        Save Entry
                                                                                </>
                                                                        )}
                                                                </Button>
                                                        </div>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>

                        {/* Recent Entries */}
                        {savedEntries.length > 0 && (
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Recent Entries</CardTitle>
                                                <CardDescription>Your latest journal entries</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {savedEntries.slice(0, 3).map((entry) => (
                                                                <div key={entry.id} className="p-4 border rounded-lg">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                                <Badge
                                                                                        className={getCategoryColor(
                                                                                                entry.category,
                                                                                        )}
                                                                                        variant="secondary"
                                                                                >
                                                                                        {entry.category}
                                                                                </Badge>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                        {format(
                                                                                                new Date(
                                                                                                        entry.createdAt,
                                                                                                ),
                                                                                                'MMM d, h:mm a',
                                                                                        )}
                                                                                </span>
                                                                        </div>
                                                                        {entry.prompt && (
                                                                                <p className="text-sm text-muted-foreground mb-2 italic">
                                                                                        &quot;{entry.prompt}&quot;
                                                                                </p>
                                                                        )}
                                                                        <p className="text-sm line-clamp-3">
                                                                                {entry.content}
                                                                        </p>
                                                                </div>
                                                        ))}
                                                        {savedEntries.length > 3 && (
                                                                <div className="text-center">
                                                                        <Button variant="outline" size="sm">
                                                                                View All Entries ({savedEntries.length})
                                                                        </Button>
                                                                </div>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>
                        )}
                </div>
        );
}
