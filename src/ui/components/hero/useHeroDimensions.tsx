import { useMemo } from 'react'
import { useTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'
import { LENGTH_M, LENGTH_L, MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_LANDSCAPE = 3 / 2
const RATIO_PORTRAIT = 2 / 3

type Props = {
  type: 'offer' | 'offerv2' | 'venue'
  hasImage: boolean
}

export const blurImageHeight = getSpacing(74)
export const heroMarginTop = MARGIN_DP + getSpacing(2)
const PORTRAIT_IMAGE_V2_HEIGHT = getSpacing(95)
const HEADER_HEIGHT = getSpacing(64.5)

export const useHeroDimensions = ({ type, hasImage }: Props) => {
  const { top } = useCustomSafeInsets()
  const { appContentWidth, borderRadius } = useTheme()
  const fullWidth = appContentWidth - 2 * MARGIN_DP

  return useMemo(() => {
    if (type === 'venue') {
      if (hasImage) {
        return {
          heroBackgroundHeight: top + blurImageHeight / RATIO_LANDSCAPE,
          imageStyle: {
            borderRadius: borderRadius.radius,
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
            borderRadius: borderRadius.button,
            width: LENGTH_M,
            aspectRatio: 1,
          },
        }
      }
    } else if (type === 'offerv2') {
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

    return {
      heroBackgroundHeight: top + blurImageHeight,
      imageStyle: {
        borderRadius: borderRadius.radius,
        height: blurImageHeight,
        width: Math.round(blurImageHeight * RATIO_PORTRAIT),
        maxWidth: fullWidth,
        aspectRatio: RATIO_PORTRAIT,
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasImage, type, top, borderRadius])
}
