"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Download, Share2, MoreHorizontal } from "lucide-react"

interface PersonalFeedProps {
  generatedImages: any[]
}

export function PersonalFeed({ generatedImages }: PersonalFeedProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Personal Feed</h1>
        <p className="text-slate-400">Your personal collection of AI-generated images</p>
      </div>

      {generatedImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedImages.map((image) => (
            <Card key={image.id} className="bg-slate-800 border-slate-700 overflow-hidden">
              <div className="aspect-square">
                <img src={image.url || "/placeholder.svg"} alt={image.prompt} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <p className="text-white font-medium mb-2 line-clamp-2">{image.prompt}</p>
                <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                  <span>{image.model}</span>
                  <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Heart className={`w-4 h-4 ${image.liked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">No images in your personal feed yet. Start generating to see them here!</p>
        </div>
      )}
    </div>
  )
}
