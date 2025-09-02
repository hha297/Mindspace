import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST() {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                // Get fresh user data from database
                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        user: {
                                id: user._id.toString(),
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                image: user.image,
                        },
                });
        } catch (error) {
                console.error('Error force refreshing session:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
