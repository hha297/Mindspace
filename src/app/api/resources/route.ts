/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Resource from '@/lib/models/Resource';

export async function GET(request: NextRequest) {
        try {
                const { searchParams } = new URL(request.url);
                const category = searchParams.get('category');
                const featured = searchParams.get('featured');
                const limit = parseInt(searchParams.get('limit') || '20');

                await connectDB();

                const query: any = {};

                if (category) {
                        query.category = category;
                }

                if (featured === 'true') {
                        query.featured = true;
                }

                const resources = await Resource.find(query).sort({ createdAt: -1 }).limit(limit);

                return NextResponse.json({ resources });
        } catch (error) {
                console.error('Error fetching resources:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const body = await request.json();
                const { title, description, category, type, duration, url, content, tags, featured } = body;

                if (!title || !description || !category || !type || !duration) {
                        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
                }

                await connectDB();

                const resource = await Resource.create({
                        title,
                        description,
                        category,
                        type,
                        duration,
                        url,
                        content,
                        tags: tags || [],
                        featured: featured || false,
                });

                return NextResponse.json(
                        {
                                success: true,
                                resource,
                        },
                        { status: 201 },
                );
        } catch (error) {
                console.error('Error creating resource:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
