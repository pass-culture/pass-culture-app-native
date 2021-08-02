import { Dimensions } from 'react-native'

import { blurImageHeight } from 'ui/components/hero/HeroHeader'
import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const columnMargin = 2 * 6
const { width } = Dimensions.get('window')

export const HeroLandscape = () => {
  const { top } = useCustomSafeInsets()
  const numberOfSpacesColumn = 25
  const imageHeightBackground = blurImageHeight / 1.4 + top
  const imageWidth = width - getSpacing(columnMargin)
  const imageHeight = getSpacing(58)
  const imageStyle = {
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
    width: imageWidth,
  }
  return { numberOfSpacesColumn, imageHeightBackground, imageStyle }
}
