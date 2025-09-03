import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
        providers: [
                GoogleProvider({
                        clientId: process.env.GOOGLE_CLIENT_ID!,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                }),
                GitHubProvider({
                        clientId: process.env.GITHUB_CLIENT_ID!,
                        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
                }),
                CredentialsProvider({
                        name: 'credentials',
                        credentials: {
                                email: { label: 'Email', type: 'email' },
                                password: { label: 'Password', type: 'password' },
                        },
                        async authorize(credentials) {
                                if (!credentials?.email || !credentials?.password) {
                                        console.log('Missing credentials');
                                        throw new Error('Email and password are required');
                                }

                                try {
                                        await connectDB();
                                        const user = await User.findOne({ email: credentials.email }).select(
                                                '+password',
                                        );

                                        if (!user) {
                                                console.log('User not found:', credentials.email);
                                                throw new Error('User not found');
                                        }

                                        if (!user.password) {
                                                console.log('User has no password (OAuth user):', credentials.email);
                                                throw new Error(
                                                        'This email is associated with a social account. Please sign in with Google or GitHub.',
                                                );
                                        }

                                        const isPasswordValid = await bcrypt.compare(
                                                credentials.password,
                                                user.password,
                                        );

                                        if (!isPasswordValid) {
                                                console.log('Invalid password for user:', credentials.email);
                                                throw new Error('Invalid password');
                                        }

                                        return {
                                                id: user._id.toString(),
                                                email: user.email,
                                                name: user.name,
                                                image: user.image,
                                                role: user.role,
                                        };
                                } catch (error) {
                                        console.error('Auth error:', error);
                                        throw error;
                                }
                        },
                }),
        ],
        callbacks: {
                async signIn({ user, account }) {
                        if (account?.provider === 'google' || account?.provider === 'github') {
                                try {
                                        await connectDB();
                                        const existingUser = await User.findOne({ email: user.email });

                                        if (!existingUser) {
                                                await User.create({
                                                        email: user.email,
                                                        name: user.name,
                                                        image: user.image,
                                                        provider: account.provider,
                                                        providerId: account.providerAccountId,
                                                        role: 'user',
                                                });
                                        }
                                } catch (error) {
                                        console.error('Error saving user:', error);
                                        return false;
                                }
                        }
                        return true;
                },
                async jwt({ token, user, trigger, session }) {
                        if (user) {
                                token.role = user.role;
                                token.name = user.name;
                                token.email = user.email;
                        }

                        // Always get fresh user data from database
                        if (token?.email) {
                                try {
                                        await connectDB();
                                        const dbUser = await User.findOne({ email: token.email });
                                        if (dbUser) {
                                                token.role = dbUser.role;
                                                token.name = dbUser.name;
                                                token.email = dbUser.email;
                                                token.image = dbUser.image;
                                        }
                                } catch (error) {
                                        console.error('Error fetching user data in JWT:', error);
                                }
                        }

                        // Handle session update
                        if (trigger === 'update' && session) {
                                token.name = session.user.name;
                                token.email = session.user.email;
                                token.image = session.user.image;
                        }

                        return token;
                },
                async session({ session, token }) {
                        if (token) {
                                session.user.id = token.sub!;
                                session.user.role = token.role as string;
                                session.user.name = token.name as string;
                                session.user.email = token.email as string;
                                session.user.image = token.image as string;
                        }
                        return session;
                },
        },
        pages: {
                signIn: '/sign-in',
        },
        session: {
                strategy: 'jwt',
        },
        secret: process.env.NEXTAUTH_SECRET,
        debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
