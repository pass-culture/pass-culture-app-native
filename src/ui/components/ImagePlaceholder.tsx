import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { CategoryNameEnum, VenueTypeCode } from 'api/gen'
import { mapCategoryToIcon, mapTypeToIcon } from 'libs/parsers'
import { ColorsEnum } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  categoryName: CategoryNameEnum | VenueTypeCode | null
  size: number
  borderRadius?: number
}

export const ImagePlaceholder: React.FC<Props> = ({
  categoryName,
  size,
  borderRadius = BorderRadiusEnum.BORDER_RADIUS,
}) => {
  const CategoryIcon =
    categoryName && categoryName in CategoryNameEnum
      ? mapCategoryToIcon(categoryName as CategoryNameEnum)
      : mapTypeToIcon(categoryName as VenueTypeCode)

  return (
    <StyledLinearGradient
      colors={[ColorsEnum.GREY_LIGHT, ColorsEnum.GREY_MEDIUM]}
      borderRadius={borderRadius}
      testID="imagePlaceholder">
      <CategoryIcon testID="categoryIcon" size={size} color={ColorsEnum.GREY_MEDIUM} />
    </StyledLinearGradient>
  )
}

const StyledLinearGradient = styled(LinearGradient)<{ borderRadius: number }>(
  ({ borderRadius }) => ({
    borderRadius,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  })
)
