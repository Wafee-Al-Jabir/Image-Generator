import { NextResponse } from "next/server"
import { userDb, settingsDb } from "@/lib/database"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, password, type } = body

    if (type === "signin") {
      // Find existing user
      const user = await userDb.findByEmail(email)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Get user settings
      let settings = await settingsDb.findByUserId(user.id)
      if (!settings) {
        // Create default settings
        settings = {
          userId: user.id,
          autoSave: 1,
          highQuality: 0,
          defaultModel: "flux-schnell",
          emailNotifications: 1,
          pushNotifications: 1,
          publicGallery: 0,
          analytics: 1,
        }
        await settingsDb.create(settings)
      }

      return NextResponse.json({ user, settings })
    } else {
      // Create new user
      const existingUser = await userDb.findByEmail(email)
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }

      const userId = randomUUID()
      const user = {
        id: userId,
        email,
        firstName,
        lastName,
        plan: "Free",
        credits: 1000,
        joinDate: new Date().toISOString(),
        settings: "{}",
      }

      await userDb.create(user)

      // Create default settings
      const settings = {
        userId,
        autoSave: 1,
        highQuality: 0,
        defaultModel: "flux-schnell",
        emailNotifications: 1,
        pushNotifications: 1,
        publicGallery: 0,
        analytics: 1,
      }
      await settingsDb.create(settings)

      return NextResponse.json({ user, settings })
    }
  } catch (error: any) {
    console.error("User operation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
