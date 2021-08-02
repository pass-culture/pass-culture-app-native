import { useMemo } from 'react'
import { Dimensions } from 'react-native'

import { blurImageHeight } from 'ui/components/hero/HeroHeader'
import { getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const columnMargin = 2 * 6
const { width } = Dimensions.get('window')

export const useHeroDimensions = (landscape: boolean) => {
  const { top } = useCustomSafeInsets()
  const imageWidth = landscape ? width - getSpacing(columnMargin) : getSpacing(53)
  const imageHeight = landscape ? getSpacing(58) : getSpacing(79)
  const backgroundHeight = landscape ? blurImageHeight / 1.4 + top : blurImageHeight + top
  const numberOfSpacesColumn = landscape ? 25 : 22
  return useMemo(
    () => ({
      numberOfSpacesColumn,
      backgroundHeight,
      imageStyle: {
        borderRadius: BorderRadiusEnum.BORDER_RADIUS,
        height: imageHeight,
        width: imageWidth,
      },
    }),
    [landscape]
  )
}
