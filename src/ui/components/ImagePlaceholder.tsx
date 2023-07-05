import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ImagePlaceholderVenue } from 'ui/svg/ImagePlaceholderVenue'
import { LENGTH_M } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface ImagePlaceholderProps {
  Icon: React.FC<IconInterface>
  size: number
  backgroundColors?: ColorsEnum[]
  borderRadius?: number
  iconColor?: ColorsEnum
}

const ImagePlaceholderComponent: React.FC<ImagePlaceholderProps> = ({
  backgroundColors,
  Icon,
  size: iconSize,
  borderRadius,
  iconColor,
}) => {
  if (backgroundColors) {
    return (
      <StyledLinearGradient
        colors={backgroundColors}
        borderRadius={borderRadius as number}
        testID="imagePlaceholder">
        <Icon testID="categoryIcon" size={iconSize} color={iconColor} />
      </StyledLinearGradient>
    )
  }

  // Not too sure why but `LENGTH_M` is not enough and doesn't look good
  const size = LENGTH_M + (borderRadius as number)

  return (
    <HeaderBackgroundWrapper borderRadius={borderRadius as number} testID="imagePlaceholder">
      <ImagePlaceholderVenue width={size} height={size} />
      <IconContainer>
        <Icon testID="categoryIcon" size={iconSize} color={iconColor} />
      </IconContainer>
    </HeaderBackgroundWrapper>
  )
}

export const ImagePlaceholder = styled(ImagePlaceholderComponent).attrs(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  iconColor: theme.colors.greyMedium,
}))``

const StyledLinearGradient = styled(LinearGradient)<{ borderRadius: number }>(
  ({ borderRadius, theme }) => ({
    borderRadius,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.greyLight,
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
