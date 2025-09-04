'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage } from './chat-message';

interface Message {
        id: string;
        content: string;
        role: 'user' | 'assistant';
        timestamp: Date;
}

interface ChatMessagesProps {
        messages: Message[];
        isLoading: boolean;
        userImage?: string | null;
}

export function ChatMessages({ messages, isLoading, userImage }: ChatMessagesProps) {
        const messagesEndRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [messages]);

        return (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} userImage={userImage} />
                        ))}

                        {isLoading && <ChatMessage message={{} as Message} userImage={userImage} isLoading={true} />}

                        <div ref={messagesEndRef} />
                </div>
        );
}
