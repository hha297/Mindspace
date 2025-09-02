'use client';

import { AlertTriangle, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function EmergencyBanner() {
        return (
                <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive mb-6">
                        <AlertTriangle className="size-4 mt-1.5" />
                        <AlertDescription className="flex items-center justify-between">
                                <span className="text-sm">
                                        If you&apos;re having thoughts of self-harm or suicide, please reach out for
                                        help immediately.
                                </span>
                                <div className="flex gap-2 ml-4 cursor-pointer">
                                        <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-8"
                                                onClick={() => window.open('tel:112', '_self')}
                                        >
                                                <Phone className="h-3 w-3 mr-1" />
                                                112
                                        </Button>
                                        <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                                                onClick={() => {}}
                                        >
                                                Chat Now
                                        </Button>
                                </div>
                        </AlertDescription>
                </Alert>
        );
}
