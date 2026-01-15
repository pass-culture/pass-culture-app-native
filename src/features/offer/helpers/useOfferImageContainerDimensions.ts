import { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { getSpacing } from 'ui/theme'
import { MARGIN_DP } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const RATIO_PORTRAIT = 2 / 3
const RATIO_SQUARE = 1

export const blurImageHeight = getSpacing(74)
const HEADER_HEIGHT = getSpacing(64.5)

const PORTRAIT_DIMENSIONS = {
  default: { height: getSpacing(95), width: getSpacing(95) * RATIO_PORTRAIT },
  music: { height: getSpacing(60), width: getSpacing(60) },
} as const

export const useOfferImageContainerDimensions = (
  subcategoryId?: SubcategoryIdEnum
): OfferImageContainerDimensions => {
  const { top } = useCustomSafeInsets()
  const { appContentWidth, designSystem } = useTheme()
  const fullWidth = appContentWidth - 2 * MARGIN_DP

  const isMusicSupport = subcategoryId
    ? [
        SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
        SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      ].includes(subcategoryId)
    : false

  const { height, width } = isMusicSupport ? PORTRAIT_DIMENSIONS.music : PORTRAIT_DIMENSIONS.default
  const aspectRatio = isMusicSupport ? RATIO_SQUARE : RATIO_PORTRAIT

  const getImageStyle = (borderRadiusValue: number) => ({
    height,
    width,
    maxWidth: fullWidth,
    aspectRatio,
    borderRadius: borderRadiusValue,
  })

  return {
    backgroundHeight: top + HEADER_HEIGHT,
    imageStyle: getImageStyle(designSystem.size.borderRadius.m),
  }
}
