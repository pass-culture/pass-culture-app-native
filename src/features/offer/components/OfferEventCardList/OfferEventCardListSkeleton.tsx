import React from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { EVENT_CARD_HEIGHT, EVENT_CARD_WIDTH } from 'ui/components/eventCard/EventCard'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'

export const OfferEventCardListSkeleton: React.FC = () => {
  const { designSystem } = useTheme()
  return (
    <Container testID="offer-event-card-list-skeleton-container">
      <ScrollViewContainer horizontal showsHorizontalScrollIndicator={false}>
        <FlatList
          data={Array.from({ length: 2 })}
          renderItem={({ index }) => (
            <SkeletonWrapper key={`event-card-skeleton-${index}`} index={index}>
              <SkeletonTile
                width={EVENT_CARD_WIDTH}
                height={EVENT_CARD_HEIGHT}
                borderRadius={designSystem.size.borderRadius.m}
              />
            </SkeletonWrapper>
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

const SkeletonWrapper = styled.View<{ index: number }>(({ theme, index }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
  marginRight: index < 2 ? theme.designSystem.size.spacing.l : 0,
}))
