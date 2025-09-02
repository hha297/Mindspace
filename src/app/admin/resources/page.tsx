"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Plus, Edit, Trash2, BookOpen, Video, Activity, PenTool as Tool, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"

interface Resource {
  _id: string
  title: string
  description: string
  content: string
  category: string
  type: string
  url?: string
  isPublished: boolean
  createdBy: {
    name?: string
    email: string
  }
  createdAt: string
  views: number
  likes: number
}

const categories = [
  { value: "stress", label: "Stress Management" },
  { value: "anxiety", label: "Anxiety Support" },
  { value: "depression", label: "Depression Help" },
  { value: "self-care", label: "Self-Care" },
  { value: "academic", label: "Academic Pressure" },
  { value: "relationships", label: "Relationships" },
]

const types = [
  { value: "article", label: "Article", icon: BookOpen },
  { value: "video", label: "Video", icon: Video },
  { value: "exercise", label: "Exercise", icon: Activity },
  { value: "tool", label: "Tool", icon: Tool },
]

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    type: "",
    url: "",
    isPublished: false,
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/admin/resources")
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources)
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingResource ? `/api/admin/resources/${editingResource._id}` : "/api/admin/resources"

      const method = editingResource ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingResource ? "Resource updated" : "Resource created", {
          description: `The resource has been ${editingResource ? "updated" : "created"} successfully.`,
        })

        setIsDialogOpen(false)
        setEditingResource(null)
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "",
          type: "",
          url: "",
          isPublished: false,
        })
        fetchResources()
      } else {
        throw new Error("Failed to save resource")
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save resource. Please try again.",
      })
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description,
      content: resource.content,
      category: resource.category,
      type: resource.type,
      url: resource.url || "",
      isPublished: resource.isPublished,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Resource deleted", {
          description: "The resource has been deleted successfully.",
        })
        fetchResources()
      } else {
        throw new Error("Failed to delete resource")
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete resource. Please try again.",
      })
    }
  }

  const togglePublished = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/admin/resources/${resource._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !resource.isPublished }),
      })

      if (response.ok) {
        toast.success(resource.isPublished ? "Resource unpublished" : "Resource published", {
          description: `The resource is now ${resource.isPublished ? "hidden" : "visible"} to users.`,
        })
        fetchResources()
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update resource status.",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = types.find((t) => t.value === type)
    return typeConfig ? typeConfig.icon : BookOpen
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Resource Management</h1>
          <p className="text-muted-foreground">Manage mental health resources and educational content</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingResource(null)
                setFormData({
                  title: "",
                  description: "",
                  content: "",
                  category: "",
                  type: "",
                  url: "",
                  isPublished: false,
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingResource ? "Edit Resource" : "Create New Resource"}</DialogTitle>
              <DialogDescription>
                {editingResource
                  ? "Update the resource information below."
                  : "Fill in the details to create a new mental health resource."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="url">URL (optional)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                  placeholder="Write the full content of the resource..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingResource ? "Update Resource" : "Create Resource"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resources ({resources.length})</CardTitle>
          <CardDescription>All mental health resources and their status</CardDescription>
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
                <TableHead>Engagement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type)
                return (
                  <TableRow key={resource._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{resource.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {resource.category.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4" />
                        <span className="capitalize">{resource.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {resource.isPublished ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant={resource.isPublished ? "default" : "secondary"}>
                          {resource.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(resource.createdAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{resource.views} views</div>
                        <div className="text-muted-foreground">{resource.likes} likes</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => togglePublished(resource)}>
                          {resource.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(resource)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(resource._id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
