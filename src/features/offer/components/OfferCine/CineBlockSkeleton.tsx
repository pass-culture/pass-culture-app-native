import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferEventCardListSkeleton } from 'features/offer/components/OfferEventCardList/OfferEventCardListSkeleton'
import { VenueBlockSkeleton } from 'features/offer/components/OfferVenueBlock/VenueBlockSkeleton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const CineBlockSkeleton: FunctionComponent = () => {
  return (
    <CineBlockContainer testID="cine-block-skeleton" gap={4}>
      <VenueBlockSkeleton />
      <OfferEventCardListSkeleton />
    </CineBlockContainer>
  )
}

const CineBlockContainer = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginTop: theme.designSystem.size.spacing.xl,
}))
