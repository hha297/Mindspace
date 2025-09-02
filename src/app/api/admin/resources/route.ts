import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Resource from '@/lib/models/Resource';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const { searchParams } = new URL(request.url);
                const page = Number.parseInt(searchParams.get('page') || '1');
                const limit = Number.parseInt(searchParams.get('limit') || '10');
                const category = searchParams.get('category');
                const type = searchParams.get('type');
                const featured = searchParams.get('featured');

                const filter: Record<string, string | boolean> = {};
                if (category) filter.category = category;
                if (type) filter.type = type;
                if (featured !== null) filter.featured = featured === 'true';

                const [resources, totalResources] = await Promise.all([
                        Resource.find(filter)
                                .sort({ createdAt: -1 })
                                .skip((page - 1) * limit)
                                .limit(limit),
                        Resource.countDocuments(filter),
                ]);

                return NextResponse.json({
                        resources,
                        totalResources,
                        totalPages: Math.ceil(totalResources / limit),
                        currentPage: page,
                });
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

                const { title, description, content, category, type, url, tags, featured } = await request.json();

                if (!title || !description || !category || !type) {
                        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
                }

                await connectDB();

                const resource = await Resource.create({
                        title,
                        description,
                        content: content || '',
                        category,
                        type,
                        url: url || '',
                        duration: 5, // Default duration
                        tags: tags || [],
                        featured: featured || false,
                        // createdBy field is optional, so we don't need to provide it
                });

                return NextResponse.json({ resource });
        } catch (error) {
                console.error('Error creating resource:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
