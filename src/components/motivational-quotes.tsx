'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart, Star } from 'lucide-react';

const motivationalQuotes = [
        {
                text: 'Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.',
                author: 'Anonymous',
                category: 'self-care',
        },
        {
                text: "It's okay to not be okay. It's not okay to stay that way.",
                author: 'Anonymous',
                category: 'hope',
        },
        {
                text: 'You are stronger than you think and more resilient than you know.',
                author: 'Anonymous',
                category: 'strength',
        },
        {
                text: 'Bad days happen then good days happen. Just keep going.',
                author: 'Anonymous',
                category: 'progress',
        },
        {
                text: 'Bad things at times do happen to good people.',
                author: 'Anonymous',
                category: 'life',
        },
        {
                text: 'There’s no one who’s happy all the time. It’s just that some people are better at pretending.',
                author: 'Emma W.',
                category: 'life',
        },
        {
                text: 'Life doesn’t always turn out the way you planned. But that’s okay.',
                author: 'Anonymous',
                category: 'life',
        },
        {
                text: 'It’s not the end just because you failed once.',
                author: 'Michael L.',
                category: 'failure',
        },
        {
                text: 'You never know what life will throw at you. That’s why we have each other.',
                author: 'Anonymous',
                category: 'friendship',
        },
        {
                text: 'Even if it’s a small thing, if it makes you happy, it’s worth it.',
                author: 'Sophie K.',
                category: 'happiness',
        },
        {
                text: 'Don’t compare your life to others. Everyone has their own pace.',
                author: 'Anonymous',
                category: 'life',
        },
        {
                text: 'Progress, not perfection. Every small step counts.',
                author: 'Anonymous',
                category: 'progress',
        },
        {
                text: 'Your current situation is not your final destination.',
                author: 'Anonymous',
                category: 'hope',
        },
        {
                text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
                author: 'Noam Shpancer',
                category: 'journey',
        },
        {
                text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person.",
                author: 'Lori Deschene',
                category: 'acceptance',
        },
        {
                text: "Healing isn't about erasing your past or your pain. It's about learning to live with both in a way that doesn't hurt you anymore.",
                author: 'Anonymous',
                category: 'healing',
        },
        {
                text: 'You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.',
                author: 'Julian Seifter',
                category: 'identity',
        },
        {
                text: 'Take time to make your soul happy.',
                author: 'Anonymous',
                category: 'happiness',
        },
];

export function MotivationalQuotes() {
        const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
        const [isAnimating, setIsAnimating] = useState(false);

        useEffect(() => {
                // Show a random quote on component mount
                const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
                setCurrentQuote(randomQuote);
        }, []);

        const getNewQuote = () => {
                setIsAnimating(true);
                setTimeout(() => {
                        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
                        setCurrentQuote(randomQuote);
                        setIsAnimating(false);
                }, 300);
        };

        const getCategoryIcon = (category: string) => {
                switch (category) {
                        case 'self-care':
                        case 'happiness':
                                return Heart;
                        case 'hope':
                        case 'strength':
                        case 'progress':
                                return Star;
                        default:
                                return Heart;
                }
        };

        const getCategoryColor = (category: string) => {
                switch (category) {
                        case 'self-care':
                                return 'text-pink-600';
                        case 'hope':
                                return 'text-blue-600';
                        case 'strength':
                                return 'text-purple-600';
                        case 'progress':
                                return 'text-green-600';
                        case 'happiness':
                                return 'text-yellow-600';
                        case 'healing':
                                return 'text-emerald-600';
                        case 'acceptance':
                                return 'text-indigo-600';
                        case 'identity':
                                return 'text-orange-600';
                        case 'journey':
                                return 'text-teal-600';
                        default:
                                return 'text-gray-600';
                }
        };

        const getCategoryBgColor = (category: string) => {
                switch (category) {
                        case 'self-care':
                                return 'bg-pink-50 border-pink-200';
                        case 'hope':
                                return 'bg-blue-50 border-blue-200';
                        case 'strength':
                                return 'bg-purple-50 border-purple-200';
                        case 'progress':
                                return 'bg-green-50 border-green-200';
                        case 'happiness':
                                return 'bg-yellow-50 border-yellow-200';
                        case 'healing':
                                return 'bg-emerald-50 border-emerald-200';
                        case 'acceptance':
                                return 'bg-indigo-50 border-indigo-200';
                        case 'identity':
                                return 'bg-orange-50 border-orange-200';
                        case 'journey':
                                return 'bg-teal-50 border-teal-200';
                        default:
                                return 'bg-gray-50 border-gray-200';
                }
        };

        const IconComponent = getCategoryIcon(currentQuote.category);

        return (
                <Card className={`${getCategoryBgColor(currentQuote.category)}`}>
                        <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                                <IconComponent
                                                        className={`h-5 w-5 ${getCategoryColor(currentQuote.category)}`}
                                                />
                                                <span
                                                        className={`text-sm font-medium capitalize ${getCategoryColor(
                                                                currentQuote.category,
                                                        )}`}
                                                >
                                                        {currentQuote.category}
                                                </span>
                                        </div>
                                        <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={getNewQuote}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 cursor-pointer"
                                        >
                                                <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
                                        </Button>
                                </div>

                                <div
                                        className={`transition-opacity duration-300 ${
                                                isAnimating ? 'opacity-0' : 'opacity-100'
                                        }`}
                                >
                                        <blockquote className="text-lg font-medium text-gray-800 mb-3 leading-relaxed">
                                                &quot;{currentQuote.text}&quot;
                                        </blockquote>
                                        <cite className="text-sm text-gray-600 font-medium">
                                                — {currentQuote.author}
                                        </cite>
                                </div>
                        </CardContent>
                </Card>
        );
}
