export interface SceneSuggestion {
  id: string
  description: string
}

export interface GeneratedImage {
  url: string
  id: string
  filename: string
}

export interface GenerationResult {
  images: GeneratedImage[]
  sceneDescription: string
}

export interface UploadedImage {
  id: string
  url: string
  file: File
}

