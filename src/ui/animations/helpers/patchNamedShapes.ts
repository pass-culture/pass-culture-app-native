import { patchGradientStops } from 'ui/animations/helpers/gradientUtils'
import { AnimationObject, LottieColor, LottieGradient } from 'ui/animations/type'

type LottieKeyframe = { s?: number[] }
type LottieColorKey = number[] | LottieKeyframe[]

type LottieLayer = {
  name?: string
  shapes?: LottieItem[]
  layers?: LottieLayer[]
  [key: string]: unknown
}

type LottieAnimation = AnimationObject & {
  layers?: LottieLayer[]
  assets?: Array<{ layers?: LottieLayer[] }>
}

const hexToLottieRgb = (hex?: string): LottieColor => {
  if (!hex) return [0, 0, 0, 1]

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) return [0, 0, 0, 1]

  const [, r, g, b] = result
  if (!r || !g || !b) return [0, 0, 0, 1]
  return [parseInt(r, 16) / 255, parseInt(g, 16) / 255, parseInt(b, 16) / 255, 1]
}

type PatchNamedShapesOptions = {
  targetLayerNames?: string[]
}

type LottieItem = {
  name?: string
  color?: { keyValues?: LottieColorKey }
  type?: string
  gradient?: LottieGradient
  items?: LottieItem[]
  shapes?: LottieItem[]
  nestedLayers?: LottieLayer[]
  layers?: LottieLayer[]
  [key: string]: unknown
}

export const patchNamedShapes = (
  animation: AnimationObject,
  shapeNames: string[],
  hexColor: string,
  options?: PatchNamedShapesOptions
): AnimationObject => {
  const cloned: LottieAnimation = JSON.parse(JSON.stringify(animation))
  const color = hexToLottieRgb(hexColor)
  const targetLayerNames = options?.targetLayerNames

  const shouldPatchLayer = (layerName?: string) =>
    !Array.isArray(targetLayerNames) ||
    targetLayerNames.length === 0 ||
    targetLayerNames.some((name) => layerName?.includes(name))

  const getShapeName = (shape: LottieItem) => {
    if (typeof shape.name === 'string') return shape.name
    const rawName = shape['nm']
    return typeof rawName === 'string' ? rawName : ''
  }

  const getShapeType = (shape: LottieItem) => {
    if (typeof shape.type === 'string') return shape.type
    const rawType = shape['ty']
    return typeof rawType === 'string' ? rawType : undefined
  }

  const isShapeNode = (value: unknown): value is LottieItem =>
    typeof value === 'object' && value !== null

  const isLayerNode = (value: unknown): value is LottieLayer =>
    typeof value === 'object' && value !== null

  type ColorContainer = { k?: LottieColorKey }
  const isColorContainer = (value: unknown): value is ColorContainer =>
    typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, 'k')

  const getColorKey = (shape: LottieItem): LottieColorKey | undefined => {
    if (shape.color?.keyValues !== undefined) return shape.color.keyValues
    const rawColor = shape['c']
    if (isColorContainer(rawColor)) return rawColor.k
    return undefined
  }

  const setColorKey = (shape: LottieItem, value: LottieColorKey) => {
    if (shape.color?.keyValues !== undefined) {
      shape.color.keyValues = value
      return
    }
    const rawColor = shape['c']
    if (isColorContainer(rawColor)) {
      rawColor.k = value
      return
    }
    shape['c'] = { k: value }
  }

  const isGradientContainer = (value: unknown): value is LottieGradient =>
    typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, 'k')

  const getGradient = (shape: LottieItem) => {
    if (shape.gradient) return shape.gradient
    const rawGradient = shape['g']
    if (isGradientContainer(rawGradient)) return rawGradient
    return undefined
  }

  const getChildren = (shape: LottieItem): LottieItem[] => {
    if (Array.isArray(shape.items) && shape.items.every(isShapeNode)) return shape.items
    const rawItems = shape['it']
    if (Array.isArray(rawItems) && rawItems.every(isShapeNode)) return rawItems
    if (Array.isArray(shape.shapes) && shape.shapes.every(isShapeNode)) return shape.shapes
    const rawShapes = shape['shapes'] as unknown
    if (Array.isArray(rawShapes) && rawShapes.every(isShapeNode)) return rawShapes
    return []
  }

  const getNestedLayers = (shape: LottieItem): LottieLayer[] => {
    if (Array.isArray(shape.nestedLayers) && shape.nestedLayers.every(isLayerNode)) {
      return shape.nestedLayers
    }
    if (Array.isArray(shape.layers) && shape.layers.every(isLayerNode)) return shape.layers
    const rawLayers = shape['layers'] as unknown
    if (Array.isArray(rawLayers) && rawLayers.every(isLayerNode)) return rawLayers
    return []
  }

  const patchShapes = (items?: LottieItem[]) => {
    if (!Array.isArray(items)) return
    items.forEach((item) => {
      const shapeName = getShapeName(item)
      const shapeType = getShapeType(item)
      const colorKey = getColorKey(item)

      if (shapeNames.includes(shapeName) && colorKey) {
        setColorKey(item, color)
      }

      if (shapeNames.includes(shapeName) && (shapeType === 'gf' || shapeType === 'gs')) {
        const gradient = getGradient(item)
        if (gradient) patchGradientStops(gradient, color)
      }

      const children = getChildren(item)
      if (children.length) patchShapes(children)

      const nestedLayers = getNestedLayers(item)
      if (nestedLayers.length) {
        nestedLayers.forEach((layer) => patchShapes(layer.shapes))
      }
    })
  }

  const getLayerName = (layer: LottieLayer, parentName?: string) => {
    if (typeof layer.name === 'string') return layer.name
    const rawName = layer['nm']
    if (typeof rawName === 'string') return rawName
    return parentName
  }

  const patchLayers = (layers?: LottieLayer[], parentName?: string) => {
    if (!Array.isArray(layers)) return
    layers.forEach((layer) => {
      const layerName = getLayerName(layer, parentName)
      if (shouldPatchLayer(layerName) && Array.isArray(layer.shapes)) {
        patchShapes(layer.shapes)
      }
      if (Array.isArray(layer.layers)) {
        patchLayers(layer.layers, layerName)
      }
    })
  }

  patchLayers(cloned.layers)
  if (Array.isArray(cloned.assets)) {
    cloned.assets.forEach((asset) => patchLayers(asset.layers))
  }

  return cloned
}
