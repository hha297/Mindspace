'use client';

import { useState } from 'react';
import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteDialogProps {
        title: string;
        description: string;
        icon?: React.ReactNode;
        onDelete: () => void;
        trigger?: React.ReactNode;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
        size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DeleteDialog({
        title,
        description,
        icon = <Trash2 className="h-4 w-4" />,
        onDelete,
        trigger,
        variant = 'destructive',
        size = 'sm',
}: DeleteDialogProps) {
        const [isOpen, setIsOpen] = useState(false);

        const handleDelete = () => {
                onDelete();
                setIsOpen(false);
        };

        return (
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger asChild>
                                {trigger || (
                                        <Button variant={variant} size={size}>
                                                {icon}
                                                {variant !== 'destructive' && 'Delete'}
                                        </Button>
                                )}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                                <AlertDialogHeader>
                                        <AlertDialogTitle>{title}</AlertDialogTitle>
                                        <AlertDialogDescription>{description}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                                Delete
                                        </AlertDialogAction>
                                </AlertDialogFooter>
                        </AlertDialogContent>
                </AlertDialog>
        );
}
