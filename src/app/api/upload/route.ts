import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
        try {
                const session = await getServerSession();
                // Allow upload for both authenticated users and during registration
                if (!session?.user?.email) {
                        // Check if this is a registration request by looking at referer
                        const referer = request.headers.get('referer');
                        if (!referer || !referer.includes('/sign-up')) {
                                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                        }
                }

                const formData = await request.formData();
                const file = formData.get('file') as File;

                if (!file) {
                        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
                }

                // Upload to Cloudinary using FormData
                const cloudinaryUrl = process.env.CLOUDINARY_URL;
                if (!cloudinaryUrl) {
                        return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
                }

                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                uploadFormData.append('upload_preset', 'mindspace');

                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dhj4wjkls/image/upload`, {
                        method: 'POST',
                        body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                        const error = await uploadResponse.text();
                        console.error('Cloudinary upload error:', error);
                        console.error('Response status:', uploadResponse.status);
                        console.error('Response headers:', uploadResponse.headers);
                        return NextResponse.json(
                                {
                                        error: 'Failed to upload image',
                                        details: error,
                                        status: uploadResponse.status,
                                },
                                { status: 500 },
                        );
                }

                const uploadResult = await uploadResponse.json();

                return NextResponse.json({
                        url: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                });
        } catch (error) {
                console.error('Error uploading image:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
