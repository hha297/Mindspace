import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import ChatSession from '@/lib/models/ChatSession';
import User from '@/lib/models/User';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        try {
                const { id } = await params;
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const chatSession = await ChatSession.findOne({
                        _id: id,
                        userId: user._id,
                });

                if (!chatSession) {
                        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
                }

                return NextResponse.json({ session: chatSession });
        } catch (error) {
                console.error('Error fetching chat session:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        try {
                const { id } = await params;
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { title, lastMessage, messages } = await request.json();

                if (!title || !lastMessage || !messages) {
                        return NextResponse.json(
                                { error: 'Title, lastMessage, and messages are required' },
                                { status: 400 },
                        );
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const chatSession = await ChatSession.findOneAndUpdate(
                        {
                                _id: id,
                                userId: user._id,
                        },
                        {
                                title,
                                lastMessage,
                                messages,
                        },
                        { new: true },
                );

                if (!chatSession) {
                        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
                }

                return NextResponse.json({ session: chatSession });
        } catch (error) {
                console.error('Error updating chat session:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        try {
                const { id } = await params;
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { title } = await request.json();

                if (!title) {
                        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const chatSession = await ChatSession.findOneAndUpdate(
                        {
                                _id: id,
                                userId: user._id,
                        },
                        {
                                title,
                        },
                        { new: true },
                );

                if (!chatSession) {
                        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
                }

                return NextResponse.json({ session: chatSession });
        } catch (error) {
                console.error('Error updating chat title:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        try {
                const { id } = await params;
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const chatSession = await ChatSession.findOneAndDelete({
                        _id: id,
                        userId: user._id,
                });

                if (!chatSession) {
                        return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
                }

                return NextResponse.json({ message: 'Chat session deleted successfully' });
        } catch (error) {
                console.error('Error deleting chat session:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
