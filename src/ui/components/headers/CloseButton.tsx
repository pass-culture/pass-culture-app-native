import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface HeaderIconProps {
  onClose?: () => void
  color?: ColorsEnum
}

export const CloseButton: React.FC<HeaderIconProps> = ({ color, onClose }) => {
  return (
    <StyledTouchable onPress={onClose} accessibilityLabel="Fermer">
      <Close testID="icon-close" color={color} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  flexGrow: 1,
  maxWidth: getSpacing(10),
  height: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})

const Close = styled(DefaultClose).attrs<{ color: ColorsEnum }>(({ theme, color }) => ({
  color: color ?? theme.colors.white,
  size: theme.icons.sizes.small,
}))``
