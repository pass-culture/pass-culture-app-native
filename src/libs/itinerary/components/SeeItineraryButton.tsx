import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Spacer } from 'ui/components/spacer/Spacer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo, ColorsEnum } from 'ui/theme'

interface Props {
  openItinerary: () => void
}

export function SeeItineraryButton(props: Props) {
  return (
    <TouchableContainer onPress={props.openItinerary}>
      <LocationPointer color={ColorsEnum.BLACK} size={24} />
      <Spacer.Row numberOfSpaces={1} />
      <Typo.ButtonText>{t`Voir l'itinéraire`}</Typo.ButtonText>
    </TouchableContainer>
  )
}

const TouchableContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
})
