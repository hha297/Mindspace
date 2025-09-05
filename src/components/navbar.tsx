'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
        Home,
        BarChart3,
        BookOpen,
        Wrench,
        Menu,
        X,
        LogOut,
        User,
        ChevronDown,
        LayoutDashboardIcon,
        BotMessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Navbar() {
        const { data: session, update } = useSession();
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [userName, setUserName] = useState<string | null>(null);
        const pathname = usePathname();

        // Listen for profile update events and session changes
        useEffect(() => {
                const handleProfileUpdate = () => {
                        // Get updated name from localStorage
                        const updatedName = localStorage.getItem('userName');
                        if (updatedName) {
                                setUserName(updatedName);
                        }
                        // Also update session
                        update();
                };

                // Clear localStorage if no session (user signed out)
                if (!session) {
                        localStorage.removeItem('userName');
                        setUserName(null);
                        return;
                }

                // Set initial name from localStorage or session
                const storedName = localStorage.getItem('userName');
                if (storedName && session?.user?.name && storedName !== session.user.name) {
                        // Clear old data if user changed
                        localStorage.removeItem('userName');
                        setUserName(session.user.name);
                        localStorage.setItem('userName', session.user.name);
                } else if (storedName) {
                        setUserName(storedName);
                } else if (session?.user?.name) {
                        setUserName(session.user.name);
                        localStorage.setItem('userName', session.user.name);
                }

                window.addEventListener('profile-updated', handleProfileUpdate);
                return () => {
                        window.removeEventListener('profile-updated', handleProfileUpdate);
                };
        }, [update, session]);

        // Add admin link if user is admin
        const navigation = [
                { name: 'Home', href: '/', icon: Home },
                { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
                { name: 'AI Chat', href: '/chat', icon: BotMessageSquare },
                { name: 'Tools', href: '/tools', icon: Wrench },
                { name: 'Resources', href: '/resources', icon: BookOpen },
        ];

        // Check if current path is active
        const isActive = (href: string) => {
                if (href === '/') {
                        return pathname === '/';
                }
                return pathname.startsWith(href);
        };

        return (
                <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
                        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between h-16">
                                        <div className="flex items-center">
                                                <Link href="/" className="flex items-center space-x-2">
                                                        <Image
                                                                src="/logo.png"
                                                                alt="MindSpace"
                                                                width={32}
                                                                height={32}
                                                                className="rounded-lg mb-1.5"
                                                        />
                                                        <span className="font-semibold text-xl text-foreground">
                                                                MindSpace
                                                        </span>
                                                        <Badge variant="secondary" className="ml-2 text-xs">
                                                                Beta
                                                        </Badge>
                                                </Link>
                                        </div>

                                        {/* Desktop Navigation */}
                                        <div className="hidden md:flex items-center space-x-2">
                                                {navigation.map((item) => {
                                                        const Icon = item.icon;
                                                        const active = isActive(item.href);
                                                        return (
                                                                <Link
                                                                        key={item.name}
                                                                        href={item.href}
                                                                        className={cn(
                                                                                'flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                                                                active
                                                                                        ? 'bg-primary text-white'
                                                                                        : 'text-muted-foreground hover:bg-primary hover:text-white',
                                                                        )}
                                                                >
                                                                        <Icon className="h-4 w-4" />
                                                                        <span>{item.name}</span>
                                                                </Link>
                                                        );
                                                })}
                                        </div>

                                        {/* Desktop Auth Buttons */}
                                        <div className="hidden md:flex items-center space-x-4">
                                                {session ? (
                                                        <div className="flex items-center space-x-3">
                                                                <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        className="flex items-center space-x-2 hover:bg-primary hover:text-white rounded-md py-1 px-2 transition-colors"
                                                                                >
                                                                                        <Avatar className="h-6 w-6">
                                                                                                <AvatarImage
                                                                                                        src={
                                                                                                                session
                                                                                                                        .user
                                                                                                                        ?.image ||
                                                                                                                undefined
                                                                                                        }
                                                                                                        alt="Profile"
                                                                                                />
                                                                                                <AvatarFallback>
                                                                                                        <User className="h-4 w-4" />
                                                                                                </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <p className="text-sm">
                                                                                                {userName ||
                                                                                                        session.user
                                                                                                                ?.name ||
                                                                                                        session.user
                                                                                                                ?.email}
                                                                                        </p>
                                                                                        <ChevronDown className="h-4 w-4" />
                                                                                </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent
                                                                                align="end"
                                                                                className="w-56"
                                                                        >
                                                                                <DropdownMenuItem asChild>
                                                                                        <Link
                                                                                                href="/profile"
                                                                                                className="flex items-center space-x-2 cursor-pointer"
                                                                                        >
                                                                                                <User className="h-4 w-4 hover:text-white" />
                                                                                                <span>Profile</span>
                                                                                        </Link>
                                                                                </DropdownMenuItem>

                                                                                {session?.user.role === 'admin' && (
                                                                                        <>
                                                                                                <DropdownMenuSeparator />
                                                                                                <DropdownMenuItem
                                                                                                        asChild
                                                                                                >
                                                                                                        <Link
                                                                                                                href="/admin"
                                                                                                                className="flex items-center space-x-2 cursor-pointer"
                                                                                                        >
                                                                                                                <LayoutDashboardIcon className="h-4 w-4 hover:text-white" />
                                                                                                                <span>
                                                                                                                        Admin
                                                                                                                        Dashboard
                                                                                                                </span>
                                                                                                        </Link>
                                                                                                </DropdownMenuItem>
                                                                                        </>
                                                                                )}

                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem
                                                                                        onClick={() => {
                                                                                                localStorage.removeItem(
                                                                                                        'userName',
                                                                                                );
                                                                                                signOut({
                                                                                                        callbackUrl:
                                                                                                                '/',
                                                                                                });
                                                                                        }}
                                                                                        className="flex items-center space-x-2 cursor-pointer"
                                                                                >
                                                                                        <LogOut className="h-4 w-4 hover:text-white" />
                                                                                        <span>Sign Out</span>
                                                                                </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                </DropdownMenu>
                                                        </div>
                                                ) : (
                                                        <div className="flex items-center space-x-3">
                                                                <Link href="/sign-in">
                                                                        <Button variant="ghost" size="sm">
                                                                                Sign In
                                                                        </Button>
                                                                </Link>
                                                                <Link href="/sign-up">
                                                                        <Button size="sm">Sign Up</Button>
                                                                </Link>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Mobile menu button */}
                                        <div className="md:hidden flex items-center">
                                                <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                >
                                                        {isMenuOpen ? (
                                                                <X className="h-5 w-5" />
                                                        ) : (
                                                                <Menu className="h-5 w-5" />
                                                        )}
                                                </Button>
                                        </div>
                                </div>

                                {/* Mobile Navigation */}
                                {isMenuOpen && (
                                        <div className="md:hidden">
                                                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
                                                        {navigation.map((item) => {
                                                                const Icon = item.icon;
                                                                const active = isActive(item.href);
                                                                return (
                                                                        <Link
                                                                                key={item.name}
                                                                                href={item.href}
                                                                                className={cn(
                                                                                        'flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md transition-colors',
                                                                                        active
                                                                                                ? 'bg-primary text-white'
                                                                                                : 'text-muted-foreground hover:text-white hover:bg-primary',
                                                                                )}
                                                                                onClick={() => setIsMenuOpen(false)}
                                                                        >
                                                                                <Icon className="h-5 w-5" />
                                                                                <span>{item.name}</span>
                                                                        </Link>
                                                                );
                                                        })}

                                                        {/* Mobile Admin Links */}
                                                        {session?.user.role === 'admin' && (
                                                                <div className="space-y-1">
                                                                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                                                                                Admin
                                                                        </div>
                                                                        <Link
                                                                                href="/admin"
                                                                                onClick={() => setIsMenuOpen(false)}
                                                                                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-muted-foreground hover:text-white hover:bg-primary rounded-md transition-colors"
                                                                        >
                                                                                <LayoutDashboardIcon className="h-5 w-5" />
                                                                                <span>Admin Dashboard</span>
                                                                        </Link>
                                                                </div>
                                                        )}

                                                        {/* Mobile Auth Section */}
                                                        <div className="pt-4 border-t border-border">
                                                                {session ? (
                                                                        <div className="space-y-2">
                                                                                <div className="px-1 py-2 text-sm text-muted-foreground flex items-center space-x-2">
                                                                                        <Avatar className="size-8">
                                                                                                <AvatarImage
                                                                                                        src={
                                                                                                                session
                                                                                                                        .user
                                                                                                                        ?.image ||
                                                                                                                undefined
                                                                                                        }
                                                                                                        alt="Profile"
                                                                                                />
                                                                                                <AvatarFallback>
                                                                                                        <User className="size-5" />
                                                                                                </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <span>
                                                                                                Signed in as{' '}
                                                                                                {userName ||
                                                                                                        session.user
                                                                                                                ?.name ||
                                                                                                        session.user
                                                                                                                ?.email}
                                                                                        </span>
                                                                                </div>
                                                                                <Link
                                                                                        href="/profile"
                                                                                        onClick={() =>
                                                                                                setIsMenuOpen(false)
                                                                                        }
                                                                                >
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                className="w-full justify-start"
                                                                                        >
                                                                                                <User className="size-5 mr-2" />
                                                                                                Profile
                                                                                        </Button>
                                                                                </Link>

                                                                                <Button
                                                                                        onClick={() => {
                                                                                                localStorage.removeItem(
                                                                                                        'userName',
                                                                                                );
                                                                                                signOut({
                                                                                                        callbackUrl:
                                                                                                                '/',
                                                                                                });
                                                                                                setIsMenuOpen(false);
                                                                                        }}
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="w-full justify-start"
                                                                                >
                                                                                        <LogOut className="size-5 mr-2" />
                                                                                        Sign Out
                                                                                </Button>
                                                                        </div>
                                                                ) : (
                                                                        <div className="space-y-2">
                                                                                <Link
                                                                                        href="/sign-in"
                                                                                        onClick={() =>
                                                                                                setIsMenuOpen(false)
                                                                                        }
                                                                                >
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                className="w-full justify-start "
                                                                                        >
                                                                                                Sign In
                                                                                        </Button>
                                                                                </Link>
                                                                                <Link
                                                                                        href="/sign-up"
                                                                                        onClick={() =>
                                                                                                setIsMenuOpen(false)
                                                                                        }
                                                                                >
                                                                                        <Button
                                                                                                size="sm"
                                                                                                className="w-full justify-start"
                                                                                        >
                                                                                                Sign Up
                                                                                        </Button>
                                                                                </Link>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>
                                )}
                        </div>
                </nav>
        );
}
