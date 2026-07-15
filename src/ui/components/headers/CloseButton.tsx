import React from 'react'
import { useTheme } from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close as DefaultClose } from 'ui/svg/icons/Close'

interface HeaderIconProps {
  hitSlop?: number
  onClose?: () => void
  color?: ColorsType
  size?: number | string
  accessibilityLabel?: string
}

export const CloseButton: React.FC<HeaderIconProps> = ({
  accessibilityLabel = 'Fermer',
  color,
  onClose,
  hitSlop = 8,
  size,
  ...props
}) => {
  const { designSystem } = useTheme()
  return (
    <StyledTouchable
      onPress={onClose}
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      {...props}>
      <DefaultClose testID="icon-close" color={color} size={size ?? designSystem.size.icon.m} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  justifyContent: 'center',
  alignItems: 'center',
})
