"use client"

import { Button } from "@/components/ui/button"
import { Home, Sparkles, User, History, Layers, Settings, Crown } from "lucide-react"
import type { PageType } from "@/app/page"

interface SidebarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: "home" as PageType, icon: Home, label: "Home" },
    { id: "ai-generation" as PageType, icon: Sparkles, label: "AI Image Generation" },
    { id: "personal-feed" as PageType, icon: User, label: "Personal Feed" },
    { id: "generation-history" as PageType, icon: History, label: "Generation History" },
    { id: "fine-tuned" as PageType, icon: Layers, label: "Fine-tuned Models" },
    { id: "profile" as PageType, icon: User, label: "Profile" },
    { id: "settings" as PageType, icon: Settings, label: "Settings" },
  ]

  return (
    <div
      className={`${isOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden bg-slate-800 border-r border-slate-700 flex flex-col`}
    >
      <div className="p-4">
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onToggle}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Leonardo</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start h-12 px-4 ${
              currentPage === item.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-center">
          <Crown className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold mb-1">Upgrade to Premium</h3>
          <p className="text-orange-100 text-sm mb-3">Unlimited generations</p>
          <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-medium">Upgrade Now</Button>
        </div>
      </div>
    </div>
  )
}
