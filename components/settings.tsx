"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Settings() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Customize your Leonardo AI experience</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Generation Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto-save generations</Label>
                <p className="text-sm text-slate-400">Automatically save all generated images</p>
              </div>
              <Switch id="auto-save" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-quality">High quality by default</Label>
                <p className="text-sm text-slate-400">Use higher quality settings for new generations</p>
              </div>
              <Switch id="high-quality" />
            </div>
            <div className="space-y-2">
              <Label>Default model</Label>
              <Select defaultValue="leonardo-diffusion-xl">
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leonardo-diffusion-xl">Leonardo Diffusion XL</SelectItem>
                  <SelectItem value="leonardo-vision-xl">Leonardo Vision XL</SelectItem>
                  <SelectItem value="photoreal">PhotoReal</SelectItem>
                  <SelectItem value="anime-pastel-dream">Anime Pastel Dream</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email notifications</Label>
                <p className="text-sm text-slate-400">Receive updates about your generations</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push notifications</Label>
                <p className="text-sm text-slate-400">Get notified when generations complete</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="public-gallery">Public gallery</Label>
                <p className="text-sm text-slate-400">Allow others to see your creations</p>
              </div>
              <Switch id="public-gallery" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Usage analytics</Label>
                <p className="text-sm text-slate-400">Help improve Leonardo AI with usage data</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-purple-600 hover:bg-purple-700">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
