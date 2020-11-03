import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

export const BORDER_RADIUS = 8
export const MARGIN_DP = 24
export const GUTTER_DP = 16

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
