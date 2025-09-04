/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, RotateCcw, Info } from 'lucide-react';
import { createStressQuiz, Quiz } from '@/lib/stress-quiz-data';

export function SelfAssessmentQuiz() {
        const [currentQuiz, setCurrentQuiz] = useState<Quiz>(() => createStressQuiz(10));
        const [currentQuestion, setCurrentQuestion] = useState(0);
        const [answers, setAnswers] = useState<Record<string, number>>({});
        const [isCompleted, setIsCompleted] = useState(false);
        const [result, setResult] = useState<any>(null);

        const handleAnswer = (questionId: string, value: number) => {
                setAnswers({ ...answers, [questionId]: value });
        };

        const nextQuestion = () => {
                if (currentQuestion < currentQuiz.questions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1);
                } else {
                        completeQuiz();
                }
        };

        const completeQuiz = async () => {
                const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
                const scoreRange = currentQuiz.scoring.ranges.find(
                        (range) => totalScore >= range.min && totalScore <= range.max,
                );

                const resultData = {
                        score: totalScore,
                        maxScore: currentQuiz.questions.length * 4,
                        ...scoreRange,
                };

                setResult(resultData);
                setIsCompleted(true);

                // Save to database
                try {
                        const questionsData = currentQuiz.questions.map((q) => ({
                                questionId: q.id,
                                question: q.question,
                                answer: answers[q.id] || 0,
                                options: q.options,
                        }));

                        const response = await fetch('/api/stress-assessment', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        score: totalScore,
                                        level: scoreRange?.level || 'Unknown',
                                        questions: questionsData,
                                }),
                        });

                        if (!response.ok) {
                                console.error('Failed to save stress assessment');
                        }
                } catch (error) {
                        console.error('Error saving stress assessment:', error);
                }
        };

        const resetQuiz = () => {
                setCurrentQuestion(0);
                setAnswers({});
                setIsCompleted(false);
                setResult(null);
                setCurrentQuiz(createStressQuiz(10));
        };

        const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
        const currentQ = currentQuiz.questions[currentQuestion];
        const canProceed = answers[currentQ?.id] !== undefined;

        if (isCompleted && result) {
                const IconComponent = result.icon || Info;
                return (
                        <Card className="w-full max-w-2xl mx-auto">
                                <CardHeader>
                                        <CardTitle>Assessment Complete</CardTitle>
                                        <CardDescription>Here are your results</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                        <div className={`p-6 rounded-lg border ${result.color}`}>
                                                <div className="flex items-center space-x-3 mb-4">
                                                        <IconComponent className="h-6 w-6" />
                                                        <div>
                                                                <h3 className="text-xl font-semibold">
                                                                        {result.level}
                                                                </h3>
                                                                <p className="text-sm opacity-75">
                                                                        Score: {result.score} out of {result.maxScore}
                                                                </p>
                                                        </div>
                                                </div>
                                                <p className="text-sm leading-relaxed">{result.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                                <h4 className="font-semibold">Recommended Next Steps:</h4>
                                                <div className="grid gap-3">
                                                        {result.level === 'Low Stress' && (
                                                                <>
                                                                        <div className="p-3 bg-white border border-primary/40 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Continue your current stress
                                                                                        management practices
                                                                                </p>
                                                                        </div>
                                                                        <div className="p-3 bg-white border border-primary/40 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Consider sharing your strategies
                                                                                        with friends who might benefit
                                                                                </p>
                                                                        </div>
                                                                </>
                                                        )}
                                                        {result.level === 'Moderate Stress' && (
                                                                <>
                                                                        <div className="p-3 bg-muted/50 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Try our breathing exercises or
                                                                                        journaling tools
                                                                                </p>
                                                                        </div>
                                                                        <div className="p-3 bg-muted/50 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Consider establishing a regular
                                                                                        self-care routine
                                                                                </p>
                                                                        </div>
                                                                        <div className="p-3 bg-muted/50 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Explore our stress management
                                                                                        resources
                                                                                </p>
                                                                        </div>
                                                                </>
                                                        )}
                                                        {result.level === 'High Stress' && (
                                                                <>
                                                                        <div className="p-3 bg-muted/50 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Consider speaking with a
                                                                                        counselor or mental health
                                                                                        professional
                                                                                </p>
                                                                        </div>
                                                                        <div className="p-3 bg-muted/50 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Use our crisis resources if you
                                                                                        need immediate support
                                                                                </p>
                                                                        </div>
                                                                        <div className="p-3 bg-muted/50 rounded-lg">
                                                                                <p className="text-sm">
                                                                                        Try daily stress-reduction
                                                                                        activities like breathing
                                                                                        exercises
                                                                                </p>
                                                                        </div>
                                                                </>
                                                        )}
                                                </div>
                                        </div>

                                        <div className="flex justify-center space-x-4">
                                                <Button onClick={resetQuiz} variant="outline">
                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                        Take Again
                                                </Button>
                                                <Button>Explore Resources</Button>
                                        </div>
                                </CardContent>
                        </Card>
                );
        }

        return (
                <Card className="w-full max-w-2xl mx-auto">
                        <CardHeader>
                                <CardTitle>{currentQuiz.title}</CardTitle>
                                <CardDescription>{currentQuiz.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                                {/* Progress */}
                                <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>
                                                        Question {currentQuestion + 1} of {currentQuiz.questions.length}
                                                </span>
                                                <span>{Math.round(progress)}% complete</span>
                                        </div>
                                        <Progress value={progress} className="w-full" />
                                </div>

                                {/* Question */}
                                <div className="space-y-4">
                                        <h3 className="text-lg font-semibold leading-relaxed">{currentQ.question}</h3>

                                        <RadioGroup
                                                value={answers[currentQ.id]?.toString() || ''}
                                                onValueChange={(value) =>
                                                        handleAnswer(currentQ.id, Number.parseInt(value))
                                                }
                                        >
                                                {currentQ.options.map((option, index) => (
                                                        <div key={index} className="flex items-center space-x-2">
                                                                <RadioGroupItem
                                                                        value={option.value.toString()}
                                                                        id={`option-${index}`}
                                                                        className="border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                                />
                                                                <Label
                                                                        htmlFor={`option-${index}`}
                                                                        className="flex-1 cursor-pointer"
                                                                >
                                                                        {option.label}
                                                                </Label>
                                                        </div>
                                                ))}
                                        </RadioGroup>
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-between">
                                        <Button
                                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                                variant="outline"
                                                disabled={currentQuestion === 0}
                                        >
                                                Previous
                                        </Button>
                                        <Button onClick={nextQuestion} disabled={!canProceed}>
                                                {currentQuestion === currentQuiz.questions.length - 1
                                                        ? 'Complete'
                                                        : 'Next'}
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                </div>
                        </CardContent>
                </Card>
        );
}
