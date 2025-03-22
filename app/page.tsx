"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@/components/file-upload";
import { SceneSelector } from "@/components/scene-selector";
import { ResultsGallery } from "@/components/results-gallery";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import type { SceneSuggestion, UploadedImage, GenerationResult } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<UploadedImage | null>(
    null
  );
  const [selectedScene, setSelectedScene] = useState<SceneSuggestion | null>(
    null
  );
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [numImages, setNumImages] = useState<number>(4);
  const { toast } = useToast();

  console.log(results);

  const { mutate: generateLifestyleShots, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) {
        throw new Error("Please select a product image");
      }

      if (!selectedScene) {
        throw new Error("Please select a scene description");
      }

      const response = await fetch("/api/generate-lifestyle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedProduct.url,
          sceneDescription: selectedScene.description,
          numResults: numImages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate lifestyle shots");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.images) {
        const newResult: GenerationResult = {
          productImage: selectedProduct!,
          images: data.images,
          sceneDescription: selectedScene?.description || "Unknown scene",
          timestamp: new Date().toISOString(),
        };
        setResults([newResult, ...results]);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (images: UploadedImage[]) => {
    setUploadedImages(images);
    // Select the first uploaded image by default if none selected
    if (images.length > 0 && !selectedProduct) {
      setSelectedProduct(images[0]);
    }
  };

  const handleProductSelect = (image: UploadedImage) => {
    setSelectedProduct(image);
  };

  const handleSceneSelect = (scene: SceneSuggestion) => {
    setSelectedScene(scene);
  };

  const handleGenerate = () => {
    generateLifestyleShots();
  };

  return (
    <main className="min-h-screen">
      <div className="container py-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Scene Suggestion App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your product images and generate beautiful lifestyle shots
            with AI-powered scene suggestions
          </p>
        </header>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
          <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  Upload Product Images
                </h2>
                <FileUpload
                  onImageUpload={handleImageUpload}
                  selectedProduct={selectedProduct}
                  onProductSelect={handleProductSelect}
                />
              </section>

              {uploadedImages.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Scene Selection</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Number of images:
                      </span>
                      <Select
                        value={String(numImages)}
                        onValueChange={(value) => setNumImages(Number(value))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <SceneSelector
                    selectedProduct={selectedProduct}
                    onSceneSelect={handleSceneSelect}
                    selectedScene={selectedScene}
                  />
                </section>
              )}

              {uploadedImages.length > 0 && selectedScene && (
                <section className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isPending}
                    className="animate-glow"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate {numImages} Lifestyle Shot
                    {numImages > 1 ? "s" : ""}
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
  );
}
