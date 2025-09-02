import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Resource from "@/lib/models/Resource"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    await dbConnect()

    const resource = await Resource.findByIdAndUpdate(params.id, updates, { new: true }).populate(
      "createdBy",
      "name email",
    )

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ resource })
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const resource = await Resource.findByIdAndDelete(params.id)

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
