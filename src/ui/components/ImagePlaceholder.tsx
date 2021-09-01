import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export interface ImagePlaceholderProps {
  Icon: React.FC<IconInterface>
  size: number
  backgroundColors?: ColorsEnum[]
  borderRadius?: number
  iconColor?: ColorsEnum
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  backgroundColors,
  Icon,
  size: iconSize,
  borderRadius = BorderRadiusEnum.BORDER_RADIUS,
  iconColor = ColorsEnum.GREY_MEDIUM,
}) => {
  if (backgroundColors) {
    return (
      <StyledLinearGradient
        colors={backgroundColors}
        borderRadius={borderRadius}
        testID="imagePlaceholder">
        <Icon testID="categoryIcon" size={iconSize} color={iconColor} />
      </StyledLinearGradient>
    )
  }

  const backgroundSize = 3 * iconSize

  return (
    <HeaderBackgroundWrapper borderRadius={borderRadius} testID="imagePlaceholder">
      <HeaderBackground width={backgroundSize} height={backgroundSize} />
      <IconContainer>
        <Icon testID="categoryIcon" size={iconSize} color={iconColor} />
      </IconContainer>
    </HeaderBackgroundWrapper>
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

const HeaderBackgroundWrapper = styled.View<{ borderRadius: number }>(({ borderRadius }) => ({
  borderRadius,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}))

const IconContainer = styled.View({ position: 'absolute' })
