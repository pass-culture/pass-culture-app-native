import React, { FunctionComponent } from 'react'

import { styledButton } from 'ui/components/buttons/styledButton'
import { HeaderIconProps } from 'ui/components/headers/CancelButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo, getSpacing } from 'ui/theme'

export const CloseButtonText: FunctionComponent<HeaderIconProps> = ({ onClose }) => {
  return (
    <StyledTouchable onPress={onClose}>
      <Typo.Caption>Fermer</Typo.Caption>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  height: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})
