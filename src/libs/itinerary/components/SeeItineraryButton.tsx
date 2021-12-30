import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { ColorsEnum } from 'ui/theme'

interface Props {
  openItinerary: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <Container>
      <ButtonTertiaryBlack
        inline
        title={t`Voir l'itinéraire`}
        onPress={props.openItinerary}
        icon={icon}
      />
    </Container>
  )
}

const icon = () => <LocationPointer color={ColorsEnum.BLACK} size={20} />

const Container = styled.View({
  alignItems: 'flex-start',
})
