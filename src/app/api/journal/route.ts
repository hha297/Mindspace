import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

// Simple journal entry interface
interface JournalEntry {
        _id?: string;
        userId: string;
        title: string;
        content: string;
        prompt?: string;
        createdAt: Date;
        updatedAt: Date;
}

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

                // For now, return empty array since we don't have a Journal model yet
                // This can be expanded when a proper Journal model is created
                const entries: JournalEntry[] = [];

                return NextResponse.json({ entries });
        } catch (error) {
                console.error('Error fetching journal entries:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { title, content, prompt } = await request.json();

                if (!title || !content) {
                        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                // For now, just return success since we don't have a Journal model
                // This would create a journal entry when the model is implemented
                const entry = {
                        _id: new Date().getTime().toString(),
                        userId: user._id.toString(),
                        title,
                        content,
                        prompt: prompt || '',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                };

                return NextResponse.json({
                        entry,
                        message: 'Journal entry saved successfully',
                });
        } catch (error) {
                console.error('Error saving journal entry:', error);
                return NextResponse.json({ error: 'Failed to save journal entry' }, { status: 500 });
        }
}
