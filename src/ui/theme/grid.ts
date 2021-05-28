import { Dimensions, PixelRatio } from 'react-native'

import { Layout } from 'features/home/contentful'
import { getSpacing } from 'ui/theme/spacing'

export enum BorderRadiusEnum {
  BUTTON = 24,
  BORDER_RADIUS = 8,
  CHECKBOX_RADIUS = getSpacing(1),
}

// Horizontal constants
export const MARGIN_DP = 24
export const GUTTER_DP = 16

// Vertical constants for homepage modules
export const LENGTH_S = PixelRatio.roundToNearestPixel(6 * MARGIN_DP)
export const LENGTH_M = PixelRatio.roundToNearestPixel(9 * MARGIN_DP)
export const LENGTH_L = PixelRatio.roundToNearestPixel(12 * MARGIN_DP)
export const LENGTH_XL = PixelRatio.roundToNearestPixel(15 * MARGIN_DP)

// Ratios used for homepage modules (height / width). Source: Zeplin
export const RATIO_BUSINESS = 1 / 3
export const RATIO_ALGOLIA = 2 / 3
export const RATIO_EXCLU = 5 / 6

export const dimensions = Dimensions.get('window')

export enum Breakpoints {
  SM = 600,
}

export enum Axis {
  WIDTH = 'width',
  HEIGHT = 'height',
}

export interface Grid {
  sm?: number
  default: number
}

export const getGrid = (grid: Grid, axis: Axis = Axis.WIDTH) => {
  const axisLength = dimensions[axis]
  if (grid.sm && axisLength < Breakpoints.SM) {
    return grid.sm
  }
  return grid.default
}

export const getAlgoliaDimensions = (layout?: Layout): { height: number; width: number } => {
  const height = layout === 'two-items' ? LENGTH_M : LENGTH_L
  const width = height * RATIO_ALGOLIA
  return { height, width }
}
