import { useMemo } from 'react'
import { Dimensions } from 'react-native'

import { blurImageHeight } from 'ui/components/hero/HeroHeader'
import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum, LENGTH_L, MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_LANDSCAPE = 3 / 2
const RATIO_PORTRAIT = 2 / 3

const fullWidth = Dimensions.get('window').width - 2 * MARGIN_DP

export const heroBackgroundHeight = blurImageHeight
export const heroMarginTop = MARGIN_DP + getSpacing(0.5)

export const useHeroDimensions = (landscape: boolean) => {
  const { top } = useCustomSafeInsets()

  return useMemo(() => {
    if (landscape) {
      return {
        heroBackgroundHeight: top + heroBackgroundHeight / RATIO_LANDSCAPE,
        imageStyle: {
          borderRadius: BorderRadiusEnum.BORDER_RADIUS,
          height: Math.round(blurImageHeight * RATIO_LANDSCAPE),
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
