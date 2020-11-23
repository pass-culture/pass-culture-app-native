import { PixelRatio } from 'react-native'

import { getSpacing } from 'ui/theme/spacing'

export enum BorderRadiusEnum {
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
