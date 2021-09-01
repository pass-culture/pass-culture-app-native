import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export interface ImagePlaceholderProps {
  Icon: React.FC<IconInterface>
  size: number
  borderRadius?: number
  colors?: ColorsEnum[]
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  colors = [ColorsEnum.GREY_LIGHT, ColorsEnum.GREY_MEDIUM],
  Icon,
  size,
  borderRadius = BorderRadiusEnum.BORDER_RADIUS,
}) => (
  <StyledLinearGradient colors={colors} borderRadius={borderRadius} testID="imagePlaceholder">
    <Icon testID="categoryIcon" size={size} color={ColorsEnum.GREY_MEDIUM} />
  </StyledLinearGradient>
)

const StyledLinearGradient = styled(LinearGradient)<{ borderRadius: number }>(
  ({ borderRadius }) => ({
    borderRadius,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  })
)
