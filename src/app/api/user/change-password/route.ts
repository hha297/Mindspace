import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const { currentPassword, newPassword } = await request.json();

                if (!currentPassword || !newPassword) {
                        return NextResponse.json(
                                { error: 'Current password and new password are required' },
                                { status: 400 },
                        );
                }

                // Find user with password field included
                const user = await User.findOne({ email: session.user.email }).select('+password');
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                // Check if user is OAuth user or doesn't have a password
                if (user.provider !== 'email' || !user.password) {
                        return NextResponse.json(
                                { error: 'Password change is not available for OAuth users' },
                                { status: 400 },
                        );
                }

                // Verify current password
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
                }

                // Hash new password
                const hashedNewPassword = await bcrypt.hash(newPassword, 12);

                // Update password
                await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });

                return NextResponse.json({ message: 'Password changed successfully' });
        } catch (error) {
                console.error('Error changing password:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
