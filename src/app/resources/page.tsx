import { Navbar } from "@/components/navbar"
import { EmergencyBanner } from "@/components/emergency-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, Activity, PenTool as Tool, Clock, Users } from "lucide-react"

export default function ResourcesPage() {
  const categories = [
    { name: "Stress Management", count: 12, color: "bg-blue-100 text-blue-800" },
    { name: "Anxiety Support", count: 8, color: "bg-green-100 text-green-800" },
    { name: "Depression Help", count: 6, color: "bg-purple-100 text-purple-800" },
    { name: "Self-Care", count: 15, color: "bg-pink-100 text-pink-800" },
    { name: "Academic Pressure", count: 10, color: "bg-orange-100 text-orange-800" },
    { name: "Relationships", count: 7, color: "bg-indigo-100 text-indigo-800" },
  ]

  const featuredResources = [
    {
      title: "5-Minute Breathing Exercise",
      description: "A quick guided breathing technique to help reduce anxiety and stress in the moment.",
      type: "exercise",
      category: "Stress Management",
      duration: "5 min",
      icon: Activity,
    },
    {
      title: "Understanding Academic Burnout",
      description: "Learn to recognize the signs of burnout and discover practical strategies for recovery.",
      type: "article",
      category: "Academic Pressure",
      duration: "8 min read",
      icon: BookOpen,
    },
    {
      title: "Sleep Hygiene for Students",
      description: "Evidence-based tips for improving sleep quality and establishing healthy sleep habits.",
      type: "video",
      category: "Self-Care",
      duration: "12 min",
      icon: Video,
    },
    {
      title: "Mindfulness Meditation Guide",
      description: "Step-by-step instructions for practicing mindfulness meditation as a beginner.",
      type: "tool",
      category: "Anxiety Support",
      duration: "15 min",
      icon: Tool,
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return BookOpen
      case "video":
        return Video
      case "exercise":
        return Activity
      case "tool":
        return Tool
      default:
        return BookOpen
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmergencyBanner />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore our curated collection of evidence-based resources designed specifically for students. Find
            articles, videos, exercises, and tools to support your mental health journey.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-sm mb-2">{category.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} resources
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredResources.map((resource, index) => {
              const IconComponent = resource.icon
              return (
                <Card key={index} className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-2">
                            {resource.category}
                          </Badge>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">{resource.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {resource.duration}
                      </div>
                      <Button size="sm">Access Resource</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Need Help Finding Resources?</h2>
            <p className="text-muted-foreground">
              Our resource library is constantly growing. Can't find what you're looking for?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Request a Resource
            </Button>
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse All Resources
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
