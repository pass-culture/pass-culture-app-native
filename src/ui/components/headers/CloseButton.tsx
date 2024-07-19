import React from 'react'
import { useTheme } from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface HeaderIconProps {
  hitSlop?: number
  onClose?: () => void
  color?: ColorsEnum
  size?: number | string
}

export const CloseButton: React.FC<HeaderIconProps> = ({
  color,
  onClose,
  hitSlop = 8,
  size,
  ...props
}) => {
  const theme = useTheme()
  return (
    <StyledTouchable onPress={onClose} accessibilityLabel="Fermer" hitSlop={hitSlop} {...props}>
      <DefaultClose testID="icon-close" color={color} size={size ?? theme.icons.sizes.small} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  justifyContent: 'center',
  alignItems: 'center',
})
