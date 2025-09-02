'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, BarChart3, BookOpen, Wrench, Menu, X, LogOut, User, Settings } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
        const { data: session, update } = useSession();
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [userName, setUserName] = useState<string | null>(null);

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

        // TODO: Add admin link if user is admin

        const navigation = [
                { name: 'Home', href: '/', icon: Home },
                { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
                { name: 'Tools', href: '/tools', icon: Wrench },
                { name: 'Resources', href: '/resources', icon: BookOpen },
        ];

        return (
                <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                        <div className="hidden md:flex items-center space-x-8">
                                                {navigation.map((item) => {
                                                        const Icon = item.icon;
                                                        return (
                                                                <Link
                                                                        key={item.name}
                                                                        href={item.href}
                                                                        className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                                                                <Link
                                                                        href="/profile"
                                                                        className="hover:bg-primary hover:text-white rounded-md py-1 px-2 "
                                                                >
                                                                        <div className="flex items-center space-x-2 text-sm">
                                                                                {session.user?.image ? (
                                                                                        <Image
                                                                                                src={session.user.image}
                                                                                                alt="Profile"
                                                                                                className="h-6 w-6 rounded-full"
                                                                                                width={24}
                                                                                                height={24}
                                                                                        />
                                                                                ) : (
                                                                                        <User className="h-4 w-4" />
                                                                                )}
                                                                                <p>
                                                                                        {userName ||
                                                                                                session.user?.name ||
                                                                                                session.user?.email}
                                                                                </p>
                                                                        </div>
                                                                </Link>

                                                                <Button
                                                                        onClick={() => {
                                                                                localStorage.removeItem('userName');
                                                                                signOut({ callbackUrl: '/' });
                                                                        }}
                                                                        variant="outline"
                                                                        size="sm"
                                                                >
                                                                        <LogOut className="h-4 w-4 mr-2" />
                                                                        Sign Out
                                                                </Button>
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
                                                                return (
                                                                        <Link
                                                                                key={item.name}
                                                                                href={item.href}
                                                                                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                                                                onClick={() => setIsMenuOpen(false)}
                                                                        >
                                                                                <Icon className="h-5 w-5" />
                                                                                <span>{item.name}</span>
                                                                        </Link>
                                                                );
                                                        })}

                                                        {/* Mobile Auth Section */}
                                                        <div className="pt-4 border-t border-border">
                                                                {session ? (
                                                                        <div className="space-y-2">
                                                                                <div className="px-3 py-2 text-sm text-muted-foreground flex items-center space-x-2">
                                                                                        {session.user?.image ? (
                                                                                                <Image
                                                                                                        src={
                                                                                                                session
                                                                                                                        .user
                                                                                                                        .image
                                                                                                        }
                                                                                                        alt="Profile"
                                                                                                        className="h-5 w-5 rounded-full"
                                                                                                        width={20}
                                                                                                        height={20}
                                                                                                />
                                                                                        ) : (
                                                                                                <User className="h-4 w-4" />
                                                                                        )}
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
                                                                                                <Settings className="h-4 w-4 mr-2" />
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
                                                                                        <LogOut className="h-4 w-4 mr-2" />
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
                                                                                                className="w-full justify-start"
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
