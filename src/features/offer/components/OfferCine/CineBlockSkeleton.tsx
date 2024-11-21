import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { OfferEventCardListSkeleton } from 'features/offer/components/OfferEventCardList/OfferEventCardListSkeleton'
import { VenueBlockSkeleton } from 'features/offer/components/OfferVenueBlock/VenueBlockSkeleton'
import { Spacer } from 'ui/theme'

export const CineBlockSkeleton: FunctionComponent = () => {
  return (
    <FlatList
      testID="cine-block-skeleton"
      data={Array.from({ length: 3 })}
      renderItem={() => (
        <CineBlockContainer>
          <Spacer.Column numberOfSpaces={6} />
          <VenueBlockSkeleton />
          <Spacer.Column numberOfSpaces={4} />
          <OfferEventCardListSkeleton />
        </CineBlockContainer>
      )}
    />
  )
}

const CineBlockContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
