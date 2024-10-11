import React from 'react'
import { FlatList, View } from 'react-native'
import styled from 'styled-components/native'

import { EVENT_CARD_HEIGHT, EVENT_CARD_WIDTH } from 'ui/components/eventCard/EventCard'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { Spacer } from 'ui/theme'

export const OfferEventCardListSkeleton: React.FC = () => {
  return (
    <Container testID="offer-event-card-list-skeleton-container">
      <ScrollViewContainer horizontal showsHorizontalScrollIndicator={false}>
        <FlatList
          data={[...Array(2)]}
          renderItem={({ index }) => (
            <React.Fragment key={`event-card-skeleton-${index}`}>
              <View>
                <SkeletonTile
                  width={EVENT_CARD_WIDTH}
                  height={EVENT_CARD_HEIGHT}
                  borderRadius={8}
                />
              </View>
              {index < 2 ? <Spacer.Row numberOfSpaces={4} /> : null}
            </React.Fragment>
          )}
        />
      </ScrollViewContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const ScrollViewContainer = styled.ScrollView({
  flexDirection: 'row',
})
