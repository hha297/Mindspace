import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import MoodLog from "@/lib/models/MoodLog"
import Resource from "@/lib/models/Resource"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get basic stats
    const [totalUsers, totalMoodLogs, totalResources, recentUsers] = await Promise.all([
      User.countDocuments(),
      MoodLog.countDocuments(),
      Resource.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt streakCount"),
    ])

    // Get mood distribution
    const moodDistribution = await MoodLog.aggregate([
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 },
        },
      },
    ])

    // Get daily active users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyActiveUsers = await MoodLog.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          date: "$_id",
          activeUsers: { $size: "$uniqueUsers" },
        },
      },
      {
        $sort: { date: 1 },
      },
    ])

    return NextResponse.json({
      totalUsers,
      totalMoodLogs,
      totalResources,
      recentUsers,
      moodDistribution,
      dailyActiveUsers,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
