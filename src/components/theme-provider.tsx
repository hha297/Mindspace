'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
        return (
                <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <SessionProvider>
                                {children}
                                <Toaster position="top-right" richColors />
                        </SessionProvider>
                </NextThemesProvider>
        );
}
