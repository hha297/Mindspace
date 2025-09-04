import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import MoodLog from '@/lib/models/MoodLog';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
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

                const { searchParams } = new URL(request.url);
                const limit = Number.parseInt(searchParams.get('limit') || '30');
                const days = Number.parseInt(searchParams.get('days') || '30');

                const startDate = new Date();
                startDate.setDate(startDate.getDate() - days);

                const moods = await MoodLog.find({
                        userId: user._id,
                        createdAt: { $gte: startDate },
                })
                        .sort({ createdAt: -1 })
                        .limit(limit);

                // Transform data to match component expectations
                const transformedMoods = moods.map((mood) => ({
                        _id: mood._id,
                        userId: mood.userId,
                        mood: mood.moodLabel,
                        moodScore: mood.mood,
                        note: mood.notes,
                        tags: mood.tags,
                        createdAt: mood.createdAt,
                        updatedAt: mood.updatedAt,
                }));

                return NextResponse.json({ moods: transformedMoods });
        } catch (error) {
                console.error('Error fetching moods:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { mood, moodScore, note, tags } = await request.json();

                if (!mood || moodScore === undefined) {
                        return NextResponse.json({ error: 'Mood and moodScore are required' }, { status: 400 });
                }

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

                const todayLog = await MoodLog.findOne({
                        userId: user._id,
                        createdAt: { $gte: todayStart, $lte: todayEnd },
                });

                const isFirstLogToday = !todayLog;

                // Create mood log
                const moodLog = await MoodLog.create({
                        userId: user._id,
                        mood: moodScore,
                        moodLabel: mood,
                        notes: note || '',
                        tags: tags || [],
                });

                let newStreakCount = user.streakCount || 0;

                if (isFirstLogToday) {
                        const yesterdayStart = new Date(todayStart);
                        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
                        const yesterdayEnd = new Date(todayEnd);
                        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

                        const yesterdayLog = await MoodLog.findOne({
                                userId: user._id,
                                createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
                        });

                        if (yesterdayLog) {
                                // Continue streak
                                newStreakCount = user.streakCount + 1;
                        } else if (user.streakCount === 0) {
                                // Start new streak
                                newStreakCount = 1;
                        } else {
                                // Reset streak (missed yesterday)
                                newStreakCount = 1;
                        }

                        await User.findByIdAndUpdate(user._id, {
                                lastMoodLog: new Date(),
                                streakCount: newStreakCount,
                        });
                }

                return NextResponse.json({
                        moodLog,
                        streakCount: newStreakCount,
                        message: 'Mood logged successfully',
                });
        } catch (error) {
                console.error('Error logging mood:', error);
                return NextResponse.json({ error: 'Failed to log mood' }, { status: 500 });
        }
}
