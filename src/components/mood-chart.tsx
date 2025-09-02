"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { format, subDays, startOfDay } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Calendar } from "lucide-react"

interface MoodLog {
  _id: string
  mood: string
  moodScore: number
  createdAt: string
}

interface ChartData {
  date: string
  mood: number
  label: string
}

export function MoodChart() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMoodLogs()
  }, [])

  const fetchMoodLogs = async () => {
    try {
      const response = await fetch("/api/mood?limit=30")
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

  const prepareChartData = (): ChartData[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), i))
      return {
        date: format(date, "yyyy-MM-dd"),
        label: format(date, "MMM d"),
        mood: 0,
        count: 0,
      }
    }).reverse()

    // Group mood logs by date and calculate average
    moodLogs.forEach((log) => {
      const logDate = format(startOfDay(new Date(log.createdAt)), "yyyy-MM-dd")
      const dayData = last7Days.find((day) => day.date === logDate)
      if (dayData) {
        dayData.mood = (dayData.mood * dayData.count + log.moodScore) / (dayData.count + 1)
        dayData.count += 1
      }
    })

    return last7Days
      .map(({ date, label, mood, count }) => ({
        date,
        label,
        mood: count > 0 ? Math.round(mood * 10) / 10 : null,
      }))
      .filter((day) => day.mood !== null) as ChartData[]
  }

  const getMoodDistribution = () => {
    const distribution = {
      "Very Sad": 0,
      Sad: 0,
      Neutral: 0,
      Happy: 0,
      "Very Happy": 0,
    }

    moodLogs.forEach((log) => {
      switch (log.mood) {
        case "very-sad":
          distribution["Very Sad"]++
          break
        case "sad":
          distribution["Sad"]++
          break
        case "neutral":
          distribution["Neutral"]++
          break
        case "happy":
          distribution["Happy"]++
          break
        case "very-happy":
          distribution["Very Happy"]++
          break
      }
    })

    return Object.entries(distribution).map(([mood, count]) => ({
      mood,
      count,
      percentage: moodLogs.length > 0 ? Math.round((count / moodLogs.length) * 100) : 0,
    }))
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Trend</CardTitle>
            <CardDescription>Your mood over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Breakdown of your mood entries</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (moodLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Analytics</CardTitle>
          <CardDescription>Track your mood patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No data to display</h3>
            <p className="text-muted-foreground">Log a few mood entries to see your patterns and trends.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = prepareChartData()
  const distributionData = getMoodDistribution()

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Mood Trend</span>
          </CardTitle>
          <CardDescription>Your mood over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[1, 5]} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => [value, "Mood Score"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Not enough data for trend analysis</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
          <CardDescription>Breakdown of your mood entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="mood"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: number) => [value, "Count"]} labelFormatter={(label) => `Mood: ${label}`} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
