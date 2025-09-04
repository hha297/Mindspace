'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
        Send,
        Bot,
        User,
        Loader2,
        MessageSquare,
        Plus,
        Trash2,
        Edit3,
        RotateCcw,
        MoreHorizontal,
        Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { DeleteDialog } from '@/components/delete-dialog';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Image from 'next/image';

interface Message {
        id: string;
        content: string;
        role: 'user' | 'assistant';
        timestamp: Date;
}

interface ChatSession {
        _id: string;
        title: string;
        lastMessage: string;
        timestamp: Date;
        messages: Message[];
}

interface ApiChatSession {
        _id: string;
        title: string;
        lastMessage: string;
        createdAt: string;
        updatedAt: string;
}

interface ApiMessage {
        id: string;
        content: string;
        role: 'user' | 'assistant';
        timestamp: string;
}

interface ApiChatSessionDetail {
        _id: string;
        title: string;
        lastMessage: string;
        messages: ApiMessage[];
        createdAt: string;
        updatedAt: string;
}

export default function ChatPage() {
        const { data: session } = useSession();
        const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
        const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
        const [input, setInput] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadingSessions, setIsLoadingSessions] = useState(true);
        const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
        const [editingTitle, setEditingTitle] = useState('');
        const [searchQuery, setSearchQuery] = useState('');
        const messagesEndRef = useRef<HTMLDivElement>(null);

        // Load chat sessions from database
        useEffect(() => {
                if (session?.user?.email) {
                        loadChatSessions();
                }
        }, [session]);

        const loadChatSessions = async () => {
                try {
                        const response = await fetch('/api/chat/sessions');
                        if (response.ok) {
                                const data = await response.json();
                                const sessions = data.sessions.map((session: ApiChatSession) => ({
                                        _id: session._id,
                                        title: session.title,
                                        lastMessage: session.lastMessage,
                                        timestamp: new Date(session.updatedAt),
                                        messages: [], // We'll load messages when selecting a session
                                }));
                                setChatSessions(sessions);

                                // If no sessions exist, create a default one
                                if (sessions.length === 0) {
                                        await createNewChat();
                                } else {
                                        // Load the first session
                                        await loadChatSession(sessions[0]._id);
                                }
                        }
                } catch (error) {
                        console.error('Error loading chat sessions:', error);
                        toast.error('Failed to load chat sessions');
                } finally {
                        setIsLoadingSessions(false);
                }
        };

        const loadChatSession = async (sessionId: string) => {
                try {
                        const response = await fetch(`/api/chat/sessions/${sessionId}`);
                        if (response.ok) {
                                const data = await response.json();
                                const session = data.session as ApiChatSessionDetail;
                                setCurrentSession({
                                        _id: session._id,
                                        title: session.title,
                                        lastMessage: session.lastMessage,
                                        timestamp: new Date(session.updatedAt),
                                        messages: session.messages.map((msg: ApiMessage) => ({
                                                ...msg,
                                                timestamp: new Date(msg.timestamp),
                                        })),
                                });
                        }
                } catch (error) {
                        console.error('Error loading chat session:', error);
                        toast.error('Failed to load chat session');
                }
        };

        useEffect(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [currentSession?.messages]);

        const createNewChat = async () => {
                const newSession: ChatSession = {
                        _id: 'temp-' + Date.now(),
                        title: 'New Chat',
                        lastMessage:
                                "Hello! I'm here to support you with your mental health. How are you feeling today?",
                        timestamp: new Date(),
                        messages: [
                                {
                                        id: '1',
                                        content: "Hello! I'm here to support you with your mental health. How are you feeling today?",
                                        role: 'assistant',
                                        timestamp: new Date(),
                                },
                        ],
                };

                try {
                        const response = await fetch('/api/chat/sessions', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        title: newSession.title,
                                        lastMessage: newSession.lastMessage,
                                        messages: newSession.messages,
                                }),
                        });

                        if (response.ok) {
                                const data = await response.json();
                                const savedSession = {
                                        ...newSession,
                                        _id: data.session._id,
                                };
                                setChatSessions((prev) => [savedSession, ...prev]);
                                setCurrentSession(savedSession);
                        }
                } catch (error) {
                        console.error('Error creating new chat:', error);
                        toast.error('Failed to create new chat');
                }
        };

        const selectChat = async (session: ChatSession) => {
                await loadChatSession(session._id);
        };

        const deleteChat = async (sessionId: string) => {
                try {
                        const response = await fetch(`/api/chat/sessions/${sessionId}`, {
                                method: 'DELETE',
                        });

                        if (response.ok) {
                                setChatSessions((prev) => prev.filter((session) => session._id !== sessionId));
                                if (currentSession?._id === sessionId) {
                                        const remainingSessions = chatSessions.filter(
                                                (session) => session._id !== sessionId,
                                        );
                                        if (remainingSessions.length > 0) {
                                                await loadChatSession(remainingSessions[0]._id);
                                        } else {
                                                setCurrentSession(null);
                                        }
                                }
                                toast.success('Chat deleted successfully');
                        }
                } catch (error) {
                        console.error('Error deleting chat:', error);
                        toast.error('Failed to delete chat');
                }
        };

        const startEditing = (session: ChatSession) => {
                setEditingSessionId(session._id);
                setEditingTitle(session.title);
        };

        const saveTitle = async () => {
                if (!editingSessionId || !editingTitle.trim()) return;

                try {
                        const response = await fetch(`/api/chat/sessions/${editingSessionId}`, {
                                method: 'PATCH',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        title: editingTitle.trim(),
                                }),
                        });

                        if (response.ok) {
                                setChatSessions((prev) =>
                                        prev.map((session) =>
                                                session._id === editingSessionId
                                                        ? { ...session, title: editingTitle.trim() }
                                                        : session,
                                        ),
                                );
                                if (currentSession?._id === editingSessionId) {
                                        setCurrentSession((prev) =>
                                                prev ? { ...prev, title: editingTitle.trim() } : null,
                                        );
                                }
                                toast.success('Chat title updated');
                        }
                } catch (error) {
                        console.error('Error updating chat title:', error);
                        toast.error('Failed to update chat title');
                } finally {
                        setEditingSessionId(null);
                        setEditingTitle('');
                }
        };

        const cancelEditing = () => {
                setEditingSessionId(null);
                setEditingTitle('');
        };

        const updateChatSession = async (session: ChatSession) => {
                try {
                        const response = await fetch(`/api/chat/sessions/${session._id}`, {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        title: session.title,
                                        lastMessage: session.lastMessage,
                                        messages: session.messages,
                                }),
                        });

                        if (!response.ok) {
                                throw new Error('Failed to update chat session');
                        }
                } catch (error) {
                        console.error('Error updating chat session:', error);
                        toast.error('Failed to save chat');
                }
        };

        const sendMessage = async () => {
                if (!input.trim() || isLoading || !currentSession) return;

                const userMessage: Message = {
                        id: Date.now().toString(),
                        content: input.trim(),
                        role: 'user',
                        timestamp: new Date(),
                };

                // Update current session
                const updatedSession = {
                        ...currentSession,
                        messages: [...currentSession.messages, userMessage],
                        lastMessage: input.trim(),
                        timestamp: new Date(),
                };

                setCurrentSession(updatedSession);
                setChatSessions((prev) =>
                        prev.map((session) => (session._id === currentSession._id ? updatedSession : session)),
                );
                setInput('');
                setIsLoading(true);

                try {
                        const response = await fetch('/api/chat', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        message: userMessage.content,
                                }),
                        });

                        if (!response.ok) {
                                throw new Error('Failed to get response');
                        }

                        const data = await response.json();

                        const assistantMessage: Message = {
                                id: (Date.now() + 1).toString(),
                                content: data.response,
                                role: 'assistant',
                                timestamp: new Date(),
                        };

                        // Update session with assistant message
                        const finalSession = {
                                ...updatedSession,
                                messages: [...updatedSession.messages, assistantMessage],
                                lastMessage: data.response.substring(0, 50) + '...',
                                timestamp: new Date(),
                        };

                        setCurrentSession(finalSession);
                        setChatSessions((prev) =>
                                prev.map((session) => (session._id === currentSession._id ? finalSession : session)),
                        );

                        // Save to database
                        await updateChatSession(finalSession);
                } catch (error) {
                        console.error('Error sending message:', error);
                        toast.error('Failed to send message. Please try again.');

                        const errorMessage: Message = {
                                id: (Date.now() + 1).toString(),
                                content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
                                role: 'assistant',
                                timestamp: new Date(),
                        };

                        const finalSession = {
                                ...updatedSession,
                                messages: [...updatedSession.messages, errorMessage],
                                lastMessage: errorMessage.content.substring(0, 50) + '...',
                                timestamp: new Date(),
                        };

                        setCurrentSession(finalSession);
                        setChatSessions((prev) =>
                                prev.map((session) => (session._id === currentSession._id ? finalSession : session)),
                        );

                        // Save to database
                        await updateChatSession(finalSession);
                } finally {
                        setIsLoading(false);
                }
        };

        const handleKeyPress = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                }
        };

        const formatTime = (date: Date) => {
                return date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                });
        };

        const formatDate = (date: Date) => {
                const now = new Date();
                const diff = now.getTime() - date.getTime();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const timeString = date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                });

                if (days === 0) return `Today at ${timeString}`;
                if (days === 1) return `Yesterday at ${timeString}`;
                if (days < 7) return `${days} days ago at ${timeString}`;
                return `${date.toLocaleDateString()} at ${timeString}`;
        };

        const getLastMessagePreview = (session: ChatSession) => {
                if (session.messages.length === 0) return session.lastMessage;

                const lastMessage = session.messages[session.messages.length - 1];
                if (lastMessage.role === 'assistant') {
                        return lastMessage.content.substring(0, 30) + '...';
                } else {
                        return lastMessage.content.substring(0, 30) + '...';
                }
        };

        const filteredChatSessions = chatSessions.filter((session) =>
                session.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        if (isLoadingSessions) {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                                        <div className="text-center">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-muted-foreground">Loading chat sessions...</p>
                                        </div>
                                </div>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-background">
                        <Navbar />

                        <div className="flex h-[calc(100vh-64px)]">
                                {/* Sidebar - Chat History */}
                                <div className="w-80 border-r bg-muted/30 flex flex-col">
                                        <div className="p-4 border-b space-y-3">
                                                <Button onClick={createNewChat} className="w-full" size="sm">
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        New Chat
                                                </Button>
                                                <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                                placeholder="Search chats..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                className="pl-9 h-8 text-sm"
                                                        />
                                                </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto">
                                                {filteredChatSessions.length === 0 && searchQuery ? (
                                                        <div className="p-4 text-center">
                                                                <p className="text-sm text-muted-foreground">
                                                                        No chats found matching &quot;{searchQuery}
                                                                        &quot;
                                                                </p>
                                                        </div>
                                                ) : (
                                                        filteredChatSessions.map((chatSession) => (
                                                                <div
                                                                        key={chatSession._id}
                                                                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors group ${
                                                                                currentSession?._id === chatSession._id
                                                                                        ? 'bg-muted'
                                                                                        : ''
                                                                        }`}
                                                                        onClick={() => selectChat(chatSession)}
                                                                >
                                                                        <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center justify-between">
                                                                                        <h3 className="font-medium text-sm truncate">
                                                                                                {chatSession.title}
                                                                                        </h3>
                                                                                        <DropdownMenu>
                                                                                                <DropdownMenuTrigger
                                                                                                        asChild
                                                                                                >
                                                                                                        <Button
                                                                                                                variant="ghost"
                                                                                                                size="sm"
                                                                                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                                                onClick={(
                                                                                                                        e,
                                                                                                                ) =>
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
                                                                                                                        deleteChat(
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

                                                                                {/* Message preview with role indicators */}
                                                                                <div className="mt-1">
                                                                                        {chatSession.messages.length >
                                                                                        0 ? (
                                                                                                <div className="flex items-center space-x-1">
                                                                                                        {chatSession
                                                                                                                .messages[
                                                                                                                chatSession
                                                                                                                        .messages
                                                                                                                        .length -
                                                                                                                        1
                                                                                                        ].role ===
                                                                                                        'assistant' ? (
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
                                                                                        {formatDate(
                                                                                                chatSession.timestamp,
                                                                                        )}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        ))
                                                )}
                                        </div>
                                </div>

                                {/* Main Chat Area */}
                                <div className="flex-1 flex flex-col">
                                        {currentSession ? (
                                                <>
                                                        {/* Chat Header */}
                                                        <div className="p-4 border-b bg-background">
                                                                <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                                {editingSessionId ===
                                                                                currentSession._id ? (
                                                                                        <div className="flex items-center space-x-2">
                                                                                                <Input
                                                                                                        value={
                                                                                                                editingTitle
                                                                                                        }
                                                                                                        onChange={(e) =>
                                                                                                                setEditingTitle(
                                                                                                                        e
                                                                                                                                .target
                                                                                                                                .value,
                                                                                                                )
                                                                                                        }
                                                                                                        onKeyPress={(
                                                                                                                e,
                                                                                                        ) => {
                                                                                                                if (
                                                                                                                        e.key ===
                                                                                                                        'Enter'
                                                                                                                )
                                                                                                                        saveTitle();
                                                                                                                if (
                                                                                                                        e.key ===
                                                                                                                        'Escape'
                                                                                                                )
                                                                                                                        cancelEditing();
                                                                                                        }}
                                                                                                        className="text-lg font-semibold h-8 px-2 w-48 border-primary/50"
                                                                                                        autoFocus
                                                                                                />
                                                                                                <Button
                                                                                                        size="sm"
                                                                                                        variant="ghost"
                                                                                                        onClick={
                                                                                                                saveTitle
                                                                                                        }
                                                                                                        className="h-8 w-8 p-0"
                                                                                                >
                                                                                                        <RotateCcw className="h-4 w-4" />
                                                                                                </Button>
                                                                                                <Button
                                                                                                        size="sm"
                                                                                                        variant="ghost"
                                                                                                        onClick={
                                                                                                                cancelEditing
                                                                                                        }
                                                                                                        className="h-8 px-2"
                                                                                                >
                                                                                                        <span className="text-sm">
                                                                                                                Cancel
                                                                                                        </span>
                                                                                                </Button>
                                                                                        </div>
                                                                                ) : (
                                                                                        <div className="flex items-center space-x-2 group">
                                                                                                <h2 className="text-lg font-semibold">
                                                                                                        {
                                                                                                                currentSession.title
                                                                                                        }
                                                                                                </h2>
                                                                                                <Button
                                                                                                        size="sm"
                                                                                                        variant="ghost"
                                                                                                        onClick={() =>
                                                                                                                startEditing(
                                                                                                                        currentSession,
                                                                                                                )
                                                                                                        }
                                                                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                                >
                                                                                                        <Edit3 className="h-4 w-4" />
                                                                                                </Button>
                                                                                        </div>
                                                                                )}
                                                                                <p className="text-sm text-muted-foreground">
                                                                                        Mental Health Support Chat
                                                                                </p>
                                                                        </div>

                                                                        {/* Delete button on the right */}
                                                                        {editingSessionId !== currentSession._id && (
                                                                                <DeleteDialog
                                                                                        title="Delete Chat"
                                                                                        description={`Are you sure you want to delete "${currentSession.title}"? This action will delete all messages in the chat and cannot be undone.`}
                                                                                        onDelete={() =>
                                                                                                deleteChat(
                                                                                                        currentSession._id,
                                                                                                )
                                                                                        }
                                                                                        trigger={
                                                                                                <Button
                                                                                                        size="sm"
                                                                                                        variant="destructive"
                                                                                                >
                                                                                                        <Trash2 className="h-4 w-4 mr-2 hover:text-white" />
                                                                                                        Delete
                                                                                                </Button>
                                                                                        }
                                                                                />
                                                                        )}
                                                                </div>
                                                        </div>

                                                        {/* Messages Area */}
                                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                                {currentSession.messages.map((message) => (
                                                                        <div
                                                                                key={message.id}
                                                                                className={`flex ${
                                                                                        message.role === 'user'
                                                                                                ? 'justify-end'
                                                                                                : 'justify-start'
                                                                                }`}
                                                                        >
                                                                                <div
                                                                                        className={`flex items-start space-x-2 max-w-[80%] ${
                                                                                                message.role === 'user'
                                                                                                        ? 'flex-row-reverse space-x-reverse'
                                                                                                        : ''
                                                                                        }`}
                                                                                >
                                                                                        <div
                                                                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                                                                        message.role ===
                                                                                                        'user'
                                                                                                                ? 'bg-primary text-primary-foreground'
                                                                                                                : 'bg-muted text-muted-foreground'
                                                                                                }`}
                                                                                        >
                                                                                                {message.role ===
                                                                                                'user' ? (
                                                                                                        session?.user
                                                                                                                ?.image ? (
                                                                                                                <Image
                                                                                                                        width={
                                                                                                                                32
                                                                                                                        }
                                                                                                                        height={
                                                                                                                                32
                                                                                                                        }
                                                                                                                        src={
                                                                                                                                session
                                                                                                                                        .user
                                                                                                                                        .image
                                                                                                                        }
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
                                                                                                className={`rounded-lg px-4 py-2 ${
                                                                                                        message.role ===
                                                                                                        'user'
                                                                                                                ? 'bg-primary text-primary-foreground'
                                                                                                                : 'bg-muted text-foreground'
                                                                                                }`}
                                                                                        >
                                                                                                <p className="text-sm whitespace-pre-wrap">
                                                                                                        {
                                                                                                                message.content
                                                                                                        }
                                                                                                </p>
                                                                                                <p className="text-xs opacity-70 mt-1">
                                                                                                        {formatTime(
                                                                                                                message.timestamp,
                                                                                                        )}
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                ))}

                                                                {isLoading && (
                                                                        <div className="flex justify-start">
                                                                                <div className="flex items-start space-x-2">
                                                                                        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                                                                                <Bot className="h-4 w-4" />
                                                                                        </div>
                                                                                        <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                                                                                                <div className="flex items-center space-x-2">
                                                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                                                        <span className="text-sm">
                                                                                                                Typing...
                                                                                                        </span>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                )}
                                                                <div ref={messagesEndRef} />
                                                        </div>

                                                        {/* Input Area */}
                                                        <div className="p-4 border-t bg-background">
                                                                <div className="flex space-x-2">
                                                                        <div className="relative flex-1">
                                                                                <Input
                                                                                        value={input}
                                                                                        onChange={(e) =>
                                                                                                setInput(e.target.value)
                                                                                        }
                                                                                        onKeyPress={handleKeyPress}
                                                                                        placeholder="Type your message..."
                                                                                        disabled={isLoading}
                                                                                        className="flex-1"
                                                                                />
                                                                        </div>
                                                                        <Button
                                                                                onClick={sendMessage}
                                                                                disabled={!input.trim() || isLoading}
                                                                                size="icon"
                                                                        >
                                                                                <Send className="h-4 w-4" />
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </>
                                        ) : (
                                                <div className="flex-1 flex items-center justify-center">
                                                        <div className="text-center">
                                                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                                <h3 className="text-lg font-medium mb-2">
                                                                        No chat selected
                                                                </h3>
                                                                <p className="text-muted-foreground">
                                                                        Select a chat from the sidebar or create a new
                                                                        one
                                                                </p>
                                                        </div>
                                                </div>
                                        )}
                                </div>
                        </div>
                </div>
        );
}
