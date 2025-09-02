import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resource from '@/lib/models/Resource';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
        try {
                await connectDB();

                const resource = await Resource.findById(params.id);

                if (!resource) {
                        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
                }

                return NextResponse.json({ resource });
        } catch (error) {
                console.error('Error fetching resource:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
