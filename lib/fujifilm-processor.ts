/**
 * Fujifilm Image Processor
 * Applies real image transformations based on Fujifilm film simulation recipes
 */

export interface FujifilmRecipe {
  name: string
  filmSimulation: 'classic-chrome' | 'pro-neg-std' | 'eterna' | 'velvia'
  highlights: number // -2 to +4
  shadows: number // -2 to +4
  color: number // -4 to +4
  sharpness: number // -4 to +4
  grain: 'off' | 'weak' | 'strong'
  whiteBalanceShift: { red: number; blue: number } // -9 to +9
  colorChrome: 'off' | 'weak' | 'strong'
  colorChromeBlue: 'off' | 'weak' | 'strong'
  clarity: number // -5 to +5
  dynamicRange?: 'DR100' | 'DR200' | 'DR400'
  description?: string
}

// Film Recipe Presets from film.recipes
export const FILM_RECIPES: Record<string, FujifilmRecipe> = {
  'nano-banana-pro': {
    name: 'Nano Banana Pro',
    description: 'Warm, muted tones with lifted shadows',
    filmSimulation: 'classic-chrome',
    highlights: -1,
    shadows: -1,
    color: -1,
    sharpness: -2,
    grain: 'weak',
    whiteBalanceShift: { red: 2, blue: -5 },
    colorChrome: 'weak',
    colorChromeBlue: 'strong',
    clarity: -2,
  },
  'kodak-portra-400': {
    name: 'Kodak Portra 400',
    description: 'Classic film with sophisticated soft tones',
    filmSimulation: 'eterna',
    highlights: 1,
    shadows: 1,
    color: 2,
    sharpness: -2,
    grain: 'weak',
    whiteBalanceShift: { red: -2, blue: -4 },
    colorChrome: 'weak',
    colorChromeBlue: 'strong',
    clarity: -2,
    dynamicRange: 'DR200',
  },
  'nightwalker': {
    name: 'Nightwalker',
    description: 'Street photography with cyber teal tones for night lights',
    filmSimulation: 'velvia',
    highlights: -2,
    shadows: 2,
    color: 4,
    sharpness: -2,
    grain: 'strong',
    whiteBalanceShift: { red: -7, blue: -3 },
    colorChrome: 'weak',
    colorChromeBlue: 'strong',
    clarity: 0,
    dynamicRange: 'DR200',
  },
  '123-chrome': {
    name: '123 Chrome',
    description: 'Classic Kodachrome look for landscape and travel',
    filmSimulation: 'classic-chrome',
    highlights: -1,
    shadows: -2,
    color: 3,
    sharpness: 0,
    grain: 'off',
    whiteBalanceShift: { red: 1, blue: -2 },
    colorChrome: 'weak',
    colorChromeBlue: 'strong',
    clarity: 0,
    dynamicRange: 'DR400',
  },
  'eastman-color': {
    name: 'Eastman Color',
    description: 'Early Kodak 35mm film with striking blues',
    filmSimulation: 'classic-chrome',
    highlights: 1,
    shadows: -1,
    color: 0,
    sharpness: 0,
    grain: 'weak',
    whiteBalanceShift: { red: -5, blue: -7 },
    colorChrome: 'off',
    colorChromeBlue: 'off',
    clarity: -3,
    dynamicRange: 'DR100',
  },
  'kodak-gold-200': {
    name: 'Kodak Gold 200',
    description: 'Warm golden hour tones',
    filmSimulation: 'classic-chrome',
    highlights: 1,
    shadows: 0,
    color: 3,
    sharpness: 0,
    grain: 'weak',
    whiteBalanceShift: { red: 5, blue: -3 },
    colorChrome: 'strong',
    colorChromeBlue: 'off',
    clarity: 1,
  },
  'fuji-astia': {
    name: 'Fuji Astia 100F',
    description: 'Natural colors with fine detail',
    filmSimulation: 'pro-neg-std',
    highlights: 0,
    shadows: 0,
    color: 1,
    sharpness: 1,
    grain: 'off',
    whiteBalanceShift: { red: -1, blue: 1 },
    colorChrome: 'weak',
    colorChromeBlue: 'weak',
    clarity: 2,
  },
  'cinematic-eterna': {
    name: 'Cinematic Eterna',
    description: 'Desaturated cinematic look',
    filmSimulation: 'eterna',
    highlights: -2,
    shadows: 2,
    color: -2,
    sharpness: -3,
    grain: 'strong',
    whiteBalanceShift: { red: 0, blue: 2 },
    colorChrome: 'off',
    colorChromeBlue: 'weak',
    clarity: -3,
  },
  'pro-neg-hi': {
    name: 'Pro Neg. Hi',
    description: 'High contrast professional negative',
    filmSimulation: 'pro-neg-std',
    highlights: 2,
    shadows: -2,
    color: 0,
    sharpness: -1,
    grain: 'weak',
    whiteBalanceShift: { red: 3, blue: 0 },
    colorChrome: 'weak',
    colorChromeBlue: 'weak',
    clarity: 0,
  },
}

export const NANO_BANANA_PRO_RECIPE = FILM_RECIPES['nano-banana-pro']

/**
 * Applies Fujifilm-style color grading to an image
 */
export async function applyFujifilmTransform(
  imageUrl: string,
  recipe: FujifilmRecipe = NANO_BANANA_PRO_RECIPE
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Apply transformations
        applyFilmSimulation(data, recipe.filmSimulation)
        applyWhiteBalance(data, recipe.whiteBalanceShift)
        applyToneCurve(data, recipe.highlights, recipe.shadows)
        applyColorAdjustment(data, recipe.color)
        applyColorChrome(data, recipe.colorChrome, recipe.colorChromeBlue)
        applyClarity(data, canvas.width, canvas.height, recipe.clarity)
        applyGrain(data, recipe.grain)

        // Put modified data back
        ctx.putImageData(imageData, 0, 0)

        // Apply sharpness (requires second pass)
        if (recipe.sharpness !== 0) {
          applySharpness(ctx, canvas.width, canvas.height, recipe.sharpness)
        }

        // Convert to high-quality JPEG blob and return
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob))
            } else {
              reject(new Error('Could not create blob'))
            }
          },
          'image/jpeg',
          0.98 // High quality to preserve image details
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Could not load image'))
    }

    img.src = imageUrl
  })
}

/**
 * Apply film simulation base characteristics
 */
function applyFilmSimulation(
  data: Uint8ClampedArray,
  simulation: FujifilmRecipe['filmSimulation']
) {
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    switch (simulation) {
      case 'classic-chrome': {
        // Muted colors, lifted shadows, compressed highlights
        // Reduce saturation slightly
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        data[i] = r * 0.85 + gray * 0.15
        data[i + 1] = g * 0.85 + gray * 0.15
        data[i + 2] = b * 0.85 + gray * 0.15
        break
      }
      case 'pro-neg-std': {
        // Softer, warm tones
        data[i] = Math.min(255, r * 1.05)
        data[i + 1] = Math.min(255, g * 1.02)
        data[i + 2] = b * 0.98
        break
      }
      case 'eterna': {
        // Cinematic, desaturated
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        data[i] = r * 0.8 + gray * 0.2
        data[i + 1] = g * 0.8 + gray * 0.2
        data[i + 2] = b * 0.8 + gray * 0.2
        break
      }
      case 'velvia': {
        // Vivid, highly saturated colors
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        data[i] = Math.min(255, gray + (r - gray) * 1.4)
        data[i + 1] = Math.min(255, gray + (g - gray) * 1.4)
        data[i + 2] = Math.min(255, gray + (b - gray) * 1.4)
        break
      }
    }
  }
}

/**
 * Apply white balance shift
 */
function applyWhiteBalance(
  data: Uint8ClampedArray,
  shift: { red: number; blue: number }
) {
  const redFactor = 1 + shift.red * 0.02
  const blueFactor = 1 + shift.blue * 0.02
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] * redFactor))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * blueFactor))
  }
}

/**
 * Apply tone curve adjustments (highlights and shadows)
 */
function applyToneCurve(
  data: Uint8ClampedArray,
  highlights: number,
  shadows: number
) {
  const len = data.length
  const highlightFactor = 1 + highlights * 0.15
  const shadowFactor = 1 + shadows * 0.15

  for (let i = 0; i < len; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Calculate luminance
    const luma = 0.299 * r + 0.587 * g + 0.114 * b

    // Apply curve based on luminance
    if (luma > 127) {
      // Highlights
      const t = (luma - 127) / 128
      const factor = 1 + t * (highlightFactor - 1)
      data[i] = Math.min(255, r * factor)
      data[i + 1] = Math.min(255, g * factor)
      data[i + 2] = Math.min(255, b * factor)
    } else {
      // Shadows
      const t = luma / 127
      const factor = shadowFactor + t * (1 - shadowFactor)
      data[i] = Math.max(0, r * factor)
      data[i + 1] = Math.max(0, g * factor)
      data[i + 2] = Math.max(0, b * factor)
    }
  }
}

/**
 * Apply color adjustment (saturation)
 */
function applyColorAdjustment(data: Uint8ClampedArray, color: number) {
  const factor = 1 + color * 0.1
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const gray = 0.299 * r + 0.587 * g + 0.114 * b

    data[i] = Math.min(255, Math.max(0, gray + (r - gray) * factor))
    data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * factor))
    data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * factor))
  }
}

/**
 * Apply Color Chrome effects (boost saturation in mids)
 */
function applyColorChrome(
  data: Uint8ClampedArray,
  colorChrome: 'off' | 'weak' | 'strong',
  colorChromeBlue: 'off' | 'weak' | 'strong'
) {
  if (colorChrome === 'off' && colorChromeBlue === 'off') return

  const chromeStrength = colorChrome === 'strong' ? 1.2 : colorChrome === 'weak' ? 1.1 : 1
  const blueStrength = colorChromeBlue === 'strong' ? 1.3 : colorChromeBlue === 'weak' ? 1.15 : 1
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const luma = 0.299 * r + 0.587 * g + 0.114 * b

    // Apply to mid-tones primarily
    if (luma > 40 && luma < 215) {
      const t = 1 - Math.abs(luma - 127.5) / 127.5
      const gray = luma

      // Color Chrome effect
      if (colorChrome !== 'off') {
        const factor = 1 + t * (chromeStrength - 1) * 0.5
        data[i] = Math.min(255, gray + (r - gray) * factor)
        data[i + 1] = Math.min(255, gray + (g - gray) * factor)
        data[i + 2] = Math.min(255, gray + (b - gray) * factor)
      }

      // Blue enhancement
      if (colorChromeBlue !== 'off' && b > r && b > g) {
        data[i + 2] = Math.min(255, b * blueStrength)
      }
    }
  }
}

/**
 * Apply clarity adjustment (local contrast)
 */
function applyClarity(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  clarity: number
) {
  if (clarity === 0) return

  const factor = clarity * 0.15
  const tempData = new Uint8ClampedArray(data)

  // Simple local contrast enhancement
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4

      for (let c = 0; c < 3; c++) {
        const center = tempData[i + c]

        // Sample neighbors
        const top = tempData[((y - 1) * width + x) * 4 + c]
        const bottom = tempData[((y + 1) * width + x) * 4 + c]
        const left = tempData[(y * width + (x - 1)) * 4 + c]
        const right = tempData[(y * width + (x + 1)) * 4 + c]

        const avg = (top + bottom + left + right) / 4
        const diff = center - avg

        data[i + c] = Math.min(255, Math.max(0, center + diff * factor))
      }
    }
  }
}

/**
 * Apply film grain
 */
function applyGrain(data: Uint8ClampedArray, grain: 'off' | 'weak' | 'strong') {
  if (grain === 'off') return

  const strength = grain === 'strong' ? 15 : 8
  const len = data.length

  for (let i = 0; i < len; i += 4) {
    const noise = (Math.random() - 0.5) * strength
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
}

/**
 * Apply sharpness using convolution
 */
function applySharpness(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sharpness: number
) {
  if (sharpness === 0) return

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const tempData = new Uint8ClampedArray(data)

  // Sharpening kernel strength
  const amount = sharpness > 0 ? sharpness * 0.3 : sharpness * 0.2

  // Unsharp mask
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4

      for (let c = 0; c < 3; c++) {
        const center = tempData[i + c]

        // 3x3 box blur
        let sum = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += tempData[((y + dy) * width + (x + dx)) * 4 + c]
          }
        }
        const blurred = sum / 9

        // Unsharp mask
        const sharpened = center + (center - blurred) * amount
        data[i + c] = Math.min(255, Math.max(0, sharpened))
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
}
