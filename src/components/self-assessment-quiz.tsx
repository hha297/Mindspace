/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
        id: string;
        question: string;
        options: { value: number; label: string }[];
}

interface Quiz {
        id: string;
        title: string;
        description: string;
        questions: Question[];
        scoring: {
                ranges: { min: number; max: number; level: string; description: string; color: string; icon: any }[];
        };
}

const stressQuiz: Quiz = {
        id: 'stress-assessment',
        title: 'Stress Level Assessment',
        description: 'This brief assessment can help you understand your current stress levels.',
        questions: [
                {
                        id: 'q1',
                        question: 'How often have you felt nervous or stressed in the past week?',
                        options: [
                                { value: 0, label: 'Never' },
                                { value: 1, label: 'Almost never' },
                                { value: 2, label: 'Sometimes' },
                                { value: 3, label: 'Fairly often' },
                                { value: 4, label: 'Very often' },
                        ],
                },
                {
                        id: 'q2',
                        question: 'How often have you felt unable to control important things in your life?',
                        options: [
                                { value: 0, label: 'Never' },
                                { value: 1, label: 'Almost never' },
                                { value: 2, label: 'Sometimes' },
                                { value: 3, label: 'Fairly often' },
                                { value: 4, label: 'Very often' },
                        ],
                },
                {
                        id: 'q3',
                        question: 'How often have you felt confident about handling personal problems?',
                        options: [
                                { value: 4, label: 'Never' },
                                { value: 3, label: 'Almost never' },
                                { value: 2, label: 'Sometimes' },
                                { value: 1, label: 'Fairly often' },
                                { value: 0, label: 'Very often' },
                        ],
                },
                {
                        id: 'q4',
                        question: 'How often have you felt that things were going your way?',
                        options: [
                                { value: 4, label: 'Never' },
                                { value: 3, label: 'Almost never' },
                                { value: 2, label: 'Sometimes' },
                                { value: 1, label: 'Fairly often' },
                                { value: 0, label: 'Very often' },
                        ],
                },
                {
                        id: 'q5',
                        question: "How often have you felt difficulties piling up so high you couldn't overcome them?",
                        options: [
                                { value: 0, label: 'Never' },
                                { value: 1, label: 'Almost never' },
                                { value: 2, label: 'Sometimes' },
                                { value: 3, label: 'Fairly often' },
                                { value: 4, label: 'Very often' },
                        ],
                },
        ],
        scoring: {
                ranges: [
                        {
                                min: 0,
                                max: 7,
                                level: 'Low Stress',
                                description:
                                        "You're managing stress well. Keep up the good work with your current coping strategies.",
                                color: 'text-green-700 bg-green-50 border-green-300',
                                icon: CheckCircle,
                        },
                        {
                                min: 8,
                                max: 13,
                                level: 'Moderate Stress',
                                description:
                                        "You're experiencing some stress. Consider incorporating stress-reduction techniques into your routine.",
                                color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
                                icon: Info,
                        },
                        {
                                min: 14,
                                max: 20,
                                level: 'High Stress',
                                description:
                                        "You're experiencing significant stress. It may be helpful to speak with a counselor or mental health professional.",
                                color: 'text-red-700 bg-red-50 border-red-200',
                                icon: AlertTriangle,
                        },
                ],
        },
};

export function SelfAssessmentQuiz() {
        const [currentQuiz] = useState<Quiz>(stressQuiz);
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

        const completeQuiz = () => {
                const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
                const scoreRange = currentQuiz.scoring.ranges.find(
                        (range) => totalScore >= range.min && totalScore <= range.max,
                );

                setResult({
                        score: totalScore,
                        maxScore: currentQuiz.questions.length * 4,
                        ...scoreRange,
                });
                setIsCompleted(true);
        };

        const resetQuiz = () => {
                setCurrentQuestion(0);
                setAnswers({});
                setIsCompleted(false);
                setResult(null);
        };

        const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
        const currentQ = currentQuiz.questions[currentQuestion];
        const canProceed = answers[currentQ?.id] !== undefined;

        if (isCompleted && result) {
                const IconComponent = result.icon;
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
