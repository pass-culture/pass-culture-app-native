import React, { FunctionComponent } from 'react'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo, getSpacing } from 'ui/theme'

interface HeaderIconProps {
  wording: 'Fermer' | 'Quitter' | 'Annuler'
  onClose: () => void
}

export const RightButtonText: FunctionComponent<HeaderIconProps> = ({ onClose, wording }) => {
  return (
    <StyledTouchable onPress={onClose}>
      <Typo.BodyAccentXs>{wording}</Typo.BodyAccentXs>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  height: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})
