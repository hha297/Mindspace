'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, X, Star } from 'lucide-react';

interface MoodOption {
        value: string;
        label: string;
        emoji: string;
        score: number;
        color: string;
}

const moodOptions: MoodOption[] = [
        {
                value: 'very-sad',
                label: 'Very Sad',
                emoji: '😢',
                score: 1,
                color: 'bg-red-100 text-red-800 hover:bg-red-200',
        },
        {
                value: 'sad',
                label: 'Sad',
                emoji: '😔',
                score: 2,
                color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        },
        {
                value: 'neutral',
                label: 'Neutral',
                emoji: '😐',
                score: 3,
                color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        },
        {
                value: 'happy',
                label: 'Happy',
                emoji: '😊',
                score: 4,
                color: 'bg-green-100 text-green-800 hover:bg-green-200',
        },
        {
                value: 'very-happy',
                label: 'Very Happy',
                emoji: '😄',
                score: 5,
                color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        },
];

interface MoodTrackerProps {
        onMoodLogged?: () => void;
}

export function MoodTracker({ onMoodLogged }: MoodTrackerProps) {
        const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
        const [note, setNote] = useState('');
        const [tags, setTags] = useState<string[]>([]);
        const [newTag, setNewTag] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const addTag = () => {
                if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
                        setTags([...tags, newTag.trim()]);
                        setNewTag('');
                }
        };

        const removeTag = (tagToRemove: string) => {
                setTags(tags.filter((tag) => tag !== tagToRemove));
        };

        const handleSubmit = async () => {
                if (!selectedMood) {
                        toast.error('Please select a mood', {
                                description: "Choose how you're feeling today before logging your mood.",
                        });
                        return;
                }

                setIsLoading(true);

                try {
                        const response = await fetch('/api/mood', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        mood: selectedMood.value,
                                        moodScore: selectedMood.score,
                                        note: note.trim() || undefined,
                                        tags,
                                }),
                        });

                        if (!response.ok) {
                                throw new Error('Failed to log mood');
                        }

                        const data = await response.json();

                        toast.success('Mood logged successfully!', {
                                description: `Your ${selectedMood.label.toLowerCase()} mood has been recorded.${
                                        data.streakCount > 1 ? ` Streak: ${data.streakCount} days!` : ''
                                }`,
                        });

                        // Reset form
                        setSelectedMood(null);
                        setNote('');
                        setTags([]);
                        setNewTag('');

                        // Notify parent component
                        onMoodLogged?.();

                        // Emit event to notify other components
                        window.dispatchEvent(new Event('mood-logged'));
                } catch (error) {
                        toast.error('Failed to log mood', {
                                description: 'Please try again later.',
                        });
                        console.error(error);
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <Card>
                        <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                        <span>How are you feeling today?</span>
                                </CardTitle>
                                <CardDescription>
                                        Take a moment to check in with yourself. Your mood tracking helps identify
                                        patterns and triggers.
                                </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                                {/* Mood Selection */}
                                <div className="text-center">
                                        <Label className="text-base font-medium mb-3 block">Select your mood</Label>
                                        <div className="space-y-3 max-w-md mx-auto">
                                                {moodOptions.map((mood) => (
                                                        <button
                                                                key={mood.value}
                                                                onClick={() => setSelectedMood(mood)}
                                                                className={`p-4 rounded-lg border-2 transition-all cursor-pointer w-full flex items-center justify-between ${
                                                                        selectedMood?.value === mood.value
                                                                                ? 'border-primary bg-white'
                                                                                : 'hover:border-primary/50 bg-white/40'
                                                                }`}
                                                        >
                                                                <div className="flex items-center space-x-2">
                                                                        <div className="text-3xl">{mood.emoji}</div>
                                                                        <div className="flex space-x-1">
                                                                                {[...Array(mood.score)].map(
                                                                                        (_, index) => (
                                                                                                <Star
                                                                                                        key={index}
                                                                                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                                                                />
                                                                                        ),
                                                                                )}
                                                                        </div>
                                                                </div>
                                                                <div className="text-sm font-medium">{mood.label}</div>
                                                        </button>
                                                ))}
                                        </div>
                                </div>

                                {/* Note Section */}
                                <div>
                                        <Label htmlFor="mood-note" className="text-base font-medium">
                                                Add a note (optional)
                                        </Label>
                                        <Textarea
                                                id="mood-note"
                                                placeholder="What's on your mind? Any specific thoughts or events that influenced your mood today?"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                className="my-2 bg-white border-primary/50"
                                                rows={3}
                                                maxLength={500}
                                        />
                                        <div className="text-xs text-muted-foreground mt-1">
                                                {note.length}/500 characters
                                        </div>
                                </div>

                                {/* Tags Section */}
                                <div>
                                        <Label className="text-base font-medium mb-2 block">Tags (optional)</Label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                                {tags.map((tag) => (
                                                        <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="flex items-center gap-1"
                                                        >
                                                                {tag}
                                                                <button
                                                                        onClick={() => removeTag(tag)}
                                                                        className="ml-1 hover:text-destructive"
                                                                >
                                                                        <X className="h-3 w-3" />
                                                                </button>
                                                        </Badge>
                                                ))}
                                        </div>
                                        {tags.length < 5 && (
                                                <div className="flex gap-2">
                                                        <Input
                                                                placeholder="Add a tag (e.g., work, family, exercise)"
                                                                value={newTag}
                                                                onChange={(e) => setNewTag(e.target.value)}
                                                                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                                                className="flex-1 mb-1 bg-white border-primary/50"
                                                                maxLength={20}
                                                        />
                                                        <Button onClick={addTag} size="sm" variant="outline">
                                                                <Plus className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1">
                                                Add up to 5 tags to help categorize your mood
                                        </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                        onClick={handleSubmit}
                                        disabled={!selectedMood || isLoading}
                                        className="w-full"
                                        size="lg"
                                >
                                        {isLoading ? (
                                                <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Logging Mood...
                                                </>
                                        ) : (
                                                'Log My Mood'
                                        )}
                                </Button>
                        </CardContent>
                </Card>
        );
}
