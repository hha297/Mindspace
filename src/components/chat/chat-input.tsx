'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
        input: string;
        setInput: (value: string) => void;
        onSendMessage: () => void;
        isLoading: boolean;
        placeholder?: string;
}

export function ChatInput({
        input,
        setInput,
        onSendMessage,
        isLoading,
        placeholder = 'Type your message...',
}: ChatInputProps) {
        const handleKeyPress = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                }
        };

        return (
                <div className="p-4 border-t bg-background">
                        <div className="flex space-x-2">
                                <div className="relative flex-1">
                                        <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder={placeholder}
                                                disabled={isLoading}
                                                className="flex-1 border-primary/50"
                                        />
                                </div>
                                <Button onClick={onSendMessage} disabled={!input.trim() || isLoading} size="icon">
                                        <Send className="h-4 w-4" />
                                </Button>
                        </div>
                </div>
        );
}
