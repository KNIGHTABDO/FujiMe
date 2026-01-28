'use client'

import React from "react"

import { useCallback, useState } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file)
      }
    },
    [onImageUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onImageUpload(file)
      }
    },
    [onImageUpload]
  )

  return (
    <div className="w-full max-w-3xl space-y-6 px-4 md:space-y-8 md:px-0">
      <div className="space-y-2 text-center md:space-y-3">
        <h2 className="text-pretty text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Transform Your Photos
        </h2>
        <p className="text-pretty text-sm text-muted-foreground md:text-base lg:text-lg">
          {'Experience the timeless aesthetic of Fujifilm film photography'}
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center 
          rounded-2xl border-2 border-dashed transition-all duration-200
          md:min-h-[400px]
          ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/80'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload image"
        />

        <div className="flex flex-col items-center gap-4 px-4 py-8 md:gap-6 md:px-6 md:py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 md:h-20 md:w-20">
            {isDragging ? (
              <Upload className="h-8 w-8 text-primary md:h-10 md:w-10" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground md:h-10 md:w-10" />
            )}
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-foreground md:text-base">
              {isDragging ? 'Drop your image here' : 'Drop your image to begin'}
            </p>
            <p className="text-xs text-muted-foreground md:text-sm">
              {'or click to browse your files'}
            </p>
          </div>

          <Button
            size="lg"
            className="pointer-events-none mt-2 rounded-full px-6 text-sm md:px-8 md:text-base"
          >
            Select Image
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {'Supports JPG, PNG, and WEBP formats'}
      </p>
    </div>
  )
}
