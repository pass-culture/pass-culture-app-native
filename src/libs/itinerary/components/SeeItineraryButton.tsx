import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'

interface Props {
  openItinerary: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <Container>
      <ButtonTertiaryBlack
        inline
        wording={t`Voir l'itinéraire`}
        onPress={props.openItinerary}
        icon={Icon}
      />
    </Container>
  )
}

const Icon = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
}))``

const Container = styled.View({
  alignItems: 'flex-start',
})
