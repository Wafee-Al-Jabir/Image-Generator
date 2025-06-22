"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Settings } from "lucide-react"

interface GenerationHistoryProps {
  generatedImages: any[]
}

export function GenerationHistory({ generatedImages }: GenerationHistoryProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Generation History</h1>
        <p className="text-slate-400">View all your past generations and their settings</p>
      </div>

      {generatedImages.length > 0 ? (
        <div className="space-y-4">
          {generatedImages.map((image) => (
            <Card key={image.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{image.prompt}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(image.timestamp).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(image.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {image.model}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        Steps: {image.settings?.steps || 20}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        Guidance: {image.settings?.guidanceScale || 7}
                      </Badge>
                    </div>
                    {image.settings?.negativePrompt && (
                      <p className="text-sm text-slate-500">
                        <strong>Negative:</strong> {image.settings.negativePrompt}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Settings className="w-4 h-4 mr-2" />
                      Reuse Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">No generation history yet. Start creating to see your history here!</p>
        </div>
      )}
    </div>
  )
}
