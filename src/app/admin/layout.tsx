import type React from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
        return (
                <div className="flex h-screen bg-background">
                        <AdminSidebar />
                        <main className="flex-1 overflow-y-auto md:ml-0 pt-16 md:pt-0">{children}</main>
                </div>
        );
}
