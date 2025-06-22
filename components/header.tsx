"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, Coins, Menu } from "lucide-react"

interface HeaderProps {
  userCredits: number
  user: any
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ userCredits, user, sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-slate-300 hover:text-white">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search your creations..."
            className="pl-10 w-80 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-white font-medium">{userCredits}</span>
          <span className="text-slate-400 text-sm">credits</span>
        </div>

        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
          <Bell className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{user?.firstName?.[0] || "U"}</span>
          </div>
          <div className="text-right">
            <div className="text-white font-medium">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-slate-400 text-xs">{user?.plan} Member</div>
          </div>
        </div>
      </div>
    </header>
  )
}
