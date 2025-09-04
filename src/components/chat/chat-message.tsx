'use client';

import { User, Bot, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Message {
        id: string;
        content: string;
        role: 'user' | 'assistant';
        timestamp: Date;
}

interface ChatMessageProps {
        message: Message;
        userImage?: string | null;
        isLoading?: boolean;
}

export function ChatMessage({ message, userImage, isLoading = false }: ChatMessageProps) {
        const formatTime = (date: Date) => {
                return date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                });
        };

        if (isLoading) {
                return (
                        <div className="flex justify-start">
                                <div className="flex items-start space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                                <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-muted text-foreground rounded-lg px-3 py-2">
                                                <div className="flex items-center space-x-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span className="text-sm">Typing...</span>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        return (
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                                className={`flex items-start space-x-2 max-w-[85%] ${
                                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                }`}
                        >
                                <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                        {message.role === 'user' ? (
                                                userImage ? (
                                                        <Image
                                                                width={32}
                                                                height={32}
                                                                src={userImage}
                                                                alt="User avatar"
                                                                className="w-8 h-8 rounded-full"
                                                        />
                                                ) : (
                                                        <User className="h-4 w-4" />
                                                )
                                        ) : (
                                                <Bot className="h-4 w-4" />
                                        )}
                                </div>
                                <div
                                        className={`rounded-lg px-3 py-2 ${
                                                message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-foreground'
                                        }`}
                                >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                                </div>
                        </div>
                </div>
        );
}
