'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// Chat Components
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { MobileChatList } from '@/components/chat/mobile-chat-list';

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

function ChatPageContent() {
        const { data: session, status } = useSession();
        const router = useRouter();
        const searchParams = useSearchParams();
        const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
        const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
        const [input, setInput] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadingSessions, setIsLoadingSessions] = useState(true);
        const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
        const [editingTitle, setEditingTitle] = useState('');
        const [searchQuery, setSearchQuery] = useState('');
        const [isMobileView, setIsMobileView] = useState(false);
        const [showChatList, setShowChatList] = useState(true);

        // Check authentication status
        useEffect(() => {
                if (status === 'unauthenticated') {
                        router.push('/sign-in');
                }
        }, [status, router]);

        // Detect mobile view
        useEffect(() => {
                const checkMobile = () => {
                        setIsMobileView(window.innerWidth < 768);
                };

                checkMobile();
                window.addEventListener('resize', checkMobile);

                return () => window.removeEventListener('resize', checkMobile);
        }, []);

        const createNewChat = useCallback(async () => {
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

                                // Update URL immediately with new chat info
                                const params = new URLSearchParams(searchParams);
                                params.set('chatId', savedSession._id);
                                params.set('chatName', savedSession.title);
                                router.replace(`/chat?${params.toString()}`, { scroll: false });
                        }
                } catch (error) {
                        console.error('Error creating new chat:', error);
                        toast.error('Failed to create new chat');
                }
        }, [searchParams, router]);

        // Load chat sessions from database
        useEffect(() => {
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
                                        }
                                }
                        } catch (error) {
                                console.error('Error loading chat sessions:', error);
                                toast.error('Failed to load chat sessions');
                        } finally {
                                setIsLoadingSessions(false);
                        }
                };

                if (session?.user?.email) {
                        loadChatSessions();
                }
        }, [session?.user?.email, createNewChat]); // Include createNewChat in dependencies

        // Handle URL params on initial load
        useEffect(() => {
                if (!isLoadingSessions && chatSessions.length > 0) {
                        const chatIdParam = searchParams.get('chatId');
                        if (chatIdParam) {
                                const targetSession = chatSessions.find((s: ChatSession) => s._id === chatIdParam);
                                if (targetSession) {
                                        loadChatSession(targetSession._id);
                                } else {
                                        // Load the first session if chatId not found
                                        loadChatSession(chatSessions[0]._id);
                                        const params = new URLSearchParams(searchParams);
                                        params.set('chatId', chatSessions[0]._id);
                                        params.set('chatName', chatSessions[0].title);
                                        router.replace(`/chat?${params.toString()}`, { scroll: false });
                                }
                        } else {
                                // Load the first session and update URL
                                loadChatSession(chatSessions[0]._id);
                                const params = new URLSearchParams(searchParams);
                                params.set('chatId', chatSessions[0]._id);
                                params.set('chatName', chatSessions[0].title);
                                router.replace(`/chat?${params.toString()}`, { scroll: false });
                        }
                }
        }, [isLoadingSessions, chatSessions, searchParams, router]);

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

        const selectChat = async (session: ChatSession) => {
                await loadChatSession(session._id);
                // Update URL with chat info
                const params = new URLSearchParams(searchParams);
                params.set('chatId', session._id);
                params.set('chatName', session.title);
                router.push(`/chat?${params.toString()}`, { scroll: false });

                if (isMobileView) {
                        setShowChatList(false);
                }
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
                                                // Update URL with remaining chat info
                                                const params = new URLSearchParams(searchParams);
                                                params.set('chatId', remainingSessions[0]._id);
                                                params.set('chatName', remainingSessions[0].title);
                                                router.replace(`/chat?${params.toString()}`, { scroll: false });
                                        } else {
                                                setCurrentSession(null);
                                                // Clear URL params if no chats left
                                                const params = new URLSearchParams(searchParams);
                                                params.delete('chatId');
                                                params.delete('chatName');
                                                router.replace(`/chat?${params.toString()}`, { scroll: false });
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

        const goBackToChatList = () => {
                setShowChatList(true);
                setCurrentSession(null);
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

        // Show loading while checking authentication
        if (status === 'loading') {
                return (
                        <div className="min-h-screen bg-background">
                                <Navbar />
                                <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                                        <div className="text-center">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-muted-foreground">Checking authentication...</p>
                                        </div>
                                </div>
                        </div>
                );
        }

        // Redirect if not authenticated
        if (status === 'unauthenticated') {
                return null; // Will redirect via useEffect
        }

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

                        {isMobileView ? (
                                // Mobile View
                                <div className="h-[calc(100vh-64px)]">
                                        {showChatList ? (
                                                <MobileChatList
                                                        chatSessions={chatSessions}
                                                        currentSession={currentSession}
                                                        searchQuery={searchQuery}
                                                        setSearchQuery={setSearchQuery}
                                                        onCreateNewChat={createNewChat}
                                                        onSelectChat={selectChat}
                                                        onDeleteChat={deleteChat}
                                                        getLastMessagePreview={getLastMessagePreview}
                                                        formatDate={formatDate}
                                                />
                                        ) : (
                                                // Individual Chat View
                                                <div className="h-full flex flex-col">
                                                        {currentSession && (
                                                                <>
                                                                        <ChatHeader
                                                                                session={currentSession}
                                                                                editingSessionId={editingSessionId}
                                                                                editingTitle={editingTitle}
                                                                                setEditingTitle={setEditingTitle}
                                                                                onStartEditing={startEditing}
                                                                                onSaveTitle={saveTitle}
                                                                                onCancelEditing={cancelEditing}
                                                                                onDeleteChat={deleteChat}
                                                                                onGoBack={goBackToChatList}
                                                                                isMobile={true}
                                                                        />

                                                                        <ChatMessages
                                                                                messages={currentSession.messages}
                                                                                isLoading={isLoading}
                                                                                userImage={session?.user?.image}
                                                                        />

                                                                        <ChatInput
                                                                                input={input}
                                                                                setInput={setInput}
                                                                                onSendMessage={sendMessage}
                                                                                isLoading={isLoading}
                                                                        />
                                                                </>
                                                        )}
                                                </div>
                                        )}
                                </div>
                        ) : (
                                // Desktop View
                                <div className="flex h-[calc(100vh-64px)]">
                                        <ChatSidebar
                                                chatSessions={chatSessions}
                                                currentSession={currentSession}
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                                onCreateNewChat={createNewChat}
                                                onSelectChat={selectChat}
                                                onDeleteChat={deleteChat}
                                                getLastMessagePreview={getLastMessagePreview}
                                                formatDate={formatDate}
                                        />

                                        {/* Main Chat Area */}
                                        <div className="flex-1 flex flex-col">
                                                {currentSession ? (
                                                        <>
                                                                <ChatHeader
                                                                        session={currentSession}
                                                                        editingSessionId={editingSessionId}
                                                                        editingTitle={editingTitle}
                                                                        setEditingTitle={setEditingTitle}
                                                                        onStartEditing={startEditing}
                                                                        onSaveTitle={saveTitle}
                                                                        onCancelEditing={cancelEditing}
                                                                        onDeleteChat={deleteChat}
                                                                />

                                                                <ChatMessages
                                                                        messages={currentSession.messages}
                                                                        isLoading={isLoading}
                                                                        userImage={session?.user?.image}
                                                                />

                                                                <ChatInput
                                                                        input={input}
                                                                        setInput={setInput}
                                                                        onSendMessage={sendMessage}
                                                                        isLoading={isLoading}
                                                                />
                                                        </>
                                                ) : (
                                                        <div className="flex-1 flex items-center justify-center">
                                                                <div className="text-center">
                                                                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                                        <h3 className="text-lg font-medium mb-2">
                                                                                No chat selected
                                                                        </h3>
                                                                        <p className="text-muted-foreground">
                                                                                Select a chat from the sidebar or create
                                                                                a new one
                                                                        </p>
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        )}
                </div>
        );
}

export default function ChatPage() {
        return (
                <Suspense
                        fallback={
                                <div className="min-h-screen bg-background">
                                        <Navbar />
                                        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                                                <div className="text-center">
                                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                                        <p className="text-muted-foreground">Loading chat...</p>
                                                </div>
                                        </div>
                                </div>
                        }
                >
                        <ChatPageContent />
                </Suspense>
        );
}
