import { PixelRatio } from 'react-native'

export enum BorderRadiusEnum {
  BUTTON = 24,
  BORDER_RADIUS = 8,
  CHECKBOX_RADIUS = 4,
  TILE = 12,
}

// Horizontal constants
export const MARGIN_DP = 24
export const GUTTER_DP = 16

// Vertical constants for homepage modules
export const LENGTH_XXS = PixelRatio.roundToNearestPixel(4 * MARGIN_DP)
export const LENGTH_XS = PixelRatio.roundToNearestPixel(6 * MARGIN_DP)
export const LENGTH_S = PixelRatio.roundToNearestPixel(7 * MARGIN_DP)
export const LENGTH_M = PixelRatio.roundToNearestPixel(9 * MARGIN_DP)
export const LENGTH_L = PixelRatio.roundToNearestPixel(12 * MARGIN_DP)

// Ratios used for homepage modules (height / width). Source: Zeplin
export const RATIO_BUSINESS = 1 / 3
export const RATIO_HOME_IMAGE = 2 / 3
export const RATIO_MARKETING_BLOCK = 5 / 4

/**
 * Breakpoint	Class infix	Dimensions
 XX-Small	xxs	≥320px
 X-Small xs  ≥358px
 Small	sm	≥576px
 Medium	md	≥960px
 Large	lg	≥1024px
 Extra large	xl	≥1200px
 Extra extra large	xxl	≥1400px
 */
export enum Breakpoints {
  XXS = 320,
  XS = 358,
  SM = 576,
  MD = 960,
  LG = 1024,
  XL = 1200,
  XXL = 1400,
}
