import React from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'

interface Props {
  externalNav: ExternalNavigationProps['externalNav']
  onPress?: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <Container>
      <TouchableLink
        as={ButtonTertiaryBlack}
        inline
        externalNav={props.externalNav}
        wording="Voir l’itinéraire"
        onBeforeNavigate={props.onPress}
        icon={Icon}
      />
    </Container>
  )
}

const Icon = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  accessibilityLabel: 'Nouvelle fenêtre',
}))``

const Container = styled.View({
  alignItems: 'flex-start',
})
