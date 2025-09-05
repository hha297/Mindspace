'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, BookOpen, Settings, ArrowLeft, Menu, X, PenTool } from 'lucide-react';
import Image from 'next/image';

const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Resources', href: '/admin/resources', icon: BookOpen },
        { name: 'Journaling', href: '/admin/journaling', icon: PenTool },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
        const pathname = usePathname();
        const [isMobile, setIsMobile] = useState(false);
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
                const checkMobile = () => {
                        setIsMobile(window.innerWidth < 768);
                };

                checkMobile();
                window.addEventListener('resize', checkMobile);

                return () => window.removeEventListener('resize', checkMobile);
        }, []);

        const SidebarContent = () => (
                <div
                        className={cn(
                                'flex h-full flex-col bg-card border-r transition-all duration-300',
                                isMobile ? 'fixed top-0 left-0 z-50 w-64 transform' : 'w-64',
                                isMobile && !isOpen && '-translate-x-full',
                        )}
                >
                        <div className="flex h-16 items-center justify-between border-b px-6">
                                <Link href="/" className="flex items-center space-x-2">
                                        <Image src="/logo.png" alt="MindSpace" width={28} height={28} />
                                        <span className="font-semibold text-lg">Admin</span>
                                </Link>
                                {isMobile && (
                                        <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsOpen(false)}
                                                className="h-8 w-8 p-0"
                                        >
                                                <X className="h-4 w-4" />
                                        </Button>
                                )}
                        </div>

                        <nav className="flex-1 space-y-1 px-4 py-4">
                                {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                                <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => isMobile && setIsOpen(false)}
                                                        className={cn(
                                                                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                                isActive
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                                        )}
                                                >
                                                        <item.icon className="h-4 w-4" />
                                                        <span>{item.name}</span>
                                                </Link>
                                        );
                                })}
                        </nav>

                        <div className="border-t p-4">
                                <Button variant="outline" className="w-full bg-transparent" asChild>
                                        <Link href="/dashboard">
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back to App
                                        </Link>
                                </Button>
                        </div>
                </div>
        );

        return (
                <>
                        {/* Mobile overlay */}
                        {isMobile && isOpen && (
                                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
                        )}

                        {/* Sidebar */}
                        <SidebarContent />

                        {/* Mobile menu button */}
                        {isMobile && (
                                <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(true)}
                                        className="fixed top-4 right-4 z-50 h-10 w-10 p-0 bg-card border shadow-lg"
                                >
                                        <Menu className="h-5 w-5" />
                                </Button>
                        )}
                </>
        );
}
