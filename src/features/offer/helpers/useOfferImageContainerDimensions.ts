import { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { getSpacing } from 'ui/theme'
import { MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_PORTRAIT = 2 / 3

export const blurImageHeight = getSpacing(74)
export const offerImageContainerMarginTop = MARGIN_DP + getSpacing(2)
const HEADER_HEIGHT = getSpacing(64.5)

const PORTRAIT_DIMENSIONS = {
  default: { height: getSpacing(95), width: getSpacing(95) * RATIO_PORTRAIT },
  musique: { height: getSpacing(60), width: getSpacing(60) },
} as const

export type OfferImageContainerDimensions = {
  backgroundHeight: number
  imageStyle: {
    height: number
    width: number
    maxWidth: number
    aspectRatio: number
    borderRadius: number
  }
  imageStyleWithoutBorderRadius: {
    height: number
    width: number
    maxWidth: number
    aspectRatio: number
    borderRadius: number
  }
}

export const useOfferImageContainerDimensions = (
  subcategoryId?: SubcategoryIdEnum
): OfferImageContainerDimensions => {
  const { top } = useCustomSafeInsets()
  const { appContentWidth, borderRadius } = useTheme()
  const fullWidth = appContentWidth - 2 * MARGIN_DP

  const isMusique =
    subcategoryId ===
    (SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD ||
      SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE)

  const { height, width } = isMusique ? PORTRAIT_DIMENSIONS.musique : PORTRAIT_DIMENSIONS.default

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
    imageStyleWithoutBorderRadius: getImageStyle(0),
  }
}
