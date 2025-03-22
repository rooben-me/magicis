import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { imageUrl, sceneDescription, shotSize = [900, 550], numResults = 1 } = data

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
    }

    if (!sceneDescription) {
      return NextResponse.json({ error: "No scene description provided" }, { status: 400 })
    }

    const apiToken = process.env.BRIA_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({ error: "API token not configured" }, { status: 500 })
    }

    const response = await fetch("https://engine.prod.bria-api.com/v1/product/lifestyle_shot_by_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_token: apiToken,
      },
      body: JSON.stringify({
        image_url: imageUrl,
        scene_description: sceneDescription,
        placement_type: "automatic",
        shot_size: shotSize,
        num_results: numResults,
        optimize_description: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `API request failed: ${errorText}` }, { status: response.status })
    }

    const result = await response.json()

    // Transform the result to a more usable format
    const images = result.result.map((item: any) => ({
      url: item[0],
      id: item[1],
      filename: item[2],
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error generating lifestyle shots:", error)
    return NextResponse.json({ error: "Failed to generate lifestyle shots" }, { status: 500 })
  }
}

