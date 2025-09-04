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
import { Plus, Search, MoreHorizontal, Trash2, Send } from 'lucide-react';
import { DeleteDialog } from '@/components/delete-dialog';

interface ChatSession {
        _id: string;
        title: string;
        lastMessage: string;
        timestamp: Date;
        messages: any[];
}

interface ChatSidebarProps {
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

export function ChatSidebar({
        chatSessions,
        currentSession,
        searchQuery,
        setSearchQuery,
        onCreateNewChat,
        onSelectChat,
        onDeleteChat,
        getLastMessagePreview,
        formatDate,
}: ChatSidebarProps) {
        const filteredChatSessions = chatSessions.filter((session) =>
                session.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        return (
                <div className="w-80 border-r bg-muted/30 flex flex-col">
                        <div className="p-4 border-b space-y-3">
                                <Button onClick={onCreateNewChat} className="w-full" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Chat
                                </Button>
                                <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                                placeholder="Search chats..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9 h-8 text-sm border-primary/50"
                                        />
                                </div>
                        </div>

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
                                                        className={`p-4 border-b cursor-pointer hover:bg-primary/20 transition-colors group ${
                                                                currentSession?._id === chatSession._id
                                                                        ? 'bg-primary/10 border-primary/20 border-l-4 border-l-primary/40'
                                                                        : ''
                                                        }`}
                                                        onClick={() => onSelectChat(chatSession)}
                                                >
                                                        <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                        <h3
                                                                                className={`font-medium text-sm truncate ${
                                                                                        currentSession?._id ===
                                                                                        chatSession._id
                                                                                                ? 'text-primary/80 font-semibold'
                                                                                                : ''
                                                                                }`}
                                                                        >
                                                                                {chatSession.title}
                                                                        </h3>
                                                                        <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                                onClick={(e) =>
                                                                                                        e.stopPropagation()
                                                                                                }
                                                                                        >
                                                                                                <MoreHorizontal className="h-3 w-3" />
                                                                                        </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                        <DeleteDialog
                                                                                                title="Delete Chat"
                                                                                                description={`Are you sure you want to delete "${chatSession.title}"? This action will delete all messages in the chat and cannot be undone.`}
                                                                                                onDelete={() =>
                                                                                                        onDeleteChat(
                                                                                                                chatSession._id,
                                                                                                        )
                                                                                                }
                                                                                                trigger={
                                                                                                        <DropdownMenuItem
                                                                                                                onSelect={(
                                                                                                                        e,
                                                                                                                ) =>
                                                                                                                        e.preventDefault()
                                                                                                                }
                                                                                                                className="cursor-pointer text-destructive"
                                                                                                        >
                                                                                                                <Trash2 className="h-4 w-4 mr-2 hover:text-white" />
                                                                                                                Delete
                                                                                                                Chat
                                                                                                        </DropdownMenuItem>
                                                                                                }
                                                                                        />
                                                                                </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                </div>

                                                                <div className="mt-1">
                                                                        {chatSession.messages.length > 0 ? (
                                                                                <div className="flex items-center space-x-1">
                                                                                        {chatSession.messages[
                                                                                                chatSession.messages
                                                                                                        .length - 1
                                                                                        ].role === 'assistant' ? (
                                                                                                <>
                                                                                                        <span className="text-xs text-muted-foreground font-bold">
                                                                                                                Bot:
                                                                                                        </span>
                                                                                                        <p className="text-xs font-bold text-muted-foreground truncate flex-1">
                                                                                                                {getLastMessagePreview(
                                                                                                                        chatSession,
                                                                                                                )}
                                                                                                        </p>
                                                                                                </>
                                                                                        ) : (
                                                                                                <>
                                                                                                        <span className="text-xs text-muted-foreground">
                                                                                                                Me:
                                                                                                        </span>
                                                                                                        <p className="text-xs text-muted-foreground truncate flex-1">
                                                                                                                {getLastMessagePreview(
                                                                                                                        chatSession,
                                                                                                                )}
                                                                                                        </p>
                                                                                                        <Send className="h-3 w-3 text-muted-foreground" />
                                                                                                </>
                                                                                        )}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="flex items-center space-x-1">
                                                                                        <span className="text-xs text-muted-foreground font-bold">
                                                                                                Bot:
                                                                                        </span>
                                                                                        <p className="text-xs font-bold text-muted-foreground truncate flex-1">
                                                                                                {
                                                                                                        chatSession.lastMessage
                                                                                                }
                                                                                        </p>
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                        {formatDate(chatSession.timestamp)}
                                                                </p>
                                                        </div>
                                                </div>
                                        ))
                                )}
                        </div>
                </div>
        );
}
