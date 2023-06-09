import React from 'react'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo, getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports

export interface HeaderIconProps {
  onClose?: () => void
}

export const CancelButton: React.FC<HeaderIconProps> = ({ onClose }) => {
  return (
    <StyledTouchable onPress={onClose}>
      <Typo.Caption>Annuler</Typo.Caption>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  height: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})
