"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"

interface MoodLog {
  _id: string
  mood: string
  moodScore: number
  note?: string
  tags: string[]
  createdAt: string
}

const moodEmojis: Record<string, string> = {
  "very-sad": "😢",
  sad: "😔",
  neutral: "😐",
  happy: "😊",
  "very-happy": "😄",
}

const moodLabels: Record<string, string> = {
  "very-sad": "Very Sad",
  sad: "Sad",
  neutral: "Neutral",
  happy: "Happy",
  "very-happy": "Very Happy",
}

const moodColors: Record<string, string> = {
  "very-sad": "bg-red-100 text-red-800",
  sad: "bg-orange-100 text-orange-800",
  neutral: "bg-gray-100 text-gray-800",
  happy: "bg-green-100 text-green-800",
  "very-happy": "bg-emerald-100 text-emerald-800",
}

export function MoodHistory() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchMoodLogs()
  }, [])

  const fetchMoodLogs = async () => {
    try {
      const response = await fetch("/api/mood")
      if (response.ok) {
        const data = await response.json()
        setMoodLogs(data.moodLogs)
      }
    } catch (error) {
      console.error("Failed to fetch mood logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM d, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const getAverageMood = () => {
    if (moodLogs.length === 0) return 0
    const sum = moodLogs.reduce((acc, log) => acc + log.moodScore, 0)
    return sum / moodLogs.length
  }

  const getTrend = () => {
    if (moodLogs.length < 2) return "neutral"
    const recent = moodLogs.slice(0, 3)
    const older = moodLogs.slice(3, 6)

    if (recent.length === 0 || older.length === 0) return "neutral"

    const recentAvg = recent.reduce((acc, log) => acc + log.moodScore, 0) / recent.length
    const olderAvg = older.reduce((acc, log) => acc + log.moodScore, 0) / older.length

    if (recentAvg > olderAvg + 0.3) return "up"
    if (recentAvg < olderAvg - 0.3) return "down"
    return "neutral"
  }

  const displayedLogs = showAll ? moodLogs : moodLogs.slice(0, 5)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Your recent mood entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (moodLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>Your recent mood entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
            <p className="text-muted-foreground">Start tracking your mood to see patterns and insights over time.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const averageMood = getAverageMood()
  const trend = getTrend()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mood History</CardTitle>
            <CardDescription>Your recent mood entries and trends</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Average Mood</div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{averageMood.toFixed(1)}</span>
              {trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
              {trend === "neutral" && <Minus className="h-4 w-4 text-gray-600" />}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedLogs.map((log) => (
          <div key={log._id} className="flex items-start space-x-4 p-4 rounded-lg border">
            <div className="text-3xl">{moodEmojis[log.mood]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={moodColors[log.mood]}>{moodLabels[log.mood]}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(log.createdAt)} at {formatTime(log.createdAt)}
                </span>
              </div>
              {log.note && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{log.note}</p>}
              {log.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {log.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {moodLogs.length > 5 && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : `Show All ${moodLogs.length} Entries`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
