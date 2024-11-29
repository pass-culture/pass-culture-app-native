import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferEventCardListSkeleton } from 'features/offer/components/OfferEventCardList/OfferEventCardListSkeleton'
import { VenueBlockSkeleton } from 'features/offer/components/OfferVenueBlock/VenueBlockSkeleton'
import { Spacer } from 'ui/theme'

export const CineBlockSkeleton: FunctionComponent = () => {
  return (
    <CineBlockContainer testID="cine-block-skeleton">
      <Spacer.Column numberOfSpaces={6} />
      <VenueBlockSkeleton />
      <Spacer.Column numberOfSpaces={4} />
      <OfferEventCardListSkeleton />
    </CineBlockContainer>
  )
}

const CineBlockContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
