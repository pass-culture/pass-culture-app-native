import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'

interface Props {
  externalHref?: string
  openItinerary: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <Container>
      <ButtonTertiaryBlack
        inline
        externalHref={props.externalHref}
        wording={t`Voir l'itinéraire`}
        onPress={props.openItinerary}
        icon={Icon}
      />
    </Container>
  )
}

const Icon = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  accessibilityLabel: t`Nouvelle fenêtre`,
}))``

const Container = styled.View({
  alignItems: 'flex-start',
})
