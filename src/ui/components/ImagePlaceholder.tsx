import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface ImagePlaceholderProps {
  Icon: React.FC<AccessibleIcon>
  size: number
  backgroundColors?: ColorsEnum[]
  borderRadius?: number
  iconColor?: ColorsEnum
}

export const ImagePlaceholder = styled(
  ({ Icon, size, iconColor, ...props }: ImagePlaceholderProps) => {
    const { colors } = useTheme()
    return (
      <StyledLinearGradient
        colors={[colors.greyLight, colors.greyMedium]}
        borderRadius={props.borderRadius as number}
        {...props}
        testID="imagePlaceholder">
        <Icon testID="categoryIcon" size={size} color={iconColor} />
      </StyledLinearGradient>
    )
  }
).attrs(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  iconColor: theme.designSystem.color.icon.subtle,
}))``

const StyledLinearGradient = styled(LinearGradient)<{ borderRadius: number }>(
  ({ borderRadius, theme }) => ({
    borderRadius,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.designSystem.color.background.subtle,
  })
)
