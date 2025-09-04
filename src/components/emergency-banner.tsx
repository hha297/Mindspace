'use client';

import Link from 'next/link';
import { AlertTriangle, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function EmergencyBanner() {
        return (
                <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive mb-6">
                        <AlertTriangle className="size-4 mt-1.5" />
                        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <span className="text-sm leading-relaxed">
                                        If you&apos;re having thoughts of self-harm or suicide, please reach out for
                                        help immediately.
                                </span>
                                <div className="flex gap-2 sm:ml-4">
                                        <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-8 flex-1 sm:flex-none"
                                                onClick={() => window.open('tel:112', '_self')}
                                        >
                                                <Phone className="h-3 w-3 mr-1" />
                                                112
                                        </Button>
                                        <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 flex-1 sm:flex-none border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                                                asChild
                                        >
                                                <Link href="/chat">Chat Now</Link>
                                        </Button>
                                </div>
                        </AlertDescription>
                </Alert>
        );
}
