import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

interface HeaderIconProps {
  hitSlop?: number
  onClose?: () => void
  color?: ColorsEnum
}

export const CloseButton: React.FC<HeaderIconProps> = ({
  color,
  onClose,
  hitSlop = 8,
  ...props
}) => {
  return (
    <StyledTouchable onPress={onClose} accessibilityLabel="Fermer" hitSlop={hitSlop} {...props}>
      <Close testID="icon-close" color={color} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  justifyContent: 'center',
  alignItems: 'center',
})

const Close = styled(DefaultClose).attrs<{ color: ColorsEnum }>(({ theme, color }) => ({
  color: color ?? theme.colors.white,
  size: theme.icons.sizes.small,
}))``
