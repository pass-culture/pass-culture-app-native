import { useCallback } from 'react'
import { PixelRatio, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

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
export const LENGTH_XS = PixelRatio.roundToNearestPixel(6 * MARGIN_DP)
export const LENGTH_S = PixelRatio.roundToNearestPixel(7 * MARGIN_DP)
export const LENGTH_M = PixelRatio.roundToNearestPixel(9 * MARGIN_DP)
export const LENGTH_L = PixelRatio.roundToNearestPixel(12 * MARGIN_DP)
export const LENGTH_XL = PixelRatio.roundToNearestPixel(15 * MARGIN_DP)

// Ratios used for homepage modules (height / width). Source: Zeplin
export const RATIO_BUSINESS = 1 / 3
export const RATIO_HOME_IMAGE = 2 / 3
export const RATIO_EXCLU = 5 / 6

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

interface Grid {
  sm?: number
  md?: number
  default: number
}

type Axis = 'width' | 'height'

export function useGrid() {
  const { height: windowHeight } = useWindowDimensions()
  const { appContentWidth } = useTheme()
  return useCallback(
    (grid: Grid, axis: Axis = 'width') => {
      const axisLength = axis === 'width' ? appContentWidth : windowHeight

      if (grid.md && axisLength < Breakpoints.MD) {
        return grid.md
      } else if (grid.sm && axisLength < Breakpoints.SM) {
        return grid.sm
      }
      return grid.default
    },
    [appContentWidth, windowHeight]
  )
}
