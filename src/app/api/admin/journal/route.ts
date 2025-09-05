/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Journal from '@/lib/models/Journal';

export async function GET(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const { searchParams } = new URL(request.url);
                const page = Number.parseInt(searchParams.get('page') || '1');
                const limit = Number.parseInt(searchParams.get('limit') || '20');
                const category = searchParams.get('category');
                const userId = searchParams.get('userId');

                const filter: Record<string, any> = {};

                if (category && category !== 'all') {
                        filter.category = category;
                }

                if (userId) {
                        filter.userId = userId;
                }

                const [entries, totalEntries] = await Promise.all([
                        Journal.find(filter)
                                .sort({ createdAt: -1 })
                                .skip((page - 1) * limit)
                                .limit(limit),
                        Journal.countDocuments(filter),
                ]);

                // Get unique users for filtering
                const uniqueUsers = await Journal.distinct('userId');

                return NextResponse.json({
                        entries,
                        totalEntries,
                        totalPages: Math.ceil(totalEntries / limit),
                        currentPage: page,
                        uniqueUsers,
                });
        } catch (error) {
                console.error('Error fetching journal entries:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
