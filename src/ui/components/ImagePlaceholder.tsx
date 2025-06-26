import React from 'react'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface ImagePlaceholderProps {
  Icon: React.FC<AccessibleIcon>
  size: number
  borderRadius?: number
  iconColor?: ColorsType
}

export const ImagePlaceholder = styled(
  ({ Icon, size, iconColor, borderRadius, ...props }: ImagePlaceholderProps) => {
    return (
      <Container borderRadius={borderRadius} {...props} testID="imagePlaceholder">
        <Icon testID="categoryIcon" size={size} color={iconColor} />
      </Container>
    )
  }
).attrs(({ theme, iconColor }) => ({
  borderRadius: theme.borderRadius.radius,
  iconColor: iconColor ?? theme.designSystem.color.icon.subtle,
}))``

const Container = styled.View<{ borderRadius: number }>(({ borderRadius, theme }) => ({
  borderRadius,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
}))
