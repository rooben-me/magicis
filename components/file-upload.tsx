"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UploadedImage } from "@/types";
import { useUploadImage } from "@/hooks/use-upload-image";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onImageUpload: (images: UploadedImage[]) => void;
  selectedProduct: UploadedImage | null;
  onProductSelect: (image: UploadedImage) => void;
  maxFiles?: number;
}

export function FileUpload({
  onImageUpload,
  selectedProduct,
  onProductSelect,
  maxFiles = 10,
}: FileUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const { uploadImage, isUploading } = useUploadImage();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newImagesPromises = acceptedFiles
        .slice(0, maxFiles - uploadedImages.length)
        .map(async (file) => {
          const imageUrl = await uploadImage(file);
          if (!imageUrl) return null;

          return {
            id: `${file.name}-${Date.now()}`,
            url: imageUrl,
            file,
          };
        });

      const newImages = (await Promise.all(newImagesPromises)).filter(
        (img): img is UploadedImage => img !== null
      );
      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      onImageUpload(updatedImages);
    },
    [uploadedImages, maxFiles, onImageUpload, uploadImage]
  );

  const removeImage = (id: string) => {
    const updatedImages = uploadedImages.filter((image) => image.id !== id);
    setUploadedImages(updatedImages);
    onImageUpload(updatedImages);
    if (selectedProduct?.id === id) {
      onProductSelect(updatedImages[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: maxFiles - uploadedImages.length,
    disabled: uploadedImages.length >= maxFiles || isUploading,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        } ${
          uploadedImages.length >= maxFiles || isUploading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">
            {isDragActive
              ? "Drop the files here"
              : isUploading
              ? "Uploading..."
              : "Drag & drop product images here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select files
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {uploadedImages.length} / {maxFiles} images
          </p>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <>
          <h3 className="text-sm font-medium mb-2">Select Product Image:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((image) => (
              <Card
                key={image.id}
                className={cn(
                  "relative group overflow-hidden cursor-pointer",
                  selectedProduct?.id === image.id && "ring-2 ring-primary"
                )}
                onClick={() => onProductSelect(image)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="Uploaded product"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {selectedProduct?.id === image.id && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
