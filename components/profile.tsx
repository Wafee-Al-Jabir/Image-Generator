"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Crown, Calendar, ImageIcon } from "lucide-react"

interface ProfileProps {
  user: any
}

export function Profile({ user }: ProfileProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">{user?.firstName?.[0] || "U"}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-4">
                <Crown className="w-3 h-3 mr-1" />
                {user?.plan} Member
              </Badge>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user?.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="w-4 h-4" />0 Generations Created
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName || ""}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName || ""}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <div>
                  <h3 className="text-white font-semibold">Premium Plan</h3>
                  <p className="text-orange-100 text-sm">Unlimited generations</p>
                </div>
                <Badge className="bg-white text-orange-600">Active</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <p>Next billing date: January 15, 2024</p>
                <p>Credits remaining: 970</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
