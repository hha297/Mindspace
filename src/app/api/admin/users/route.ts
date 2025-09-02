import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import MoodLog from "@/lib/models/MoodLog"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const filter: any = {}
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("name email provider createdAt streakCount badges lastMoodLog"),
      User.countDocuments(filter),
    ])

    // Get mood log counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const moodLogCount = await MoodLog.countDocuments({ userId: user._id })
        return {
          ...user.toObject(),
          moodLogCount,
        }
      }),
    )

    return NextResponse.json({
      users: usersWithStats,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
