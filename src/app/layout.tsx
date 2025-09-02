import type React from 'react';
import type { Metadata } from 'next';

import { Providers } from '@/components/theme-provider';

import './globals.css';
import { Space_Grotesk, Space_Mono } from 'next/font/google';

const fontPrimary = Space_Grotesk({
        subsets: ['latin'],
        weight: ['300', '400', '500', '600', '700'],
        variable: '--font-primary',
});

const fontSecondary = Space_Mono({
        subsets: ['latin'],
        weight: ['400', '700'],
        variable: '--font-secondary',
});

export const metadata: Metadata = {
        title: 'MindSpace',
        description: 'Your mental health companion - track mood, access resources, and find support',
        icons: {
                icon: '/logo.png',
                shortcut: '/logo.png',
                apple: '/logo.png',
        },
};

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        return (
                <html lang="en" suppressHydrationWarning>
                        <body className={`${fontPrimary.variable} ${fontSecondary.variable}`}>
                                <Providers>{children}</Providers>
                        </body>
                </html>
        );
}
