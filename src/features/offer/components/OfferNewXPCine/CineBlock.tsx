import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { OfferEventCardList } from 'features/offer/components/OfferEventCardList/OfferEventCardList'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
  selectedDate: Date
  distance?: string
  onSeeVenuePress?: VoidFunction
}
export const CineBlock: FunctionComponent<Props> = ({
  offer,
  distance,
  onSeeVenuePress,
  selectedDate,
}) => {
  return (
    <CineBlockContainer>
      <Spacer.Column numberOfSpaces={6} />
      <VenueBlock distance={distance} offer={offer} onSeeVenuePress={onSeeVenuePress} />
      <Spacer.Column numberOfSpaces={4} />
      <OfferEventCardList offer={offer} selectedDate={selectedDate} />
    </CineBlockContainer>
  )
}

const CineBlockContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
