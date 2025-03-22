"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import type { SceneSuggestion, UploadedImage } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface SceneSelectorProps {
  onSceneSelect: (scene: SceneSuggestion) => void;
  selectedScene?: SceneSuggestion | null;
  selectedProduct: UploadedImage | null;
}

// Predefined scene suggestions
const PREDEFINED_SCENES: SceneSuggestion[] = [
  { id: "scene-1", description: "High end photography" },
  { id: "scene-2", description: "A pantry shelf alongside other food items" },
  { id: "scene-3", description: "A dining table setting as part of a meal" },
  { id: "scene-4", description: "A health food store display" },
  { id: "scene-5", description: "A cooking show set during a demonstration" },
];

export function SceneSelector({
  onSceneSelect,
  selectedScene,
  selectedProduct,
}: SceneSelectorProps) {
  const [suggestions, setSuggestions] =
    useState<SceneSuggestion[]>(PREDEFINED_SCENES);
  const { toast } = useToast();

  const { mutate: generateSuggestions, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) {
        throw new Error("Please upload at least one product image");
      }

      const formData = new FormData();
      formData.append("image", selectedProduct.file);

      const response = await fetch("/api/scene-suggestions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate scene suggestions");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.suggestions && Array.isArray(data.suggestions)) {
        const formattedSuggestions = data.suggestions.map(
          (suggestion: string, index: number) => ({
            id: `ai-suggestion-${index}`,
            description:
              typeof suggestion === "string"
                ? suggestion
                : // @ts-ignore
                  suggestion.description || "Unknown scene",
          })
        );
        setSuggestions(formattedSuggestions);
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

  const handleGenerateSuggestions = () => {
    generateSuggestions();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Choose Scene Description</h2>
        <Button
          variant="outline"
          onClick={handleGenerateSuggestions}
          disabled={isPending || !selectedProduct}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate AI Suggestions
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((scene) => (
          <Card
            key={scene.id}
            className={`cursor-pointer transition-all hover:scale-[1.02] ${
              selectedScene?.id === scene.id
                ? "ring-2 ring-primary glow-card"
                : ""
            }`}
            onClick={() => onSceneSelect(scene)}
          >
            <CardContent className="p-4">
              <p className="text-sm">{scene.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
