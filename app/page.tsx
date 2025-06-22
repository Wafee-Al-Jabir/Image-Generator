"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { ImageGeneration } from "@/components/image-generation"
import { PersonalFeed } from "@/components/personal-feed"
import { GenerationHistory } from "@/components/generation-history"
import { Profile } from "@/components/profile"
import { Settings } from "@/components/settings"
import { AuthScreen } from "@/components/auth-screen"

export type PageType =
  | "home"
  | "ai-generation"
  | "personal-feed"
  | "generation-history"
  | "fine-tuned"
  | "profile"
  | "settings"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [userCredits, setUserCredits] = useState(1000)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Calculate real stats
  const totalGenerations = generatedImages.length
  const creditsUsed = 1000 - userCredits
  const favoriteImages = generatedImages.filter((img) => img.liked).length

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Dashboard
            onNavigate={setCurrentPage}
            totalGenerations={totalGenerations}
            creditsUsed={creditsUsed}
            creditsRemaining={userCredits}
            favoriteImages={favoriteImages}
            generatedImages={generatedImages}
          />
        )
      case "ai-generation":
        return (
          <ImageGeneration
            userCredits={userCredits}
            setUserCredits={setUserCredits}
            generatedImages={generatedImages}
            setGeneratedImages={setGeneratedImages}
          />
        )
      case "personal-feed":
        return <PersonalFeed generatedImages={generatedImages} />
      case "generation-history":
        return <GenerationHistory generatedImages={generatedImages} />
      case "profile":
        return <Profile user={user} />
      case "settings":
        return <Settings />
      default:
        return (
          <Dashboard
            onNavigate={setCurrentPage}
            totalGenerations={totalGenerations}
            creditsUsed={creditsUsed}
            creditsRemaining={userCredits}
            favoriteImages={favoriteImages}
            generatedImages={generatedImages}
          />
        )
    }
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuth={setIsAuthenticated} setUser={setUser} />
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col">
        <Header
          userCredits={userCredits}
          user={user}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">{renderCurrentPage()}</main>
      </div>
    </div>
  )
}
