/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Journal from '@/lib/models/Journal';

// GET - Fetch user's journal entries
export async function GET(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const { searchParams } = new URL(request.url);
                const page = Number.parseInt(searchParams.get('page') || '1');
                const limit = Number.parseInt(searchParams.get('limit') || '10');
                const category = searchParams.get('category');

                const filter: Record<string, any> = {
                        userId: session.user.email,
                };

                if (category && category !== 'all') {
                        filter.category = category;
                }

                const [entries, totalEntries] = await Promise.all([
                        Journal.find(filter)
                                .sort({ createdAt: -1 })
                                .skip((page - 1) * limit)
                                .limit(limit),
                        Journal.countDocuments(filter),
                ]);

                return NextResponse.json({
                        entries,
                        totalEntries,
                        totalPages: Math.ceil(totalEntries / limit),
                        currentPage: page,
                });
        } catch (error) {
                console.error('Error fetching journal entries:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

// POST - Create new journal entry
export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { content, prompt, category, mood, tags, isPrivate } = await request.json();

                if (!content || !content.trim()) {
                        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
                }

                await connectDB();

                const journalEntry = await Journal.create({
                        userId: session.user.email,
                        content: content.trim(),
                        prompt: prompt || undefined,
                        category: category || 'free-write',
                        mood: mood || undefined,
                        tags: tags || [],
                        isPrivate: isPrivate !== undefined ? isPrivate : true,
                });

                return NextResponse.json({
                        message: 'Journal entry created successfully',
                        entry: journalEntry,
                });
        } catch (error) {
                console.error('Error creating journal entry:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
