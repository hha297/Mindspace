import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Resource from "@/lib/models/Resource"
import User from "@/lib/models/User"

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
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const published = searchParams.get("published")

    const filter: any = {}
    if (category) filter.category = category
    if (type) filter.type = type
    if (published !== null) filter.isPublished = published === "true"

    const [resources, totalResources] = await Promise.all([
      Resource.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Resource.countDocuments(filter),
    ])

    return NextResponse.json({
      resources,
      totalResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, content, category, type, url, isPublished } = await request.json()

    if (!title || !description || !content || !category || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const resource = await Resource.create({
      title,
      description,
      content,
      category,
      type,
      url,
      isPublished: isPublished || false,
      createdBy: user._id,
    })

    await resource.populate("createdBy", "name email")

    return NextResponse.json({ resource })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
