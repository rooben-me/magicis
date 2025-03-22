import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { GenerationResult } from "@/types";

interface ResultsGalleryProps {
  results: GenerationResult[];
  isLoading: boolean;
}

export function ResultsGallery({ results, isLoading }: ResultsGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Generating lifestyle shots...</p>
        <p className="text-sm text-muted-foreground">This may take a minute</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Generated Results</h2>

      {results.map((result, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-medium">
            Scene: {result.sceneDescription}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {result.images.map((image) => (
              <Card
                key={image.id}
                className="group relative overflow-hidden glow-card"
              >
                <div className="aspect-[9/5.5] relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Generated lifestyle shot ${image.id}`}
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(image.url, image.filename)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
