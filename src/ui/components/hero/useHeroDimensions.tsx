import { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_PORTRAIT = 2 / 3

export const blurImageHeight = getSpacing(74)
export const heroMarginTop = MARGIN_DP + getSpacing(2)
const PORTRAIT_IMAGE_V2_HEIGHT = getSpacing(95)
const HEADER_HEIGHT = getSpacing(64.5)

export const useHeroDimensions = () => {
  const { top } = useCustomSafeInsets()
  const { appContentWidth, borderRadius } = useTheme()
  const fullWidth = appContentWidth - 2 * MARGIN_DP

  return {
    heroBackgroundHeight: top + HEADER_HEIGHT,
    imageStyle: {
      borderRadius: borderRadius.radius,
      height: PORTRAIT_IMAGE_V2_HEIGHT,
      width: Math.round(PORTRAIT_IMAGE_V2_HEIGHT * RATIO_PORTRAIT),
      maxWidth: fullWidth,
      aspectRatio: RATIO_PORTRAIT,
    },
  }
}
