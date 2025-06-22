"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Download, MoreHorizontal, Grid3X3, List } from "lucide-react"

export function ImageGallery() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock data for generated images
  const images = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    url: `/placeholder.svg?height=300&width=300&text=Generated+Image+${i + 1}`,
    prompt: `A beautiful landscape with mountains and rivers, digital art style ${i + 1}`,
    model: "Leonardo Diffusion XL",
    likes: Math.floor(Math.random() * 100),
    isLiked: Math.random() > 0.5,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Recent Creations</h2>
          <p className="text-gray-400">Your latest AI generated images</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {images.map((image) => (
          <Card key={image.id} className="bg-gray-800 border-gray-700 overflow-hidden group">
            <div className="relative">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.prompt}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary">
                  <Heart className={`w-4 h-4 ${image.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button size="icon" variant="secondary">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-300 mb-2 line-clamp-2">{image.prompt}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{image.model}</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{image.likes}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
