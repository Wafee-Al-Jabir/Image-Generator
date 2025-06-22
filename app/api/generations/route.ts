import { NextResponse } from "next/server"
import { generationDb } from "@/lib/database"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, prompt, negativePrompt, model, imageUrl, settings } = body

    const generationId = randomUUID()
    const generation = {
      id: generationId,
      userId,
      prompt,
      negativePrompt,
      model,
      imageUrl,
      settings: JSON.stringify(settings),
      liked: 0,
    }

    await generationDb.create(generation)
    return NextResponse.json({ success: true, generation })
  } catch (error: any) {
    console.error("Generation save error:", error)
    return NextResponse.json({ error: error.message || "Failed to save generation" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const generations = await generationDb.findByUserId(userId, limit)
    return NextResponse.json({ generations })
  } catch (error: any) {
    console.error("Get generations error:", error)
    return NextResponse.json({ error: error.message || "Failed to get generations" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, liked } = body

    await generationDb.updateLiked(id, liked ? 1 : 0)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update generation error:", error)
    return NextResponse.json({ error: error.message || "Failed to update generation" }, { status: 500 })
  }
}
