import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { StressAssessment } from '@/lib/models/StressAssessment';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const body = await request.json();
                const { score, level, questions } = body;

                // Get user ID from session
                const user = await User.findOne({ email: session.user.email });
                if (!user) {
                        return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }

                const stressAssessment = new StressAssessment({
                        userId: user._id,
                        score,
                        level,
                        questions,
                });

                await stressAssessment.save();

                return NextResponse.json({ success: true, assessment: stressAssessment });
        } catch (error) {
                console.error('Error saving stress assessment:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function GET(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const { searchParams } = new URL(request.url);
                const limit = parseInt(searchParams.get('limit') || '10');
                const userId = searchParams.get('userId');

                let query = {};
                if (userId) {
                        query = { userId };
                } else {
                        // Get user's own assessments
                        const user = await User.findOne({ email: session.user.email });
                        if (!user) {
                                return NextResponse.json({ error: 'User not found' }, { status: 404 });
                        }
                        query = { userId: user._id };
                }

                const assessments = await StressAssessment.find(query)
                        .sort({ completedAt: -1 })
                        .limit(limit)
                        .populate('userId', 'name email');

                return NextResponse.json({ assessments });
        } catch (error) {
                console.error('Error fetching stress assessments:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
