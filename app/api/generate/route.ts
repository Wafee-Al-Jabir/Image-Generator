import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { modelId, params } = body

    // Updated model configurations for imagerouter.io
    const models = {
      "flux-schnell": {
        name: "Flux Schnell",
        apiKey: "6bd1362e10c1bbb9c77f46cc8d860bb9ae11c036b8211d3773b49194c90c5acc",
        endpoint: "https://api.imagerouter.io/flux-schnell",
      },
      "flux-dev": {
        name: "Flux Dev",
        apiKey: "6bd1362e10c1bbb9c77f46cc8d860bb9ae11c036b8211d3773b49194c90c5acc",
        endpoint: "https://api.imagerouter.io/flux-dev",
      },
      "sdxl-turbo": {
        name: "SDXL Turbo",
        apiKey: "18d8ee6d6c60b832e8c3b25bd467a40b64dd6cef63f96b8e9ef3baa62af0b6d1",
        endpoint: "https://api.imagerouter.io/sdxl-turbo",
      },
    }

    const model = models[modelId as keyof typeof models]
    if (!model) {
      return NextResponse.json({ error: "Invalid model ID" }, { status: 400 })
    }

    // Simplified request body for imagerouter.io
    const requestBody = {
      prompt: params.prompt,
      width: params.image_size?.width || 1024,
      height: params.image_size?.height || 1024,
      num_outputs: params.num_images || 1,
      guidance_scale: params.guidance_scale || 7,
      num_inference_steps: params.num_inference_steps || 20,
      seed: params.seed || Math.floor(Math.random() * 1000000),
    }

    // Add negative prompt if supported and provided
    if (params.negative_prompt && modelId !== "flux-schnell") {
      requestBody.negative_prompt = params.negative_prompt
    }

    console.log("Making request to:", model.endpoint)
    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    // Make the API request to imagerouter.io
    const response = await fetch(model.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${model.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Response status:", response.status)

    const responseText = await response.text()
    console.log("Response text:", responseText)

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`

      // Try to parse HTML error response
      if (responseText.includes("Cannot POST")) {
        errorMessage = "API endpoint not found. Please check the model configuration."
      } else {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          errorMessage = responseText || errorMessage
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    // Try to parse JSON response
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse JSON response:", e)
      return NextResponse.json({ error: "Invalid response format from API" }, { status: 500 })
    }

    console.log("Parsed result:", result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
