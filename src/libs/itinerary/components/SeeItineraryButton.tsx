import React from 'react'
import styled from 'styled-components/native'

import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'

interface Props {
  externalNav: ExternalNavigationProps['externalNav']
  onPress?: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <ButtonContainerFlexStart>
      <ExternalTouchableLink
        as={Button}
        externalNav={props.externalNav}
        wording="Voir l’itinéraire"
        onBeforeNavigate={props.onPress}
        icon={Icon}
        variant="tertiary"
        color="neutral"
      />
    </ButtonContainerFlexStart>
  )
}

const Icon = styled(LocationPointer).attrs({
  accessibilityLabel: 'Nouvelle fenêtre',
})``
