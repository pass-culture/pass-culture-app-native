import { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { getSpacing } from 'ui/theme'
import { MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_PORTRAIT = 2 / 3

export const blurImageHeight = getSpacing(74)
export const offerImageContainerMarginTop = MARGIN_DP + getSpacing(2)
const HEADER_HEIGHT = getSpacing(64.5)

const PORTRAIT_DIMENSIONS = {
  default: { height: getSpacing(95), width: getSpacing(95) * RATIO_PORTRAIT },
  music: { height: getSpacing(95) * RATIO_PORTRAIT, width: getSpacing(95) * RATIO_PORTRAIT },
} as const

export const useOfferImageContainerDimensions = (
  subcategoryId?: SubcategoryIdEnum
): OfferImageContainerDimensions => {
  const { top } = useCustomSafeInsets()
  const { appContentWidth, borderRadius } = useTheme()
  const fullWidth = appContentWidth - 2 * MARGIN_DP

  const isMusicSupport =
    subcategoryId ===
    (SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD ||
      SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE)

  const { height, width } = isMusicSupport ? PORTRAIT_DIMENSIONS.music : PORTRAIT_DIMENSIONS.default

  const getImageStyle = (borderRadiusValue: number) => ({
    height,
    width,
    maxWidth: fullWidth,
    aspectRatio: RATIO_PORTRAIT,
    borderRadius: borderRadiusValue,
  })

  return {
    backgroundHeight: top + HEADER_HEIGHT,
    imageStyle: getImageStyle(borderRadius.radius),
  }
}
