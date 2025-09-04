import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import ChatSession from '@/lib/models/ChatSession';
import User from '@/lib/models/User';

export async function GET() {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const chatSessions = await ChatSession.find({ userId: user._id })
                        .sort({ updatedAt: -1 })
                        .select('_id title lastMessage createdAt updatedAt');

                return NextResponse.json({ sessions: chatSessions });
        } catch (error) {
                console.error('Error fetching chat sessions:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function POST(request: NextRequest) {
        try {
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

                const chatSession = await ChatSession.create({
                        userId: user._id,
                        title,
                        lastMessage,
                        messages,
                });

                return NextResponse.json({ session: chatSession });
        } catch (error) {
                console.error('Error creating chat session:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
