'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FILM_RECIPES, type FujifilmRecipe } from '@/lib/fujifilm-processor'
import { Sparkles } from 'lucide-react'

interface RecipeSelectorProps {
  selectedRecipe: string
  onRecipeChange: (recipeId: string) => void
  onApply: () => void
  isProcessing: boolean
}

export function RecipeSelector({
  selectedRecipe,
  onRecipeChange,
  onApply,
  isProcessing,
}: RecipeSelectorProps) {
  const recipe = FILM_RECIPES[selectedRecipe]

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Film Recipe
        </label>
        <Select value={selectedRecipe} onValueChange={onRecipeChange}>
          <SelectTrigger className="h-11 border-border/50 bg-card/30 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            {Object.entries(FILM_RECIPES).map(([id, recipe]) => (
              <SelectItem key={id} value={id} className="cursor-pointer">
                <div className="flex flex-col gap-1 py-1">
                  <span className="font-medium">{recipe.name}</span>
                  {recipe.description && (
                    <span className="text-xs text-muted-foreground">
                      {recipe.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {recipe && recipe.description && (
        <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        </div>
      )}

      {recipe && (
        <div className="space-y-4 rounded-xl border border-border/50 bg-card/20 p-6 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-muted-foreground">
            Technical Settings
          </h4>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Film Simulation</span>
              <span className="font-medium capitalize text-foreground">
                {recipe.filmSimulation.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Highlights</span>
              <span className="font-medium text-foreground">
                {recipe.highlights > 0 ? '+' : ''}
                {recipe.highlights}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shadows</span>
              <span className="font-medium text-foreground">
                {recipe.shadows > 0 ? '+' : ''}
                {recipe.shadows}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color</span>
              <span className="font-medium text-foreground">
                {recipe.color > 0 ? '+' : ''}
                {recipe.color}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Grain</span>
              <span className="font-medium capitalize text-foreground">
                {recipe.grain}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">White Balance</span>
              <span className="font-medium text-foreground">
                R{recipe.whiteBalanceShift.red > 0 ? '+' : ''}
                {recipe.whiteBalanceShift.red} / B
                {recipe.whiteBalanceShift.blue > 0 ? '+' : ''}
                {recipe.whiteBalanceShift.blue}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sharpness</span>
              <span className="font-medium text-foreground">
                {recipe.sharpness > 0 ? '+' : ''}
                {recipe.sharpness}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clarity</span>
              <span className="font-medium text-foreground">
                {recipe.clarity > 0 ? '+' : ''}
                {recipe.clarity}
              </span>
            </div>
            {recipe.dynamicRange && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dynamic Range</span>
                <span className="font-medium text-foreground">
                  {recipe.dynamicRange}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={onApply}
        disabled={isProcessing}
        className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Apply Recipe
          </>
        )}
      </Button>
    </div>
  )
}
