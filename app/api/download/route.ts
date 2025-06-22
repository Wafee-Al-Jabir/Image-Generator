import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const response = await fetch(imageUrl)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status })
    }

    const imageBlob = await response.blob()
    const headers = new Headers()
    headers.set("Content-Type", response.headers.get("Content-Type") || "image/png")
    headers.set("Content-Length", imageBlob.size.toString())
    headers.set("Content-Disposition", `attachment; filename="leonardo-ai-image.png"`)

    return new NextResponse(imageBlob, {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error("Download error:", error)
    return NextResponse.json({ error: error.message || "Failed to download image" }, { status: 500 })
  }
}
