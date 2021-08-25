import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { blurImageHeight } from 'ui/components/hero/HeroHeader'
import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum, LENGTH_L, MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_LANDSCAPE = 3 / 2
const RATIO_PORTRAIT = 2 / 3

export const heroBackgroundHeight = blurImageHeight
export const heroMarginTop = MARGIN_DP + getSpacing(0.5)

export const useHeroDimensions = (landscape: boolean) => {
  const { top } = useCustomSafeInsets()
  const fullWidth = useWindowDimensions().width - 2 * MARGIN_DP

  return useMemo(() => {
    if (landscape) {
      return {
        heroBackgroundHeight: top + heroBackgroundHeight / RATIO_LANDSCAPE,
        imageStyle: {
          borderRadius: BorderRadiusEnum.BORDER_RADIUS,
          maxWidth: LENGTH_L * RATIO_LANDSCAPE,
          height: Math.min(LENGTH_L, fullWidth / RATIO_LANDSCAPE),
          width: fullWidth,
          maxHeight: LENGTH_L,
          aspectRatio: RATIO_LANDSCAPE,
        },
      }
    }

    return {
      heroBackgroundHeight: top + heroBackgroundHeight,
      imageStyle: {
        borderRadius: BorderRadiusEnum.BORDER_RADIUS,
        height: blurImageHeight,
        width: Math.round(blurImageHeight * RATIO_PORTRAIT),
        maxWidth: fullWidth,
        aspectRatio: RATIO_PORTRAIT,
      },
    }
  }, [landscape, top])
}
