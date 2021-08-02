import { blurImageHeight } from 'ui/components/hero/HeroHeader'
import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const HeroPortrait = () => {
  const { top } = useCustomSafeInsets()
  const numberOfSpacesColumn = 22
  const imageHeightBackground = blurImageHeight + top
  const imageWidth = getSpacing(53)
  const imageHeight = getSpacing(79)
  const imageStyle = {
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
    width: imageWidth,
  }
  return { numberOfSpacesColumn, imageHeightBackground, imageStyle }
}
