import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert the file to a byte array
    const imageBytes = await imageFile.arrayBuffer()

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Create a prompt for scene suggestions
    const prompt =
      'Generate 5 scene suggestions for product lifestyle shots for this product. Return ONLY a JSON array of strings with the scene descriptions. For example: ["A kitchen counter with a blurred background", "A pantry shelf alongside other food items"]'

    // Create the request
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: Buffer.from(imageBytes).toString("base64"),
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    try {
      const suggestions = JSON.parse(text)
      return NextResponse.json({ suggestions })
    } catch (e) {
      // If parsing fails, return the raw text
      return NextResponse.json({
        suggestions: text
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line, index) => ({
            id: `suggestion-${index}`,
            description: line.replace(/^["'\s-]+|["'\s-]+$/g, ""),
          })),
      })
    }
  } catch (error) {
    console.error("Error generating scene suggestions:", error)
    return NextResponse.json({ error: "Failed to generate scene suggestions" }, { status: 500 })
  }
}

