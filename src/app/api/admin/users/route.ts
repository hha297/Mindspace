/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import MoodLog from '@/lib/models/MoodLog';

export async function GET(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await dbConnect();

                const { searchParams } = new URL(request.url);
                const page = Number.parseInt(searchParams.get('page') || '1');
                const limit = Number.parseInt(searchParams.get('limit') || '10');
                const search = searchParams.get('search') || '';

                const filter: any = {};
                if (search) {
                        filter.$or = [
                                { name: { $regex: search, $options: 'i' } },
                                { email: { $regex: search, $options: 'i' } },
                        ];
                }

                const [users, totalUsers] = await Promise.all([
                        User.find(filter)
                                .sort({ createdAt: -1 })
                                .skip((page - 1) * limit)
                                .limit(limit)
                                .select('name email provider role createdAt streakCount badges lastMoodLog'),
                        User.countDocuments(filter),
                ]);

                // Get mood log counts for each user
                const usersWithStats = await Promise.all(
                        users.map(async (user) => {
                                const moodLogCount = await MoodLog.countDocuments({ userId: user._id });
                                return {
                                        ...user.toObject(),
                                        moodLogCount,
                                };
                        }),
                );

                return NextResponse.json({
                        users: usersWithStats,
                        totalUsers,
                        totalPages: Math.ceil(totalUsers / limit),
                        currentPage: page,
                });
        } catch (error) {
                console.error('Error fetching users:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function DELETE(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await dbConnect();

                const { searchParams } = new URL(request.url);
                const userId = searchParams.get('id');

                if (!userId) {
                        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
                }

                // Check if user exists
                const user = await User.findById(userId);
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                // Get current admin user
                const currentAdmin = await User.findOne({ email: session.user.email });
                if (!currentAdmin) {
                        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
                }

                // Prevent self-deletion
                if (user._id.toString() === currentAdmin._id.toString()) {
                        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
                }

                // Prevent deletion of other admins
                if (user.role === 'admin') {
                        return NextResponse.json({ error: 'Cannot delete other admin users' }, { status: 400 });
                }

                // Delete all mood logs associated with this user
                await MoodLog.deleteMany({ userId: userId });

                // Delete the user
                await User.findByIdAndDelete(userId);

                return NextResponse.json({
                        message: 'User and associated data deleted successfully',
                        deletedUser: {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                        },
                });
        } catch (error) {
                console.error('Error deleting user:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function PUT(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await dbConnect();

                const { searchParams } = new URL(request.url);
                const userId = searchParams.get('id');
                const { role } = await request.json();

                if (!userId) {
                        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
                }

                if (!role || !['user', 'admin'].includes(role)) {
                        return NextResponse.json({ error: 'Valid role (user or admin) is required' }, { status: 400 });
                }

                // Check if user exists
                const user = await User.findById(userId);
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                // Get current admin user
                const currentAdmin = await User.findOne({ email: session.user.email });
                if (!currentAdmin) {
                        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
                }

                // Prevent self-role-change
                if (user._id.toString() === currentAdmin._id.toString()) {
                        return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
                }

                // Update user role
                const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

                return NextResponse.json({
                        message: 'User role updated successfully',
                        updatedUser: {
                                id: updatedUser._id,
                                name: updatedUser.name,
                                email: updatedUser.email,
                                role: updatedUser.role,
                        },
                });
        } catch (error) {
                console.error('Error updating user:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
