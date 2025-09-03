'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingPattern {
        name: string;
        description: string;
        pattern: { phase: Phase; duration: number; instruction: string }[];
        totalCycles: number;
}

const breathingPatterns: BreathingPattern[] = [
        {
                name: '4-7-8 Technique',
                description: 'A calming technique that helps reduce anxiety and promote sleep',
                pattern: [
                        { phase: 'inhale', duration: 4, instruction: 'Breathe in through your nose' },
                        { phase: 'hold', duration: 7, instruction: 'Hold your breath' },
                        { phase: 'exhale', duration: 8, instruction: 'Exhale slowly through your mouth' },
                        { phase: 'rest', duration: 2, instruction: 'Rest and prepare for the next cycle' },
                ],
                totalCycles: 4,
        },
        {
                name: 'Box Breathing',
                description: 'A simple technique used by Navy SEALs to stay calm under pressure',
                pattern: [
                        { phase: 'inhale', duration: 4, instruction: 'Breathe in slowly' },
                        { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
                        { phase: 'exhale', duration: 4, instruction: 'Exhale slowly' },
                        { phase: 'hold', duration: 4, instruction: 'Hold empty' },
                ],
                totalCycles: 5,
        },
        {
                name: 'Simple Breathing',
                description: 'Basic breathing exercise for beginners',
                pattern: [
                        { phase: 'inhale', duration: 4, instruction: 'Breathe in deeply' },
                        { phase: 'exhale', duration: 6, instruction: 'Breathe out slowly' },
                        { phase: 'rest', duration: 2, instruction: 'Relax' },
                ],
                totalCycles: 6,
        },
];

export function BreathingExercise() {
        const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
        const [isActive, setIsActive] = useState(false);
        const [currentCycle, setCurrentCycle] = useState(0);
        const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
        const [timeLeft, setTimeLeft] = useState(selectedPattern.pattern[0].duration);
        const [isCompleted, setIsCompleted] = useState(false);
        const [isSoundEnabled, setIsSoundEnabled] = useState(false);
        const intervalRef = useRef<NodeJS.Timeout | null>(null);

        const currentPhase = selectedPattern.pattern[currentPhaseIndex];
        const totalDuration = selectedPattern.pattern.reduce((sum, phase) => sum + phase.duration, 0);
        const cycleProgress =
                ((currentPhaseIndex * totalDuration + (currentPhase.duration - timeLeft)) / totalDuration) * 100;
        const overallProgress = (currentCycle * 100 + cycleProgress) / selectedPattern.totalCycles;

        useEffect(() => {
                if (isActive && timeLeft > 0) {
                        intervalRef.current = setTimeout(() => {
                                setTimeLeft(timeLeft - 1);
                        }, 1000);
                } else if (isActive && timeLeft === 0) {
                        // Move to next phase
                        if (currentPhaseIndex < selectedPattern.pattern.length - 1) {
                                setCurrentPhaseIndex(currentPhaseIndex + 1);
                                setTimeLeft(selectedPattern.pattern[currentPhaseIndex + 1].duration);
                        } else {
                                // Move to next cycle
                                if (currentCycle < selectedPattern.totalCycles - 1) {
                                        setCurrentCycle(currentCycle + 1);
                                        setCurrentPhaseIndex(0);
                                        setTimeLeft(selectedPattern.pattern[0].duration);
                                } else {
                                        // Exercise completed
                                        setIsActive(false);
                                        setIsCompleted(true);
                                }
                        }
                }

                return () => {
                        if (intervalRef.current) {
                                clearTimeout(intervalRef.current);
                        }
                };
        }, [isActive, timeLeft, currentPhaseIndex, currentCycle, selectedPattern]);

        const startExercise = () => {
                setIsActive(true);
                setIsCompleted(false);
        };

        const pauseExercise = () => {
                setIsActive(false);
        };

        const resetExercise = () => {
                setIsActive(false);
                setCurrentCycle(0);
                setCurrentPhaseIndex(0);
                setTimeLeft(selectedPattern.pattern[0].duration);
                setIsCompleted(false);
        };

        const changePattern = (pattern: BreathingPattern) => {
                setSelectedPattern(pattern);
                resetExercise();
        };

        const getPhaseColor = (phase: Phase) => {
                switch (phase) {
                        case 'inhale':
                                return 'text-blue-600';
                        case 'hold':
                                return 'text-purple-600';
                        case 'exhale':
                                return 'text-green-600';
                        case 'rest':
                                return 'text-gray-600';
                        default:
                                return 'text-gray-600';
                }
        };

        const getCircleScale = () => {
                if (currentPhase.phase === 'inhale') {
                        return 1 + ((currentPhase.duration - timeLeft) / currentPhase.duration) * 0.5;
                } else if (currentPhase.phase === 'exhale') {
                        return 1.5 - ((currentPhase.duration - timeLeft) / currentPhase.duration) * 0.5;
                }
                return currentPhase.phase === 'hold' ? 1.5 : 1;
        };

        return (
                <Card className="w-full max-w-2xl mx-auto">
                        <CardHeader>
                                <CardTitle className="text-center">Breathing Exercise</CardTitle>
                                <CardDescription className="text-center">
                                        Take a few minutes to calm your mind with guided breathing
                                </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                                {/* Pattern Selection */}
                                <div className="space-y-2">
                                        <label className="text-sm font-medium">Choose a breathing pattern:</label>
                                        <div className="grid gap-2">
                                                {breathingPatterns.map((pattern) => (
                                                        <button
                                                                key={pattern.name}
                                                                onClick={() => changePattern(pattern)}
                                                                className={`p-3 text-left rounded-lg border transition-colors ${
                                                                        selectedPattern.name === pattern.name
                                                                                ? 'border-primary bg-primary/10'
                                                                                : 'border-border hover:border-primary/50'
                                                                }`}
                                                        >
                                                                <div className="font-medium">{pattern.name}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                        {pattern.description}
                                                                </div>
                                                        </button>
                                                ))}
                                        </div>
                                </div>

                                {/* Breathing Circle */}
                                <div className="flex flex-col items-center space-y-6">
                                        <div className="relative w-48 h-48 flex items-center justify-center">
                                                <div
                                                        className="w-32 h-32 rounded-full bg-primary/20 border-4 border-primary transition-transform duration-1000 ease-in-out flex items-center justify-center"
                                                        style={{ transform: `scale(${getCircleScale()})` }}
                                                >
                                                        <div className="text-center">
                                                                <div
                                                                        className={`text-2xl font-bold ${getPhaseColor(
                                                                                currentPhase.phase,
                                                                        )}`}
                                                                >
                                                                        {timeLeft}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                        seconds
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Current Instruction */}
                                        <div className="text-center">
                                                <div
                                                        className={`text-xl font-semibold ${getPhaseColor(
                                                                currentPhase.phase,
                                                        )} capitalize`}
                                                >
                                                        {currentPhase.phase}
                                                </div>
                                                <div className="text-muted-foreground">{currentPhase.instruction}</div>
                                        </div>

                                        {/* Progress */}
                                        <div className="w-full space-y-2">
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                        <span>
                                                                Cycle {currentCycle + 1} of{' '}
                                                                {selectedPattern.totalCycles}
                                                        </span>
                                                        <span>{Math.round(overallProgress)}% complete</span>
                                                </div>
                                                <Progress value={overallProgress} className="w-full" />
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center space-x-4">
                                                <Button
                                                        onClick={
                                                                isSoundEnabled
                                                                        ? () => setIsSoundEnabled(false)
                                                                        : () => setIsSoundEnabled(true)
                                                        }
                                                        variant="outline"
                                                        size="sm"
                                                >
                                                        {isSoundEnabled ? (
                                                                <Volume2 className="h-4 w-4" />
                                                        ) : (
                                                                <VolumeX className="h-4 w-4" />
                                                        )}
                                                </Button>

                                                {!isActive && !isCompleted && (
                                                        <Button onClick={startExercise} size="lg">
                                                                <Play className="h-4 w-4 mr-2" />
                                                                Start
                                                        </Button>
                                                )}

                                                {isActive && (
                                                        <Button onClick={pauseExercise} variant="outline" size="lg">
                                                                <Pause className="h-4 w-4 mr-2" />
                                                                Pause
                                                        </Button>
                                                )}

                                                <Button onClick={resetExercise} variant="outline" size="sm">
                                                        <RotateCcw className="h-4 w-4" />
                                                </Button>
                                        </div>

                                        {/* Completion Message */}
                                        {isCompleted && (
                                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="text-green-800 font-semibold mb-2">
                                                                Exercise Complete!
                                                        </div>
                                                        <div className="text-green-700 text-sm">
                                                                Great job! You&apos;ve completed{' '}
                                                                {selectedPattern.totalCycles} cycles of{' '}
                                                                {selectedPattern.name}. Take a moment to notice how you
                                                                feel.
                                                        </div>
                                                </div>
                                        )}
                                </div>
                        </CardContent>
                </Card>
        );
}
