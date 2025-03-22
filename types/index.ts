export interface SceneSuggestion {
  id: string;
  description: string;
}

export interface GeneratedImage {
  url: string;
  id: string;
  filename: string;
}

export interface GenerationResult {
  productImage: UploadedImage;
  images: GeneratedImage[];
  sceneDescription: string;
  timestamp: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
}
