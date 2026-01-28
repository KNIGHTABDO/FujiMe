'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ComparisonSliderProps {
  originalImage: string
  transformedImage: string
}

export function ComparisonSlider({
  originalImage,
  transformedImage,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full cursor-col-resize select-none overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-2xl touch-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Transformed Image (full) */}
      <div className="absolute inset-0">
        <Image
          src={transformedImage || "/placeholder.svg"}
          alt="Transformed"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm md:right-4 md:top-4 md:px-3 md:text-xs">
          After
        </div>
      </div>

      {/* Original Image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={originalImage || "/placeholder.svg"}
          alt="Original"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute left-2 top-2 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm md:left-4 md:top-4 md:px-3 md:text-xs">
          Before
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="pointer-events-none absolute top-0 h-full w-0.5 bg-primary shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background shadow-xl transition-transform active:scale-95 md:h-12 md:w-12 md:hover:scale-110">
            <ChevronLeft className="absolute left-0.5 h-3 w-3 text-primary md:left-1 md:h-4 md:w-4" />
            <ChevronRight className="absolute right-0.5 h-3 w-3 text-primary md:right-1 md:h-4 md:w-4" />
          </div>
        </div>
      </div>

      {/* Touch/Click indicator on first load */}
      {sliderPosition === 50 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm md:px-4 md:py-2 md:text-sm">
            Drag to compare
          </div>
        </div>
      )}
    </div>
  )
}
