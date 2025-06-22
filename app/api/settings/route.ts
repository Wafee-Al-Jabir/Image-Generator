import { NextResponse } from "next/server"
import { settingsDb } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const settings = await settingsDb.findByUserId(userId)
    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: error.message || "Failed to get settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, ...settingsUpdates } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await settingsDb.update(userId, settingsUpdates)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 })
  }
}
