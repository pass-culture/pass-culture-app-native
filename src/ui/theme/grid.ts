import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

export const BORDER_RADIUS = 8

// Horizontal constants
export const MARGIN_DP = 24
export const GUTTER_DP = 16

// Vertical constants for homepage modules
export const LENGTH_S = PixelRatio.roundToNearestPixel(6 * MARGIN_DP)
export const LENGTH_M = PixelRatio.roundToNearestPixel(9 * MARGIN_DP)
export const LENGTH_L = PixelRatio.roundToNearestPixel(12 * MARGIN_DP)
export const LENGTH_XL = PixelRatio.roundToNearestPixel(15 * MARGIN_DP)

// Ratios used for homepage modules (height / width). Source: Zeplin
export const RATIO_BUSINESS = 116 / 332
export const RATIO_ALGOLIA = 146 / 220
export const RATIO_EXCLU = 292 / 333

interface Props {
  horizontal?: boolean
}

export const Margin = styled.View<Props>(({ horizontal = false }) =>
  horizontal
    ? { height: PixelRatio.roundToNearestPixel(MARGIN_DP) }
    : { width: PixelRatio.roundToNearestPixel(MARGIN_DP) }
)

export const Gutter = styled.View<Props>(({ horizontal = false }) =>
  horizontal
    ? { height: PixelRatio.roundToNearestPixel(GUTTER_DP) }
    : { width: PixelRatio.roundToNearestPixel(GUTTER_DP) }
)
