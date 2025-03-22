"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { FileUpload } from "@/components/file-upload"
import { SceneSelector } from "@/components/scene-selector"
import { ResultsGallery } from "@/components/results-gallery"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import type { SceneSuggestion, UploadedImage, GenerationResult } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [selectedScene, setSelectedScene] = useState<SceneSuggestion | null>(null)
  const [results, setResults] = useState<GenerationResult[]>([])
  const { toast } = useToast()

  const { mutate: generateLifestyleShots, isPending } = useMutation({
    mutationFn: async () => {
      if (!uploadedImages.length) {
        throw new Error("Please upload at least one product image")
      }

      if (!selectedScene) {
        throw new Error("Please select a scene description")
      }

      // Create a blob URL for the first image
      const file = uploadedImages[0].file
      const formData = new FormData()
      formData.append("file", file)

      // Upload the image to get a URL
      // In a real app, you'd upload to a storage service
      // For this demo, we'll use the existing URL
      const imageUrl = uploadedImages[0].url

      const response = await fetch("/api/generate-lifestyle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          sceneDescription: selectedScene.description,
          numResults: 4,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate lifestyle shots")
      }

      return response.json()
    },
    onSuccess: (data) => {
      if (data.images) {
        const newResult: GenerationResult = {
          images: data.images,
          sceneDescription: selectedScene?.description || "Unknown scene",
        }
        setResults([newResult, ...results])
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleImageUpload = (images: UploadedImage[]) => {
    setUploadedImages(images)
  }

  const handleSceneSelect = (scene: SceneSuggestion) => {
    setSelectedScene(scene)
  }

  const handleGenerate = () => {
    generateLifestyleShots()
  }

  return (
    <main className="min-h-screen">
      <div className="container py-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Scene Suggestion App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your product images and generate beautiful lifestyle shots with AI-powered scene suggestions
          </p>
        </header>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
          <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Upload Product Images</h2>
                <FileUpload onImageUpload={handleImageUpload} />
              </section>

              {uploadedImages.length > 0 && (
                <section>
                  <SceneSelector
                    uploadedImages={uploadedImages}
                    onSceneSelect={handleSceneSelect}
                    selectedScene={selectedScene}
                  />
                </section>
              )}

              {uploadedImages.length > 0 && selectedScene && (
                <section className="flex justify-center">
                  <Button size="lg" onClick={handleGenerate} disabled={isPending} className="animate-glow">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Lifestyle Shots
                  </Button>
                </section>
              )}
            </div>
          </div>
        </div>

        <section>
          <ResultsGallery results={results} isLoading={isPending} />
        </section>
      </div>
    </main>
  )
}

