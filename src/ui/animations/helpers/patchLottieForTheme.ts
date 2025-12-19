import { patchGradientStops } from 'ui/animations/helpers/gradientUtils'
import { AnimationObject, LottieColor, LottieGradient } from 'ui/animations/type'

type LottieThemeColors = {
  fill: string
}

type LottieKeyframe = {
  startValues?: number[]
  [key: string]: unknown
}
type LottieColorKey = number[] | LottieKeyframe[]

type LottieShapeNode = {
  name?: string
  type?: string
  color?: { keyValues?: LottieColorKey }
  gradient?: LottieGradient
  items?: LottieShapeNode[]
  shapes?: LottieShapeNode[]
  nestedLayers?: LottieLayerNode[]
  layers?: LottieLayerNode[]
  [key: string]: unknown
}

type LottieLayerNode = {
  name?: string
  shapes?: LottieShapeNode[]
  layers?: LottieLayerNode[]
  [key: string]: unknown
}

type LottieAnimation = AnimationObject & {
  layers?: LottieLayerNode[]
  assets?: Array<{ layers?: LottieLayerNode[] }>
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

  const processLayers = (layers?: LottieLayerNode[]) => {
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

  patchedAnimation.assets?.forEach((asset) => processLayers(asset.layers))

  return patchedAnimation
}

const isColorArray = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.length >= 3 &&
  value.slice(0, 3).every((component) => typeof component === 'number')

const getKeyframeValues = (keyframe: LottieKeyframe): number[] | undefined => {
  if (Array.isArray(keyframe.startValues)) return keyframe.startValues
  const rawValues = keyframe['s']
  return Array.isArray(rawValues) ? rawValues : undefined
}

const isKeyframeArray = (value: unknown): value is LottieKeyframe[] =>
  Array.isArray(value) &&
  value.every(
    (item) => typeof item === 'object' && item !== null && getKeyframeValues(item) !== undefined
  )

const cloneAnimation = (animation: AnimationObject): LottieAnimation =>
  JSON.parse(JSON.stringify(animation))

const getAlpha = (value: number[]) => (typeof value[3] === 'number' ? value[3] : 1)

const getShapeType = (shape: LottieShapeNode) => {
  if (typeof shape.type === 'string') return shape.type
  const rawType = shape['ty']
  return typeof rawType === 'string' ? rawType : undefined
}

const isShapeNode = (value: unknown): value is LottieShapeNode =>
  typeof value === 'object' && value !== null

const getShapeChildren = (shape: LottieShapeNode): LottieShapeNode[] => {
  if (Array.isArray(shape.items) && shape.items.every(isShapeNode)) return shape.items
  const rawItems = shape['it']
  if (Array.isArray(rawItems) && rawItems.every(isShapeNode)) return rawItems
  const rawShapes = shape['shapes']
  if (Array.isArray(rawShapes) && rawShapes.every(isShapeNode)) return rawShapes
  return []
}

const isLayerNode = (value: unknown): value is LottieLayerNode =>
  typeof value === 'object' && value !== null

const getNestedLayers = (shape: LottieShapeNode): LottieLayerNode[] => {
  if (Array.isArray(shape.nestedLayers) && shape.nestedLayers.every(isLayerNode)) {
    return shape.nestedLayers
  }
  if (Array.isArray(shape.layers) && shape.layers.every(isLayerNode)) return shape.layers
  const rawLayers = shape['layers'] as unknown
  if (Array.isArray(rawLayers) && rawLayers.every(isLayerNode)) return rawLayers
  return []
}

type ColorContainer = { k?: LottieColorKey }
const isColorContainer = (value: unknown): value is ColorContainer =>
  typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, 'k')

const getColorKey = (shape: LottieShapeNode): LottieColorKey | undefined => {
  if (shape.color?.keyValues !== undefined) return shape.color.keyValues
  const rawColor = shape['c']
  if (isColorContainer(rawColor)) return rawColor.k
  return undefined
}

const setColorKey = (shape: LottieShapeNode, value: LottieColorKey) => {
  if (shape.color?.keyValues !== undefined) {
    shape.color.keyValues = value
    return
  }

  const colorKeyProperty = 'k'
  const rawColor = shape['c']
  if (isColorContainer(rawColor)) {
    rawColor[colorKeyProperty] = value
    return
  }

  shape['c'] = { [colorKeyProperty]: value }
}

const isGradientContainer = (value: unknown): value is LottieGradient =>
  typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, 'k')

const getGradient = (shape: LottieShapeNode): LottieGradient | undefined => {
  if (shape.gradient) return shape.gradient
  const rawGradient = shape['g']
  if (isGradientContainer(rawGradient)) return rawGradient
  return undefined
}

const patchShapes = (shapes: LottieShapeNode[], newColor: LottieColor) => {
  for (const shape of shapes) {
    const children = getShapeChildren(shape)
    if (children.length) patchShapes(children, newColor)

    const shapeType = getShapeType(shape)
    const colorKey = getColorKey(shape)

    if ((shapeType === 'fl' || shapeType === 'st') && colorKey !== undefined) {
      if (isColorArray(colorKey)) {
        const alpha = getAlpha(colorKey)
        setColorKey(shape, [newColor[0], newColor[1], newColor[2], alpha])
        continue
      }

      if (isKeyframeArray(colorKey)) {
        colorKey.forEach((keyframe) => {
          const keyframeValues = getKeyframeValues(keyframe)

          if (isColorArray(keyframeValues)) {
            const oldColor = keyframeValues
            const alpha = getAlpha(oldColor)
            const nextColor = [newColor[0], newColor[1], newColor[2], alpha]
            if (Array.isArray(keyframe.startValues)) {
              keyframe.startValues = nextColor
            } else {
              keyframe['s'] = nextColor
            }
          }
        })
      }
    }

    const gradient = getGradient(shape)
    if ((shapeType === 'gs' || shapeType === 'gf') && gradient) {
      patchGradientStops(gradient, newColor)
    }

    const nestedLayers = getNestedLayers(shape)
    if (nestedLayers.length) {
      nestedLayers.forEach((layer) => {
        if (Array.isArray(layer.shapes)) patchShapes(layer.shapes, newColor)
      })
    }
  }
}
