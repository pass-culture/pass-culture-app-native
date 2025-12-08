import { AnimationObject } from 'ui/animations/type'

type LottieColor = [number, number, number, number]

type LottieThemeColors = {
  fill: string
}

type LottieKeyframe = { s?: number[] }
type LottieColorKey = number[] | LottieKeyframe[]

type LottieShape = {
  ty?: string
  c?: { k?: LottieColorKey }
  it?: LottieShape[]
  [key: string]: unknown
}

type LottieLayer = {
  shapes?: LottieShape[]
  layers?: LottieLayer[]
  [key: string]: unknown
}

type LottieAsset = {
  layers?: LottieLayer[]
  [key: string]: unknown
}

type LottieAnimation = AnimationObject & {
  layers: LottieLayer[]
  assets: LottieAsset[]
}

const hexToLottieRgba = (hexColor: string): LottieColor => {
  const normalizedHex = hexColor.replace('#', '')
  const expandedHex =
    normalizedHex.length === 3
      ? normalizedHex
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalizedHex.slice(0, 6)

  const red = parseInt(expandedHex.slice(0, 2), 16) / 255
  const green = parseInt(expandedHex.slice(2, 4), 16) / 255
  const blue = parseInt(expandedHex.slice(4, 6), 16) / 255
  return [red, green, blue, 1]
}

export const patchLottieForTheme = (
  animationJson: AnimationObject,
  themeColors: LottieThemeColors
) => {
  const patchedAnimation = cloneAnimation(animationJson)
  const fillColor = hexToLottieRgba(themeColors.fill)

  const processLayers = (layers: LottieLayer[] | undefined) => {
    if (!Array.isArray(layers)) return
    for (const layer of layers) {
      if (Array.isArray(layer.shapes)) {
        patchShapes(layer.shapes, fillColor)
      }
      if (Array.isArray(layer.layers)) {
        processLayers(layer.layers)
      }
    }
  }

  processLayers(patchedAnimation.layers)

  if (Array.isArray(patchedAnimation.assets)) {
    for (const asset of patchedAnimation.assets) {
      if (Array.isArray(asset.layers)) {
        processLayers(asset.layers)
      }
    }
  }

  return patchedAnimation
}

const isColorArray = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.length >= 3 &&
  value.slice(0, 3).every((component) => typeof component === 'number')

const isKeyframeArray = (value: unknown): value is LottieKeyframe[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && 's' in item)

const cloneAnimation = (animation: AnimationObject): LottieAnimation =>
  JSON.parse(JSON.stringify(animation))

const getAlpha = (value: number[]) => (typeof value[3] === 'number' ? value[3] : 1)

const patchShapes = (shapes: LottieShape[], newColor: LottieColor) => {
  for (const shape of shapes) {
    if (Array.isArray(shape.it)) {
      patchShapes(shape.it, newColor)
    }

    if ((shape.ty === 'fl' || shape.ty === 'st') && shape.c?.k !== undefined) {
      const colorKey = shape.c.k

      if (isColorArray(colorKey)) {
        const alpha = getAlpha(colorKey)
        shape.c.k = [newColor[0], newColor[1], newColor[2], alpha]
        continue
      }

      if (isKeyframeArray(colorKey)) {
        colorKey.forEach((keyframe) => {
          if (isColorArray(keyframe.s)) {
            const oldColor = keyframe.s
            const alpha = getAlpha(oldColor)
            keyframe.s = [newColor[0], newColor[1], newColor[2], alpha]
          }
        })
      }
    }
  }
}
