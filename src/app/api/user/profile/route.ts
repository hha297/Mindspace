/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import MoodLog from '@/lib/models/MoodLog';

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

                // Get user stats
                const totalMoodLogs = await MoodLog.countDocuments({ userId: user._id });

                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const recentMoods = await MoodLog.find({
                        userId: user._id,
                        createdAt: { $gte: thirtyDaysAgo },
                }).sort({ createdAt: -1 });

                const averageMood =
                        recentMoods.length > 0
                                ? recentMoods.reduce((sum, log) => sum + log.rating, 0) / recentMoods.length
                                : 0;

                return NextResponse.json({
                        user: {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                provider: user.provider, // Include provider field for frontend OAuth checks
                                image: user.image,
                                emergencyContact: user.emergencyContact,
                                personalGoals: user.personalGoals,
                                notificationsEnabled: user.notificationsEnabled ?? true,
                                privacyLevel: user.privacyLevel || 'private',
                                streakCount: user.streakCount || 0,
                                badges: user.badges || [],
                                lastMoodLog: user.lastMoodLog,
                                createdAt: user.createdAt,
                        },
                        stats: {
                                totalMoodLogs,
                                averageMood: Math.round(averageMood * 10) / 10,
                                recentMoodsCount: recentMoods.length,
                        },
                });
        } catch (error) {
                console.error('Error fetching user profile:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function PUT(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { name, email, image, emergencyContact, personalGoals, notificationsEnabled, privacyLevel } =
                        await request.json();

                await connectDB();

                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                if (!name) {
                        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
                }

                const isOAuthUser = user.provider === 'google' || user.provider === 'github';

                // Don't allow email changes for any provider
                if (email && email !== user.email) {
                        return NextResponse.json({ error: 'Email address cannot be changed' }, { status: 400 });
                }

                // Don't allow name changes for OAuth users
                if (isOAuthUser && name !== user.name) {
                        return NextResponse.json(
                                {
                                        error: `Name cannot be changed for ${user.provider} accounts`,
                                },
                                { status: 400 },
                        );
                }

                const updateData: any = {};
                if (!isOAuthUser) {
                        updateData.name = name;
                }

                // These fields can always be updated regardless of provider
                if (image !== undefined) updateData.image = image;
                if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
                if (personalGoals !== undefined) updateData.personalGoals = personalGoals;
                if (notificationsEnabled !== undefined) updateData.notificationsEnabled = notificationsEnabled;
                if (privacyLevel !== undefined) updateData.privacyLevel = privacyLevel;

                const updatedUser = await User.findOneAndUpdate({ email: session.user.email }, updateData, {
                        new: true,
                });

                if (!updatedUser) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                return NextResponse.json({
                        user: {
                                id: updatedUser._id,
                                name: updatedUser.name,
                                email: updatedUser.email,
                                provider: updatedUser.provider, // Include provider in response
                                image: updatedUser.image,
                                emergencyContact: updatedUser.emergencyContact,
                                personalGoals: updatedUser.personalGoals,
                                notificationsEnabled: updatedUser.notificationsEnabled,
                                privacyLevel: updatedUser.privacyLevel,
                        },
                        message: 'Profile updated successfully',
                });
        } catch (error) {
                console.error('Error updating profile:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
