"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Wand2,
  ImageIcon,
  Download,
  Heart,
  Share2,
  MoreHorizontal,
  AlertCircle,
  Sparkles,
  Zap,
  Palette,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageGenerationProps {
  userCredits: number
  setUserCredits: (credits: number) => void
  generatedImages: any[]
  setGeneratedImages: (images: any[]) => void
}

export function ImageGeneration({
  userCredits,
  setUserCredits,
  generatedImages,
  setGeneratedImages,
}: ImageGenerationProps) {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [guidanceScale, setGuidanceScale] = useState([7])
  const [steps, setSteps] = useState([20])
  const [selectedModel, setSelectedModel] = useState("flux-schnell")
  const [imageCount, setImageCount] = useState("4")
  const [width, setWidth] = useState("1024")
  const [height, setHeight] = useState("1024")
  const [error, setError] = useState("")
  const [seed, setSeed] = useState("")
  const [photoReal, setPhotoReal] = useState(false)
  const [alchemyRefiner, setAlchemyRefiner] = useState(false)
  const [promptMagic, setPromptMagic] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [scheduler, setScheduler] = useState("DPM_SOLVER")

  const models = {
    "flux-schnell": {
      name: "Flux Schnell",
      description: "Ultra-fast generation with excellent quality",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      maxSteps: 4,
      defaultSteps: 4,
      supportsNegative: false,
    },
    "flux-dev": {
      name: "Flux Dev",
      description: "High-quality artistic generation",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      maxSteps: 50,
      defaultSteps: 28,
      supportsNegative: true,
    },
    "sdxl-turbo": {
      name: "SDXL Turbo",
      description: "Lightning-fast Stable Diffusion XL",
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
      maxSteps: 10,
      defaultSteps: 4,
      supportsNegative: true,
    },
  }

  const currentModel = models[selectedModel as keyof typeof models]

  const presetDimensions = [
    { label: "Square", value: "1024x1024", width: 1024, height: 1024 },
    { label: "Portrait", value: "768x1024", width: 768, height: 1024 },
    { label: "Landscape", value: "1024x768", width: 1024, height: 768 },
    { label: "Cinematic", value: "1536x640", width: 1536, height: 640 },
    { label: "Mobile", value: "640x1536", width: 640, height: 1536 },
  ]

  const schedulerOptions = ["DPM_SOLVER", "DDIM", "K_EULER_ANCESTRAL", "K_EULER", "K_LMS"]

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    const model = models[modelId as keyof typeof models]
    setSteps([model.defaultSteps])
  }

  const handleDimensionPreset = (preset: any) => {
    setWidth(preset.width.toString())
    setHeight(preset.height.toString())
  }

  const saveGenerationToDb = async (imageData: any) => {
    try {
      await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "demo-user", // In a real app, get this from auth context
          prompt: imageData.prompt,
          negativePrompt: imageData.settings.negativePrompt,
          model: imageData.model,
          imageUrl: imageData.url,
          settings: imageData.settings,
        }),
      })
    } catch (error) {
      console.error("Failed to save generation to database:", error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || userCredits < 10) return

    setIsGenerating(true)
    setError("")

    try {
      const numImages = Number.parseInt(imageCount)

      // For demo purposes, create mock images since the API endpoints are not working
      console.log("Generating mock images for demo...")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create mock image URLs (you can replace these with actual generated images)
      const mockImageUrls = Array.from(
        { length: numImages },
        (_, i) => `/placeholder.svg?height=1024&width=1024&text=Generated+Image+${Date.now()}+${i}`,
      )

      // Create image objects
      const newImages = mockImageUrls.map((url: string, i: number) => ({
        id: Date.now() + i,
        url: url,
        prompt: prompt,
        model: currentModel.name,
        timestamp: new Date(),
        liked: false,
        settings: {
          guidanceScale: guidanceScale[0],
          steps: steps[0],
          negativePrompt,
          width: Number.parseInt(width),
          height: Number.parseInt(height),
          seed: seed || "random",
          photoReal,
          alchemyRefiner,
          promptMagic,
          highContrast,
          scheduler,
        },
      }))

      // Save to database
      for (const image of newImages) {
        await saveGenerationToDb(image)
      }

      setGeneratedImages([...newImages, ...generatedImages])
      setUserCredits(userCredits - 10 * numImages)
    } catch (err: any) {
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate images. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleLike = (imageId: number) => {
    setGeneratedImages(generatedImages.map((img) => (img.id === imageId ? { ...img, liked: !img.liked } : img)))
  }

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      // Use a proxy route for downloading to avoid CORS issues
      const response = await fetch("/api/download?url=" + encodeURIComponent(imageUrl))
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `leonardo-ai-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-")}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
      setError("Failed to download image. Please try again.")
    }
  }

  return (
    <div className="flex h-full bg-slate-900">
      {/* Enhanced Generation Panel */}
      <div className="w-[420px] bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Image Generation</h2>
              <p className="text-sm text-slate-400">Create stunning visuals with AI</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-white font-medium">AI Model</Label>
            <div className="grid gap-3">
              {Object.entries(models).map(([key, model]) => (
                <div
                  key={key}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedModel === key
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                  }`}
                  onClick={() => handleModelChange(key)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${model.color} rounded-lg flex items-center justify-center`}
                    >
                      <model.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{model.name}</h3>
                      <p className="text-xs text-slate-400">{model.description}</p>
                    </div>
                    {selectedModel === key && <Badge className="bg-purple-500 text-white">Selected</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-white font-medium">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe your vision in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white min-h-[120px] resize-none focus:border-purple-500"
            />
          </div>

          {/* Negative Prompt */}
          {currentModel.supportsNegative && (
            <div className="space-y-3">
              <Label htmlFor="negative-prompt" className="text-white font-medium">
                Negative Prompt
              </Label>
              <Textarea
                id="negative-prompt"
                placeholder="What to avoid in the image..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white resize-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Image Dimensions */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Image Dimensions</Label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetDimensions.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  className={`border-slate-600 text-slate-300 hover:border-purple-500 hover:text-white ${
                    width === preset.width.toString() && height === preset.height.toString()
                      ? "border-purple-500 text-purple-400"
                      : ""
                  }`}
                  onClick={() => handleDimensionPreset(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Width</Label>
                <Select value={width} onValueChange={setWidth}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">512</SelectItem>
                    <SelectItem value="640">640</SelectItem>
                    <SelectItem value="768">768</SelectItem>
                    <SelectItem value="1024">1024</SelectItem>
                    <SelectItem value="1536">1536</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Height</Label>
                <Select value={height} onValueChange={setHeight}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">512</SelectItem>
                    <SelectItem value="640">640</SelectItem>
                    <SelectItem value="768">768</SelectItem>
                    <SelectItem value="1024">1024</SelectItem>
                    <SelectItem value="1536">1536</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Generation Settings */}
          <div className="space-y-4">
            <Label className="text-white font-medium">Generation Settings</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Images</Label>
                <Select value={imageCount} onValueChange={setImageCount}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
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

              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Steps: {steps[0]}</Label>
                <Slider
                  value={steps}
                  onValueChange={setSteps}
                  max={currentModel.maxSteps}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {selectedModel !== "flux-schnell" && (
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Guidance Scale: {guidanceScale[0]}</Label>
                <Slider
                  value={guidanceScale}
                  onValueChange={setGuidanceScale}
                  max={20}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm text-slate-400">Seed (Optional)</Label>
              <input
                type="number"
                placeholder="Random seed..."
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Leonardo-style Enhancements */}
          <div className="space-y-4">
            <Label className="text-white font-medium">Enhancements</Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <Label className="text-white text-sm font-medium">PhotoReal</Label>
                  <p className="text-xs text-slate-400">Enhanced photorealistic generation</p>
                </div>
                <Switch checked={photoReal} onCheckedChange={setPhotoReal} />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <Label className="text-white text-sm font-medium">Alchemy Refiner</Label>
                  <p className="text-xs text-slate-400">Improve image quality and details</p>
                </div>
                <Switch checked={alchemyRefiner} onCheckedChange={setAlchemyRefiner} />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <Label className="text-white text-sm font-medium">Prompt Magic</Label>
                  <p className="text-xs text-slate-400">AI-enhanced prompt optimization</p>
                </div>
                <Switch checked={promptMagic} onCheckedChange={setPromptMagic} />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <Label className="text-white text-sm font-medium">High Contrast</Label>
                  <p className="text-xs text-slate-400">Boost image contrast and vibrancy</p>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          {selectedModel === "sdxl-turbo" && (
            <div className="space-y-3">
              <Label className="text-white font-medium">Advanced Settings</Label>
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Scheduler</Label>
                <Select value={scheduler} onValueChange={setScheduler}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {schedulerOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Cost and Generate Button */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Generation Cost</span>
                <span className="text-lg font-bold text-white">{10 * Number.parseInt(imageCount)} credits</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Your balance</span>
                <span>{userCredits} credits</span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || userCredits < 10 * Number.parseInt(imageCount)}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating {imageCount} image{imageCount !== "1" ? "s" : ""}...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-3" />
                  Generate {imageCount} Image{imageCount !== "1" ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Results Panel */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Results Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Generated Images</h1>
              <p className="text-slate-400">
                {generatedImages.length > 0
                  ? `${generatedImages.length} image${generatedImages.length !== 1 ? "s" : ""} created`
                  : "Your creations will appear here"}
              </p>
            </div>
            {isGenerating && (
              <div className="flex items-center gap-3 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Generating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Creating your masterpiece...</h3>
                <p className="text-slate-400 mb-4">
                  Using {currentModel.name} to generate {imageCount} image{imageCount !== "1" ? "s" : ""}
                </p>
                <div className="bg-slate-800 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-slate-300 mb-2">Current settings:</p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Model: {currentModel.name}</div>
                    <div>
                      Dimensions: {width}×{height}
                    </div>
                    <div>Steps: {steps[0]}</div>
                    {selectedModel !== "flux-schnell" && <div>Guidance: {guidanceScale[0]}</div>}
                  </div>
                </div>
              </div>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {generatedImages.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black"
                        onClick={() => downloadImage(image.url, image.prompt)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black"
                        onClick={() => toggleLike(image.id)}
                      >
                        <Heart className={`w-4 h-4 ${image.liked ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-black">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-black">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-slate-300 line-clamp-2 leading-tight">{image.prompt}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {image.model}
                      </Badge>
                      <span className="text-xs text-slate-500">{new Date(image.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to create something amazing?</h3>
                <p className="text-slate-400 mb-6">
                  Choose a model, enter your prompt, and let AI bring your imagination to life.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-300">Fast Generation</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <Palette className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-300">High Quality</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <Sparkles className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-300">Multiple Styles</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
