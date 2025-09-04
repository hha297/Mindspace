import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import MoodLog from '@/lib/models/MoodLog';
import User from '@/lib/models/User';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

                const { id } = await params;

                // Find and delete the mood log, ensuring it belongs to the user
                const deletedMoodLog = await MoodLog.findOneAndDelete({
                        _id: id,
                        userId: user._id,
                });

                if (!deletedMoodLog) {
                        return NextResponse.json({ error: 'Mood log not found' }, { status: 404 });
                }

                return NextResponse.json({ message: 'Mood log deleted successfully' });
        } catch (error) {
                console.error('Error deleting mood log:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

                const { id } = await params;
                const updateData = await request.json();

                // Find and update the mood log, ensuring it belongs to the user
                const updatedMoodLog = await MoodLog.findOneAndUpdate(
                        {
                                _id: id,
                                userId: user._id,
                        },
                        {
                                $set: {
                                        ...(updateData.mood !== undefined && { mood: updateData.mood }),
                                        ...(updateData.moodLabel !== undefined && { moodLabel: updateData.moodLabel }),
                                        ...(updateData.notes !== undefined && { notes: updateData.notes }),
                                        ...(updateData.tags !== undefined && { tags: updateData.tags }),
                                        updatedAt: new Date(),
                                },
                        },
                        { new: true },
                );

                if (!updatedMoodLog) {
                        return NextResponse.json({ error: 'Mood log not found' }, { status: 404 });
                }

                return NextResponse.json({
                        message: 'Mood log updated successfully',
                        moodLog: {
                                _id: updatedMoodLog._id,
                                userId: updatedMoodLog.userId,
                                mood: updatedMoodLog.moodLabel,
                                moodScore: updatedMoodLog.mood,
                                note: updatedMoodLog.notes,
                                tags: updatedMoodLog.tags,
                                createdAt: updatedMoodLog.createdAt,
                                updatedAt: updatedMoodLog.updatedAt,
                        },
                });
        } catch (error) {
                console.error('Error updating mood log:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
