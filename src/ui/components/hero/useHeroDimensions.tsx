import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum, LENGTH_M, LENGTH_L, MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_LANDSCAPE = 3 / 2
const RATIO_PORTRAIT = 2 / 3

export const blurImageHeight = getSpacing(74)
export const heroMarginTop = MARGIN_DP + getSpacing(0.5)

export const useHeroDimensions = (type: 'offer' | 'venue', hasImage: boolean) => {
  const { top } = useCustomSafeInsets()
  const fullWidth = useWindowDimensions().width - 2 * MARGIN_DP

  return useMemo(() => {
    if (type === 'venue') {
      if (hasImage) {
        return {
          heroBackgroundHeight: top + blurImageHeight / RATIO_LANDSCAPE,
          imageStyle: {
            borderRadius: BorderRadiusEnum.BORDER_RADIUS,
            maxWidth: LENGTH_L * RATIO_LANDSCAPE,
            height: Math.min(LENGTH_L, fullWidth / RATIO_LANDSCAPE),
            width: fullWidth,
            maxHeight: LENGTH_L,
            aspectRatio: RATIO_LANDSCAPE,
          },
        }
      } else {
        return {
          heroBackgroundHeight: top + blurImageHeight / RATIO_LANDSCAPE,
          imageStyle: {
            borderRadius: BorderRadiusEnum.BUTTON,
            width: LENGTH_M,
            aspectRatio: 1,
          },
        }
      }
    }

    return {
      heroBackgroundHeight: top + blurImageHeight,
      imageStyle: {
        borderRadius: BorderRadiusEnum.BORDER_RADIUS,
        height: blurImageHeight,
        width: Math.round(blurImageHeight * RATIO_PORTRAIT),
        maxWidth: fullWidth,
        aspectRatio: RATIO_PORTRAIT,
      },
    }
  }, [hasImage, type, top])
}
