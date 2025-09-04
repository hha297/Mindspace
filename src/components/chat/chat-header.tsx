'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit3, MoreVertical, RotateCcw, Trash2, ArrowLeft } from 'lucide-react';
import { DeleteDialog } from '@/components/delete-dialog';

interface ChatHeaderProps {
        session: any;
        editingSessionId: string | null;
        editingTitle: string;
        setEditingTitle: (title: string) => void;
        onStartEditing: (session: any) => void;
        onSaveTitle: () => void;
        onCancelEditing: () => void;
        onDeleteChat: (sessionId: string) => void;
        onGoBack?: () => void;
        isMobile?: boolean;
}

export function ChatHeader({
        session,
        editingSessionId,
        editingTitle,
        setEditingTitle,
        onStartEditing,
        onSaveTitle,
        onCancelEditing,
        onDeleteChat,
        onGoBack,
        isMobile = false,
}: ChatHeaderProps) {
        const handleKeyPress = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter') onSaveTitle();
                if (e.key === 'Escape') onCancelEditing();
        };

        return (
                <div className="p-4 border-b bg-background">
                        <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                        {isMobile && onGoBack && (
                                                <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={onGoBack}
                                                        className="h-8 w-8 p-0"
                                                >
                                                        <ArrowLeft className="h-4 w-4" />
                                                </Button>
                                        )}
                                        <div className="flex-1">
                                                {editingSessionId === session._id ? (
                                                        <div className="flex items-center space-x-2">
                                                                <Input
                                                                        value={editingTitle}
                                                                        onChange={(e) =>
                                                                                setEditingTitle(e.target.value)
                                                                        }
                                                                        onKeyPress={handleKeyPress}
                                                                        className="text-lg font-semibold h-8 px-2 border-primary/50"
                                                                        autoFocus
                                                                />
                                                                <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={onSaveTitle}
                                                                        className="h-8 w-8 p-0"
                                                                >
                                                                        <RotateCcw className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={onCancelEditing}
                                                                        className="h-8 px-2"
                                                                >
                                                                        <span className="text-sm">Cancel</span>
                                                                </Button>
                                                        </div>
                                                ) : (
                                                        <>
                                                                <h2 className="text-lg font-semibold truncate">
                                                                        {session.title}
                                                                </h2>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Mental Health Support Chat
                                                                </p>
                                                        </>
                                                )}
                                        </div>
                                </div>
                                {editingSessionId !== session._id && (
                                        <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => onStartEditing(session)}>
                                                                <Edit3 className="h-4 w-4 mr-2 hover:text-white" />
                                                                Rename
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                                onClick={() => onDeleteChat(session._id)}
                                                                className="text-destructive"
                                                        >
                                                                <Trash2 className="h-4 w-4 mr-2 hover:text-white" />
                                                                Delete
                                                        </DropdownMenuItem>
                                                </DropdownMenuContent>
                                        </DropdownMenu>
                                )}
                        </div>
                </div>
        );
}
