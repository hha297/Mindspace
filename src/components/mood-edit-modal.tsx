'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MoodLog {
        _id: string;
        mood: string;
        moodScore: number;
        note?: string;
        tags: string[];
        createdAt: string;
}

interface MoodEditModalProps {
        isOpen: boolean;
        onClose: () => void;
        moodLog: MoodLog | null;
        onSave: (updatedLog: MoodLog) => void;
}

const moodOptions = [
        { value: 'very-sad', label: 'Very Sad', emoji: '😢', score: 1 },
        { value: 'sad', label: 'Sad', emoji: '😔', score: 2 },
        { value: 'neutral', label: 'Neutral', emoji: '😐', score: 3 },
        { value: 'happy', label: 'Happy', emoji: '😊', score: 4 },
        { value: 'very-happy', label: 'Very Happy', emoji: '😄', score: 5 },
];

export function MoodEditModal({ isOpen, onClose, moodLog, onSave }: MoodEditModalProps) {
        const [selectedMood, setSelectedMood] = useState(moodLog?.mood || 'neutral');
        const [note, setNote] = useState(moodLog?.note || '');
        const [tags, setTags] = useState<string[]>(moodLog?.tags || []);
        const [newTag, setNewTag] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [originalValues, setOriginalValues] = useState({
                mood: '',
                note: '',
                tags: [] as string[],
        });

        useEffect(() => {
                if (moodLog) {
                        setSelectedMood(moodLog.mood);
                        setNote(moodLog.note || '');
                        setTags(moodLog.tags || []);
                        setOriginalValues({
                                mood: moodLog.mood,
                                note: moodLog.note || '',
                                tags: moodLog.tags || [],
                        });
                }
        }, [moodLog]);

        const handleSave = async () => {
                if (!moodLog) return;

                setIsLoading(true);
                try {
                        const selectedMoodOption = moodOptions.find((option) => option.value === selectedMood);
                        if (!selectedMoodOption) return;

                        const response = await fetch(`/api/mood/${moodLog._id}`, {
                                method: 'PATCH',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        mood: selectedMoodOption.score,
                                        moodLabel: selectedMood,
                                        notes: note,
                                        tags: tags,
                                }),
                        });

                        if (response.ok) {
                                const data = await response.json();
                                onSave(data.moodLog);
                                toast.success('Mood entry updated successfully');
                                onClose();
                        } else {
                                toast.error('Failed to update mood entry');
                        }
                } catch (error) {
                        console.error('Error updating mood:', error);
                        toast.error('Failed to update mood entry');
                } finally {
                        setIsLoading(false);
                }
        };

        const addTag = () => {
                if (newTag.trim() && !tags.includes(newTag.trim())) {
                        setTags([...tags, newTag.trim()]);
                        setNewTag('');
                }
        };

        const removeTag = (tagToRemove: string) => {
                setTags(tags.filter((tag) => tag !== tagToRemove));
        };

        const handleKeyPress = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                }
        };

        // Check if there are any changes
        const hasChanges = () => {
                return (
                        selectedMood !== originalValues.mood ||
                        note !== originalValues.note ||
                        JSON.stringify(tags.sort()) !== JSON.stringify(originalValues.tags.sort())
                );
        };

        return (
                <Dialog open={isOpen} onOpenChange={onClose}>
                        <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                        <DialogTitle>Edit Mood Entry</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6">
                                        {/* Mood Selection */}
                                        <div className="space-y-3">
                                                <Label>Mood</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                        {moodOptions.map((option) => (
                                                                <Button
                                                                        key={option.value}
                                                                        type="button"
                                                                        variant={
                                                                                selectedMood === option.value
                                                                                        ? 'default'
                                                                                        : 'outline'
                                                                        }
                                                                        // Col for mobile, row for desktop
                                                                        className="flex flex-col items-center p-3 h-auto"
                                                                        onClick={() => setSelectedMood(option.value)}
                                                                >
                                                                        <span className="text-2xl mb-1">
                                                                                {option.emoji}
                                                                        </span>
                                                                        <span className="text-xs">{option.label}</span>
                                                                </Button>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* Note */}
                                        <div className="space-y-3">
                                                <Label htmlFor="note">Note</Label>
                                                <Textarea
                                                        id="note"
                                                        value={note}
                                                        onChange={(e) => setNote(e.target.value)}
                                                        placeholder="How are you feeling?"
                                                        rows={3}
                                                        className="bg-white border-primary/50"
                                                />
                                        </div>

                                        {/* Tags */}
                                        <div className="space-y-3">
                                                <Label>Tags</Label>
                                                <div className="flex gap-2">
                                                        <Input
                                                                value={newTag}
                                                                onChange={(e) => setNewTag(e.target.value)}
                                                                onKeyPress={handleKeyPress}
                                                                placeholder="Add a tag..."
                                                                className="flex-1 bg-white border-primary/50"
                                                        />
                                                        <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={addTag}
                                                                disabled={!newTag.trim()}
                                                                className="bg-white border-primary/50"
                                                        >
                                                                <Plus className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                                {tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                                {tags.map((tag) => (
                                                                        <Badge
                                                                                key={tag}
                                                                                variant="secondary"
                                                                                className="flex items-center gap-1"
                                                                        >
                                                                                {tag}
                                                                                <button
                                                                                        type="button"
                                                                                        onClick={() => removeTag(tag)}
                                                                                        className="ml-1 cursor-pointer"
                                                                                >
                                                                                        <X className="h-3 w-3" />
                                                                                </button>
                                                                        </Badge>
                                                                ))}
                                                        </div>
                                                )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end gap-3">
                                                <Button variant="outline" onClick={onClose}>
                                                        Cancel
                                                </Button>
                                                <Button onClick={handleSave} disabled={isLoading || !hasChanges()}>
                                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                        </div>
                                </div>
                        </DialogContent>
                </Dialog>
        );
}
