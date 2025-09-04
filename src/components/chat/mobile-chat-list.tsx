/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Trash2 } from 'lucide-react';

interface ChatSession {
        _id: string;
        title: string;
        lastMessage: string;
        timestamp: Date;
        messages: any[];
}

interface MobileChatListProps {
        chatSessions: ChatSession[];
        currentSession: ChatSession | null;
        searchQuery: string;
        setSearchQuery: (query: string) => void;
        onCreateNewChat: () => void;
        onSelectChat: (session: ChatSession) => void;
        onDeleteChat: (sessionId: string) => void;
        getLastMessagePreview: (session: ChatSession) => string;
        formatDate: (date: Date) => string;
}

export function MobileChatList({
        chatSessions,
        currentSession,
        searchQuery,
        setSearchQuery,
        onCreateNewChat,
        onSelectChat,
        onDeleteChat,
        getLastMessagePreview,
        formatDate,
}: MobileChatListProps) {
        const filteredChatSessions = chatSessions.filter((session) =>
                session.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        return (
                <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b bg-background">
                                <div className="flex items-center justify-between mb-3">
                                        <h1 className="text-xl font-semibold">Chats</h1>
                                        <Button onClick={onCreateNewChat} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Chat
                                        </Button>
                                </div>
                                <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                                placeholder="Search chats..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9 h-10 border-primary/50"
                                        />
                                </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto">
                                {filteredChatSessions.length === 0 && searchQuery ? (
                                        <div className="p-4 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                        No chats found matching &quot;{searchQuery}&quot;
                                                </p>
                                        </div>
                                ) : (
                                        filteredChatSessions.map((chatSession) => (
                                                <div
                                                        key={chatSession._id}
                                                        className={`p-4 border-b cursor-pointer hover:bg-muted/20 transition-colors ${
                                                                currentSession?._id === chatSession._id
                                                                        ? 'bg-primary/10 border-primary/20 border-l-4 border-l-primary/40'
                                                                        : ''
                                                        }`}
                                                        onClick={() => onSelectChat(chatSession)}
                                                >
                                                        <div className="flex items-center justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                        <h3
                                                                                className={`font-medium text-sm truncate mb-1 ${
                                                                                        currentSession?._id ===
                                                                                        chatSession._id
                                                                                                ? 'text-primary/80 font-semibold'
                                                                                                : ''
                                                                                }`}
                                                                        >
                                                                                {chatSession.title}
                                                                        </h3>
                                                                        <p className="text-xs text-muted-foreground truncate">
                                                                                {getLastMessagePreview(chatSession)}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                                {formatDate(chatSession.timestamp)}
                                                                        </p>
                                                                </div>
                                                                <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0"
                                                                                        onClick={(e) =>
                                                                                                e.stopPropagation()
                                                                                        }
                                                                                >
                                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                                </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent
                                                                                align="end"
                                                                                className="w-48"
                                                                        >
                                                                                <DropdownMenuItem
                                                                                        onClick={() =>
                                                                                                onDeleteChat(
                                                                                                        chatSession._id,
                                                                                                )
                                                                                        }
                                                                                        className="text-destructive"
                                                                                >
                                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                                        Delete Chat
                                                                                </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                </DropdownMenu>
                                                        </div>
                                                </div>
                                        ))
                                )}
                        </div>
                </div>
        );
}
