'use client'

import { useState } from 'react'
import { ImageUpload } from './image-upload'
import { ImagePreview } from './image-preview'
import { Header } from './header'
import { applyFujifilmTransform, FILM_RECIPES } from '@/lib/fujifilm-processor'

export function ImageTransformer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [transformedImage, setTransformedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState('nano-banana-pro')

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const result = reader.result as string
      setOriginalImage(result)
      setTransformedImage(null)
      // Don't auto-process, let user choose recipe and apply
    }
    reader.readAsDataURL(file)
  }

  const handleApplyRecipe = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const recipe = FILM_RECIPES[selectedRecipe]
      const transformed = await applyFujifilmTransform(originalImage, recipe)
      setTransformedImage(transformed)
    } catch (error) {
      console.error('[v0] Failed to transform image:', error)
      setTransformedImage(originalImage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setOriginalImage(null)
    setTransformedImage(null)
    setIsProcessing(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 md:py-20">
        {!originalImage ? (
          <ImageUpload onImageUpload={handleImageUpload} />
        ) : (
          <ImagePreview
            originalImage={originalImage}
            transformedImage={transformedImage}
            isProcessing={isProcessing}
            selectedRecipe={selectedRecipe}
            onRecipeChange={setSelectedRecipe}
            onApplyRecipe={handleApplyRecipe}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
