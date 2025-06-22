"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, TrendingUp, Bookmark, Heart } from "lucide-react"
import type { PageType } from "@/app/page"

interface DashboardProps {
  onNavigate: (page: PageType) => void
  totalGenerations: number
  creditsUsed: number
  creditsRemaining: number
  favoriteImages: number
  generatedImages: any[]
}

export function Dashboard({
  onNavigate,
  totalGenerations,
  creditsUsed,
  creditsRemaining,
  favoriteImages,
  generatedImages,
}: DashboardProps) {
  const stats = [
    {
      title: "Total Generations",
      value: totalGenerations.toString(),
      icon: ImageIcon,
      iconColor: "text-blue-400",
      bgColor: "bg-slate-800",
    },
    {
      title: "Credits Used",
      value: creditsUsed.toString(),
      icon: TrendingUp,
      iconColor: "text-green-400",
      bgColor: "bg-slate-800",
    },
    {
      title: "Credits Remaining",
      value: creditsRemaining.toString(),
      icon: Bookmark,
      iconColor: "text-yellow-400",
      bgColor: "bg-slate-800",
    },
    {
      title: "Favorite Images",
      value: favoriteImages.toString(),
      icon: Heart,
      iconColor: "text-red-400",
      bgColor: "bg-slate-800",
    },
  ]

  // Show recent generations from actual data
  const recentGenerations = generatedImages.slice(0, 3).map((img) => ({
    title: img.prompt.length > 30 ? img.prompt.substring(0, 30) + "..." : img.prompt,
    time: new Date(img.timestamp).toLocaleString(),
  }))

  // If no generations, show placeholder
  const displayGenerations =
    recentGenerations.length > 0 ? recentGenerations : [{ title: "No generations yet", time: "Start creating!" }]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Alex!</h1>
        <p className="text-slate-400">
          {totalGenerations > 0 ? "Here's your creative journey overview" : "Ready to start your creative journey?"}
        </p>
      </div>

      {/* Stats cards with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-slate-700`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-slate-700`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rest of component with updated recent generations */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to create something amazing?</h2>
        <p className="text-purple-100 mb-6">Start generating AI art with our powerful models</p>
        <Button
          className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-3 rounded-lg"
          onClick={() => onNavigate("ai-generation")}
        >
          Start Creating
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Generations</h3>
            <div className="space-y-3">
              {displayGenerations.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {totalGenerations > 0 && (
              <Button
                variant="outline"
                className="w-full mt-4 border-slate-600 text-slate-300 hover:text-white"
                onClick={() => onNavigate("generation-history")}
              >
                View All
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Popular models card remains the same */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Popular Models</h3>
            <div className="space-y-3">
              {["Leonardo Diffusion XL", "PhotoReal", "Anime Pastel Dream"].map((model, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-white font-medium">{model}</span>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => onNavigate("ai-generation")}
                  >
                    Use Model
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
