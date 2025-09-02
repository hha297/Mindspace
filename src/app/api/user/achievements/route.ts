import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { achievementId } = await request.json();
                if (!achievementId) {
                        return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
                }

                await connectDB();

                // Add achievement to user's badges
                const user = await User.findOneAndUpdate(
                        { email: session.user.email },
                        { $addToSet: { badges: achievementId } }, // $addToSet prevents duplicates
                        { new: true },
                );

                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        badges: user.badges,
                });
        } catch (error) {
                console.error('Error saving achievement:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
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

                return NextResponse.json({
                        badges: user.badges || [],
                });
        } catch (error) {
                console.error('Error fetching achievements:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
