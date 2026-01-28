'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Download, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ComparisonSlider } from './comparison-slider'
import { RecipeSelector } from './recipe-selector'
import { FILM_RECIPES } from '@/lib/fujifilm-processor'

interface ImagePreviewProps {
  originalImage: string
  transformedImage: string | null
  isProcessing: boolean
  selectedRecipe: string
  onRecipeChange: (recipe: string) => void
  onApplyRecipe: () => void
  onReset: () => void
}

export function ImagePreview({
  originalImage,
  transformedImage,
  isProcessing,
  selectedRecipe,
  onRecipeChange,
  onApplyRecipe,
  onReset,
}: ImagePreviewProps) {
  const [showComparison, setShowComparison] = useState(true);
  const handleDownload = async () => {
    if (!transformedImage) return

    try {
      // Fetch the blob URL and convert to blob
      const response = await fetch(transformedImage)
      const blob = await response.blob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fujifilm-${selectedRecipe}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('[v0] Download failed:', error)
    }
  }

  const recipe = FILM_RECIPES[selectedRecipe]

  return (
    <div className="w-full max-w-7xl space-y-6 md:space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={onReset}
          className="gap-2 text-muted-foreground hover:text-foreground"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">New Image</span>
          <span className="sm:hidden">New</span>
        </Button>

        {transformedImage && !isProcessing && (
          <Button 
            onClick={handleDownload} 
            className="gap-2 rounded-full"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        )}
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <p className="text-sm font-medium text-foreground">
              Processing with Nano Banana Pro algorithm
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {'Applying Fujifilm color science and film grain...'}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_340px]">
        {/* Image Comparison */}
        <div className="space-y-4 md:space-y-6">
          {isProcessing ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="aspect-[3/4] rounded-2xl" />
            </div>
          ) : transformedImage ? (
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-foreground">
                  Before & After Comparison
                </h3>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {recipe.name}
                </span>
              </div>
              <ComparisonSlider
                originalImage={originalImage}
                transformedImage={transformedImage}
              />
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Original Image
              </h3>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
                <Image
                  src={originalImage || "/placeholder.svg"}
                  alt="Original"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Recipe Selector Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">
              Film Recipe Settings
            </h3>
          </div>
          <RecipeSelector
            selectedRecipe={selectedRecipe}
            onRecipeChange={onRecipeChange}
            onApply={onApplyRecipe}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Applied Settings Summary */}
      {transformedImage && !isProcessing && (
        <div className="rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm md:p-6 lg:p-8">
          <h4 className="mb-4 text-sm font-medium text-muted-foreground md:mb-6">
            Applied Settings - {recipe.name}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Film Simulation</p>
              <p className="text-sm font-medium capitalize text-foreground md:text-base">
                {recipe.filmSimulation.replace('-', ' ')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">White Balance</p>
              <p className="text-sm font-medium text-foreground md:text-base">
                R{recipe.whiteBalanceShift.red > 0 ? '+' : ''}
                {recipe.whiteBalanceShift.red} / B
                {recipe.whiteBalanceShift.blue > 0 ? '+' : ''}
                {recipe.whiteBalanceShift.blue}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Tone Curve</p>
              <p className="text-sm font-medium text-foreground md:text-base">
                {recipe.highlights > 0 ? '+' : ''}
                {recipe.highlights} H / {recipe.shadows > 0 ? '+' : ''}
                {recipe.shadows} S
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Effects</p>
              <p className="text-sm font-medium capitalize text-foreground md:text-base">
                {recipe.grain} Grain / {recipe.colorChrome} Chrome FX
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
