import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
        try {
                const { name, email, password, image } = await request.json();

                if (!name || !email || !password) {
                        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
                }

                if (password.length < 6) {
                        return NextResponse.json(
                                { message: 'Password must be at least 6 characters long' },
                                { status: 400 },
                        );
                }

                await connectDB();

                // Check if user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                        return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 12);

                // Create user
                const user = await User.create({
                        name,
                        email,
                        password: hashedPassword,
                        image,
                        role: 'user',
                });

                return NextResponse.json(
                        {
                                message: 'User created successfully',
                                user: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        image: user.image,
                                        role: user.role,
                                },
                        },
                        { status: 201 },
                );
        } catch (error) {
                console.error('Registration error:', error);
                return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
}
