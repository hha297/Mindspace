import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Resource from '@/lib/models/Resource';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const body = await request.json();
                const { title, description, content, category, type, url, tags, featured } = body;

                await connectDB();

                const { id } = await params;
                const resource = await Resource.findByIdAndUpdate(
                        id,
                        {
                                title,
                                description,
                                content: content || '',
                                category,
                                type,
                                url: url || '',
                                tags: tags || [],
                                featured: featured || false,
                                // createdBy field is optional, so we don't need to provide it
                        },
                        { new: true },
                );

                if (!resource) {
                        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
                }

                return NextResponse.json({ resource });
        } catch (error) {
                console.error('Error updating resource:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        try {
                const session = await getServerSession();
                if (!session?.user?.email) {
                        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await connectDB();

                const { id } = await params;
                const resource = await Resource.findByIdAndDelete(id);

                if (!resource) {
                        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
                }

                return NextResponse.json({ success: true });
        } catch (error) {
                console.error('Error deleting resource:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
