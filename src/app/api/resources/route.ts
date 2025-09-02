/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resource from '@/lib/models/Resource';

export async function GET(request: NextRequest) {
        try {
                await connectDB();

                const { searchParams } = new URL(request.url);
                const category = searchParams.get('category');
                const type = searchParams.get('type');
                const limit = Number.parseInt(searchParams.get('limit') || '20');

                const filter: any = { isPublished: true };
                if (category) filter.category = category;
                if (type) filter.type = type;

                const resources = await Resource.find(filter)
                        .populate('createdBy', 'name')
                        .sort({ createdAt: -1 })
                        .limit(limit)
                        .select('title description content category type url views likes createdAt');

                return NextResponse.json({ resources });
        } catch (error) {
                console.error('Error fetching resources:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
