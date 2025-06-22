"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2, ImageIcon } from "lucide-react"

export function GenerationPanel() {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [guidanceScale, setGuidanceScale] = useState([7])
  const [steps, setSteps] = useState([20])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
  }

  return (
    <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
      <Card className="bg-gray-900 border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Image Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="negative-prompt">Negative Prompt</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="What to avoid in the image..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Model</Label>
                <Select defaultValue="leonardo-diffusion-xl">
                  <SelectTrigger className="bg-gray-800 border-gray-600">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Select defaultValue="512">
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512</SelectItem>
                      <SelectItem value="768">768</SelectItem>
                      <SelectItem value="1024">1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Select defaultValue="512">
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512</SelectItem>
                      <SelectItem value="768">768</SelectItem>
                      <SelectItem value="1024">1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of Images</Label>
                <Select defaultValue="4">
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <Label>Guidance Scale: {guidanceScale[0]}</Label>
                <Slider
                  value={guidanceScale}
                  onValueChange={setGuidanceScale}
                  max={20}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Inference Steps: {steps[0]}</Label>
                <Slider value={steps} onValueChange={setSteps} max={50} min={10} step={1} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seed">Seed (Optional)</Label>
                <Input id="seed" placeholder="Random seed..." className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                Generate Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
