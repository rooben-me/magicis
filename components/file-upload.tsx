"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { UploadedImage } from "@/types"

interface FileUploadProps {
  onImageUpload: (images: UploadedImage[]) => void
  maxFiles?: number
}

export function FileUpload({ onImageUpload, maxFiles = 10 }: FileUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.slice(0, maxFiles - uploadedImages.length).map((file) => {
        const imageUrl = URL.createObjectURL(file)
        return {
          id: `${file.name}-${Date.now()}`,
          url: imageUrl,
          file,
        }
      })

      const updatedImages = [...uploadedImages, ...newImages]
      setUploadedImages(updatedImages)
      onImageUpload(updatedImages)
    },
    [uploadedImages, maxFiles, onImageUpload],
  )

  const removeImage = (id: string) => {
    const updatedImages = uploadedImages.filter((image) => image.id !== id)
    setUploadedImages(updatedImages)
    onImageUpload(updatedImages)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: maxFiles - uploadedImages.length,
    disabled: uploadedImages.length >= maxFiles,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-secondary/50"
        } ${uploadedImages.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">
            {isDragActive ? "Drop the files here" : "Drag & drop product images here"}
          </p>
          <p className="text-sm text-muted-foreground">or click to select files</p>
          <p className="text-xs text-muted-foreground mt-2">
            {uploadedImages.length} / {maxFiles} images
          </p>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {uploadedImages.map((image) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image src={image.url || "/placeholder.svg"} alt="Uploaded product" fill className="object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

