import React, { FunctionComponent } from 'react'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo, getSpacing } from 'ui/theme'

export interface HeaderIconProps {
  onClose?: () => void
}

export const CancelButton: FunctionComponent<HeaderIconProps> = ({ onClose }) => {
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
