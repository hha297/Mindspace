'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
        BookOpen,
        Video,
        Activity,
        PenTool,
        Clock,
        Plus,
        Edit,
        Trash2,
        Calendar,
        StarIcon,
        StarOffIcon,
} from 'lucide-react';
import { DeleteDialog } from '@/components/delete-dialog';

interface Resource {
        _id: string;
        title: string;
        description: string;
        content: string;
        category: string;
        type: string;
        duration?: number;
        url?: string;
        tags: string[];
        featured: boolean;
        createdAt: string;
        updatedAt: string;
}

const categories = [
        { value: 'Stress Management', label: 'Stress Management' },
        { value: 'Anxiety Support', label: 'Anxiety Support' },
        { value: 'Depression Help', label: 'Depression Help' },
        { value: 'Self-Care', label: 'Self-Care' },
        { value: 'Academic Pressure', label: 'Academic Pressure' },
        { value: 'Relationships', label: 'Relationships' },
];

const types = [
        { value: 'article', label: 'Article', icon: BookOpen },
        { value: 'video', label: 'Video', icon: Video },
        { value: 'exercise', label: 'Exercise', icon: Activity },
        { value: 'meditation', label: 'Meditation', icon: Clock },
        { value: 'tool', label: 'Tool', icon: PenTool },
];

export default function AdminResourcesPage() {
        const [resources, setResources] = useState<Resource[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [editingResource, setEditingResource] = useState<Resource | null>(null);
        const [formData, setFormData] = useState({
                title: '',
                description: '',
                content: '',
                category: '',
                type: '',
                url: '',
                tags: [] as string[],
                featured: false,
        });

        useEffect(() => {
                fetchResources();
        }, []);

        const fetchResources = async () => {
                try {
                        const response = await fetch('/api/admin/resources');
                        if (response.ok) {
                                const data = await response.json();
                                setResources(data.resources || []);
                        } else {
                                toast.error('Failed to fetch resources');
                        }
                } catch (error) {
                        console.error('Error fetching resources:', error);
                        toast.error('Failed to fetch resources');
                } finally {
                        setIsLoading(false);
                }
        };

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                try {
                        const url = editingResource
                                ? `/api/admin/resources/${editingResource._id}`
                                : '/api/admin/resources';
                        const method = editingResource ? 'PUT' : 'POST';

                        const response = await fetch(url, {
                                method,
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(formData),
                        });

                        if (response.ok) {
                                toast.success(
                                        editingResource
                                                ? 'Resource updated successfully!'
                                                : 'Resource created successfully!',
                                );
                                setIsDialogOpen(false);
                                fetchResources();
                                setFormData({
                                        title: '',
                                        description: '',
                                        content: '',
                                        category: '',
                                        type: '',
                                        url: '',
                                        tags: [] as string[],
                                        featured: false,
                                });
                        } else {
                                const errorData = await response.json();
                                toast.error(errorData.error || 'Failed to save resource');
                        }
                } catch (error) {
                        console.error('Error saving resource:', error);
                        toast.error('Failed to save resource');
                }
        };

        const handleDelete = async (id: string) => {
                try {
                        const response = await fetch(`/api/admin/resources/${id}`, {
                                method: 'DELETE',
                        });

                        if (response.ok) {
                                toast.success('Resource deleted successfully!');
                                fetchResources();
                        } else {
                                toast.error('Failed to delete resource');
                        }
                } catch (error) {
                        console.error('Error deleting resource:', error);
                        toast.error('Failed to delete resource');
                }
        };

        const handleEdit = (resource: Resource) => {
                setEditingResource(resource);
                setFormData({
                        title: resource.title,
                        description: resource.description,
                        content: resource.content,
                        category: resource.category,
                        type: resource.type,
                        url: resource.url || '',
                        tags: resource.tags,
                        featured: resource.featured,
                });
                setIsDialogOpen(true);
        };

        const toggleFeatured = async (resource: Resource) => {
                try {
                        const response = await fetch(`/api/admin/resources/${resource._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        ...resource,
                                        featured: !resource.featured,
                                }),
                        });

                        if (response.ok) {
                                toast.success(
                                        resource.featured
                                                ? 'Resource unfeatured successfully!'
                                                : 'Resource featured successfully!',
                                );
                                fetchResources();
                        } else {
                                toast.error('Failed to update resource');
                        }
                } catch (error) {
                        console.error('Error updating resource:', error);
                        toast.error('Failed to update resource');
                }
        };

        const getTypeIcon = (type: string) => {
                const typeConfig = types.find((t) => t.value === type);
                return typeConfig ? typeConfig.icon : BookOpen;
        };

        if (isLoading) {
                return (
                        <div className="p-4 md:p-8">
                                <div className="mb-8">
                                        <Skeleton className="h-8 w-64 mb-2" />
                                        <Skeleton className="h-4 w-96" />
                                </div>
                                <Skeleton className="h-96 w-full" />
                        </div>
                );
        }

        return (
                <div className="p-4 md:p-8">
                        <div className="flex md:items-center items-end  flex-col md:flex-row justify-between mb-8">
                                <div>
                                        <h1 className="text-3xl font-bold text-foreground mb-2">Resource Management</h1>
                                        <p className="text-muted-foreground">
                                                Manage mental health resources and educational content
                                        </p>
                                </div>

                                <div className="flex gap-2 py-4">
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                <DialogTrigger asChild>
                                                        <Button
                                                                onClick={() => {
                                                                        setEditingResource(null);
                                                                        setFormData({
                                                                                title: '',
                                                                                description: '',
                                                                                content: '',
                                                                                category: '',
                                                                                type: '',
                                                                                url: '',
                                                                                tags: [] as string[],
                                                                                featured: false,
                                                                        });
                                                                }}
                                                        >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Add Resource
                                                        </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto w-[95vw] md:w-auto">
                                                        <DialogHeader>
                                                                <DialogTitle>
                                                                        {editingResource
                                                                                ? 'Edit Resource'
                                                                                : 'Create New Resource'}
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                        {editingResource
                                                                                ? 'Update the resource information below.'
                                                                                : 'Fill in the details to create a new mental health resource.'}
                                                                </DialogDescription>
                                                        </DialogHeader>

                                                        <form onSubmit={handleSubmit} className="space-y-6">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                                <Label
                                                                                        htmlFor="title"
                                                                                        className="text-base font-medium"
                                                                                >
                                                                                        Title
                                                                                </Label>
                                                                                <Input
                                                                                        id="title"
                                                                                        value={formData.title}
                                                                                        onChange={(e) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        title: e.target
                                                                                                                .value,
                                                                                                })
                                                                                        }
                                                                                        required
                                                                                        className="border-primary/50 focus:border-primary"
                                                                                />
                                                                        </div>
                                                                        <div>
                                                                                <Label
                                                                                        htmlFor="category"
                                                                                        className="text-base font-medium"
                                                                                >
                                                                                        Category
                                                                                </Label>
                                                                                <Select
                                                                                        value={formData.category}
                                                                                        onValueChange={(value) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        category: value,
                                                                                                })
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger className="border-primary/50 focus:border-primary">
                                                                                                <SelectValue placeholder="Select category" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {categories.map(
                                                                                                        (cat) => (
                                                                                                                <SelectItem
                                                                                                                        key={
                                                                                                                                cat.value
                                                                                                                        }
                                                                                                                        value={
                                                                                                                                cat.value
                                                                                                                        }
                                                                                                                >
                                                                                                                        {
                                                                                                                                cat.label
                                                                                                                        }
                                                                                                                </SelectItem>
                                                                                                        ),
                                                                                                )}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                                <Label
                                                                                        htmlFor="type"
                                                                                        className="text-base font-medium"
                                                                                >
                                                                                        Type
                                                                                </Label>
                                                                                <Select
                                                                                        value={formData.type}
                                                                                        onValueChange={(value) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        type: value,
                                                                                                })
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger className="border-primary/50 focus:border-primary">
                                                                                                <SelectValue placeholder="Select type" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {types.map((type) => (
                                                                                                        <SelectItem
                                                                                                                key={
                                                                                                                        type.value
                                                                                                                }
                                                                                                                value={
                                                                                                                        type.value
                                                                                                                }
                                                                                                        >
                                                                                                                {
                                                                                                                        type.label
                                                                                                                }
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </div>
                                                                        <div>
                                                                                <Label
                                                                                        htmlFor="url"
                                                                                        className="text-base font-medium"
                                                                                >
                                                                                        URL (Optional)
                                                                                </Label>
                                                                                <Input
                                                                                        id="url"
                                                                                        type="url"
                                                                                        value={formData.url}
                                                                                        onChange={(e) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        url: e.target
                                                                                                                .value,
                                                                                                })
                                                                                        }
                                                                                        placeholder="https://example.com"
                                                                                        className="border-primary/50 focus:border-primary"
                                                                                />
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        <Label
                                                                                htmlFor="description"
                                                                                className="text-base font-medium"
                                                                        >
                                                                                Description
                                                                        </Label>
                                                                        <Textarea
                                                                                id="description"
                                                                                value={formData.description}
                                                                                onChange={(e) =>
                                                                                        setFormData({
                                                                                                ...formData,
                                                                                                description:
                                                                                                        e.target.value,
                                                                                        })
                                                                                }
                                                                                required
                                                                                rows={4}
                                                                                placeholder="Brief description of the resource"
                                                                                className="border-primary/50 focus:border-primary"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <Label
                                                                                htmlFor="content"
                                                                                className="text-base font-medium"
                                                                        >
                                                                                Content
                                                                        </Label>
                                                                        <div>
                                                                                <Textarea
                                                                                        id="content"
                                                                                        value={formData.content}
                                                                                        onChange={(e) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        content: e
                                                                                                                .target
                                                                                                                .value,
                                                                                                })
                                                                                        }
                                                                                        rows={8}
                                                                                        placeholder="Detailed content or instructions"
                                                                                        className="border-primary/50 focus:border-primary"
                                                                                />
                                                                                <div className="flex justify-between items-center mt-2">
                                                                                        <span className="text-xs text-muted-foreground">
                                                                                                {
                                                                                                        formData.content
                                                                                                                .length
                                                                                                }
                                                                                                /10000 characters
                                                                                        </span>
                                                                                        {formData.content.length >
                                                                                                9000 && (
                                                                                                <span className="text-xs text-orange-600">
                                                                                                        Approaching
                                                                                                        limit
                                                                                                </span>
                                                                                        )}
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                        <Switch
                                                                                id="featured"
                                                                                checked={formData.featured}
                                                                                onCheckedChange={(checked) =>
                                                                                        setFormData({
                                                                                                ...formData,
                                                                                                featured: checked,
                                                                                        })
                                                                                }
                                                                        />
                                                                        <Label
                                                                                htmlFor="featured"
                                                                                className="text-base font-medium"
                                                                        >
                                                                                Feature this resource
                                                                        </Label>
                                                                </div>

                                                                <div className="flex justify-end space-x-2">
                                                                        <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                onClick={() => setIsDialogOpen(false)}
                                                                        >
                                                                                Cancel
                                                                        </Button>
                                                                        <Button type="submit">
                                                                                {editingResource
                                                                                        ? 'Update Resource'
                                                                                        : 'Create Resource'}
                                                                        </Button>
                                                                </div>
                                                        </form>
                                                </DialogContent>
                                        </Dialog>
                                </div>
                        </div>

                        {/* Resources List - Mobile Card View */}
                        <div className="space-y-4 pb-8 md:hidden">
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h2 className="text-xl font-semibold">
                                                        Resources ({resources.length})
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                        All mental health resources and their status
                                                </p>
                                        </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                        {resources.map((resource) => {
                                                const TypeIcon = getTypeIcon(resource.type);
                                                return (
                                                        <Card key={resource._id} className="p-4">
                                                                <div className="flex items-start justify-between">
                                                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                        <TypeIcon className="h-5 w-5 text-primary" />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                        <h3 className="font-medium text-sm truncate">
                                                                                                {resource.title}
                                                                                        </h3>
                                                                                        <p className="text-xs text-muted-foreground truncate">
                                                                                                {resource.description}
                                                                                        </p>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-2">
                                                                                <Badge
                                                                                        variant="outline"
                                                                                        className="text-xs capitalize"
                                                                                >
                                                                                        {resource.category}
                                                                                </Badge>
                                                                                <Badge
                                                                                        variant={
                                                                                                resource.featured
                                                                                                        ? 'default'
                                                                                                        : 'secondary'
                                                                                        }
                                                                                        className="text-xs"
                                                                                >
                                                                                        {resource.featured
                                                                                                ? 'Featured'
                                                                                                : 'Regular'}
                                                                                </Badge>
                                                                        </div>
                                                                </div>

                                                                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                                                        <div className="flex items-center space-x-1">
                                                                                <TypeIcon className="h-3 w-3 text-muted-foreground" />
                                                                                <span className="text-muted-foreground capitalize">
                                                                                        {resource.type}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                                                <span className="text-muted-foreground">
                                                                                        {format(
                                                                                                new Date(
                                                                                                        resource.createdAt,
                                                                                                ),
                                                                                                'MMM d, yyyy',
                                                                                        )}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                                {resource.featured ? (
                                                                                        <StarIcon className="h-3 w-3 text-green-600" />
                                                                                ) : (
                                                                                        <StarOffIcon className="h-3 w-3 text-muted-foreground" />
                                                                                )}
                                                                                <span className="text-muted-foreground">
                                                                                        {resource.featured
                                                                                                ? 'Featured'
                                                                                                : 'Regular'}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                                <span className="text-muted-foreground">
                                                                                        {resource.url
                                                                                                ? 'Has URL'
                                                                                                : 'No URL'}
                                                                                </span>
                                                                        </div>
                                                                </div>

                                                                <div className="mt-3 flex gap-2">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => toggleFeatured(resource)}
                                                                                className="flex-1"
                                                                        >
                                                                                {resource.featured ? (
                                                                                        <StarIcon className="h-3 w-3 mr-1" />
                                                                                ) : (
                                                                                        <StarOffIcon className="h-3 w-3 mr-1" />
                                                                                )}
                                                                                {resource.featured
                                                                                        ? 'Unfeature'
                                                                                        : 'Feature'}
                                                                        </Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => handleEdit(resource)}
                                                                                className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                        >
                                                                                <Edit className="h-3 w-3 mr-1" />
                                                                                Edit
                                                                        </Button>
                                                                        <DeleteDialog
                                                                                title="Delete Resource"
                                                                                description={`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`}
                                                                                onDelete={() =>
                                                                                        handleDelete(resource._id)
                                                                                }
                                                                                trigger={
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                        >
                                                                                                <Trash2 className="h-3 w-3 mr-1" />
                                                                                                Delete
                                                                                        </Button>
                                                                                }
                                                                        />
                                                                </div>
                                                        </Card>
                                                );
                                        })}
                                </div>
                        </div>

                        {/* Resources Table - Desktop View */}
                        <div className="hidden md:block">
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Resources ({resources.length})</CardTitle>
                                                <CardDescription>
                                                        All mental health resources and their status
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <Table>
                                                        <TableHeader>
                                                                <TableRow>
                                                                        <TableHead>Resource</TableHead>
                                                                        <TableHead>Category</TableHead>
                                                                        <TableHead>Type</TableHead>
                                                                        <TableHead>Status</TableHead>
                                                                        <TableHead>Created</TableHead>
                                                                        <TableHead>Actions</TableHead>
                                                                </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                                {resources.map((resource) => {
                                                                        const TypeIcon = getTypeIcon(resource.type);
                                                                        return (
                                                                                <TableRow key={resource._id}>
                                                                                        <TableCell>
                                                                                                <div className="space-y-2">
                                                                                                        <div className="font-medium">
                                                                                                                {
                                                                                                                        resource.title
                                                                                                                }
                                                                                                        </div>
                                                                                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                                                                                                {
                                                                                                                        resource.description
                                                                                                                }
                                                                                                        </div>
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Badge
                                                                                                        variant="outline"
                                                                                                        className="capitalize"
                                                                                                >
                                                                                                        {
                                                                                                                resource.category
                                                                                                        }
                                                                                                </Badge>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                        <TypeIcon className="h-4 w-4" />
                                                                                                        <span className="capitalize">
                                                                                                                {
                                                                                                                        resource.type
                                                                                                                }
                                                                                                        </span>
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                        {resource.featured ? (
                                                                                                                <StarIcon className="h-4 w-4 text-green-600" />
                                                                                                        ) : (
                                                                                                                <StarOffIcon className="h-4 w-4 text-gray-400" />
                                                                                                        )}
                                                                                                        <Badge
                                                                                                                variant={
                                                                                                                        resource.featured
                                                                                                                                ? 'default'
                                                                                                                                : 'secondary'
                                                                                                                }
                                                                                                        >
                                                                                                                {resource.featured
                                                                                                                        ? 'Featured'
                                                                                                                        : 'Regular'}
                                                                                                        </Badge>
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                        {format(
                                                                                                                new Date(
                                                                                                                        resource.createdAt,
                                                                                                                ),
                                                                                                                'MMM d, yyyy',
                                                                                                        )}
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                        <Button
                                                                                                                variant="outline"
                                                                                                                size="sm"
                                                                                                                onClick={() =>
                                                                                                                        toggleFeatured(
                                                                                                                                resource,
                                                                                                                        )
                                                                                                                }
                                                                                                        >
                                                                                                                {resource.featured ? (
                                                                                                                        <StarOffIcon className="h-4 w-4" />
                                                                                                                ) : (
                                                                                                                        <StarIcon className="h-4 w-4" />
                                                                                                                )}
                                                                                                        </Button>
                                                                                                        <Button
                                                                                                                variant="outline"
                                                                                                                size="sm"
                                                                                                                onClick={() =>
                                                                                                                        handleEdit(
                                                                                                                                resource,
                                                                                                                        )
                                                                                                                }
                                                                                                        >
                                                                                                                <Edit className="h-4 w-4" />
                                                                                                        </Button>
                                                                                                        <DeleteDialog
                                                                                                                title="Delete Resource"
                                                                                                                description={`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`}
                                                                                                                onDelete={() =>
                                                                                                                        handleDelete(
                                                                                                                                resource._id,
                                                                                                                        )
                                                                                                                }
                                                                                                                trigger={
                                                                                                                        <Button
                                                                                                                                variant="outline"
                                                                                                                                size="sm"
                                                                                                                        >
                                                                                                                                <Trash2 className="h-4 w-4" />
                                                                                                                        </Button>
                                                                                                                }
                                                                                                        />
                                                                                                </div>
                                                                                        </TableCell>
                                                                                </TableRow>
                                                                        );
                                                                })}
                                                        </TableBody>
                                                </Table>
                                        </CardContent>
                                </Card>
                        </div>
                </div>
        );
}
