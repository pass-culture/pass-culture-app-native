import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { ArrowUp } from 'ui/svg/icons/ArrowUp'

type Props = {
  expanded: boolean
  onPress: VoidFunction
}

export const CollapsibleTextButton: FunctionComponent<Props> = ({ expanded, onPress }) => {
  const buttonText = expanded ? 'Voir moins' : 'Voir plus'
  const icon = expanded ? ArrowUp : ArrowDown

  return (
    <ButtonContainer>
      <ButtonTertiaryBlack
        wording={buttonText}
        onPress={onPress}
        icon={icon}
        buttonHeight="extraSmall"
        inline
      />
    </ButtonContainer>
  )
}

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})
