import { t } from '@lingui/macro'
import React, { useState, useRef } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { SwipperTicketsControls } from 'features/bookings/components/SwipperTicketsControls'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  booking: BookingReponse[]
  activationCodeFeatureEnabled?: boolean
}

const SEPARATOR_VALUE = 4
const INTERVAL = getSpacing(SEPARATOR_VALUE)

const keyExtractor = (index: BookingReponse) => index.id.toString()

export function SwipperTickets({ booking, activationCodeFeatureEnabled }: Props) {
  const flatListRef = useRef<FlatList>(null)

  const windowWidth = useWindowDimensions().width
  const ITEM_SIZE = windowWidth * 0.75
  const ITEM_SPACING = (windowWidth - ITEM_SIZE) / 2

  const [currentIndex, setCurrentIndex] = useState(1)

  const renderItem: ListRenderItem<BookingReponse> = ({ item }) => {
    return (
      <TicketsContainer key={item.id} width={ITEM_SIZE}>
        <ThreeShapesTicket>
          <BookingDetailsTicketContent
            booking={item}
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
          />
        </ThreeShapesTicket>
      </TicketsContainer>
    )
  }

  const currentIndexTotalItemSize = ITEM_SIZE * currentIndex
  const currentIndexTotalInterval = INTERVAL * currentIndex

  const nextItemPosition = currentIndexTotalItemSize + currentIndexTotalInterval
  const moveToNextTicket = () => {
    if (flatListRef.current)
      return flatListRef.current.scrollToOffset({
        offset: nextItemPosition,
        animated: true,
      })
  }

  const prevItemPosition = nextItemPosition - ITEM_SPACING + INTERVAL - ITEM_SIZE * 2
  const moveToPrevTicket = () => {
    if (flatListRef.current)
      return flatListRef.current.scrollToOffset({
        offset: prevItemPosition,
        animated: true,
      })
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x
    const xPosWithSpacing = xPos + ITEM_SPACING
    const index = Math.floor(xPosWithSpacing / ITEM_SIZE) + 1
    setCurrentIndex(index)
  }

  return (
    <Container>
      <FlatList
        ref={flatListRef}
        data={booking}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE + INTERVAL}
        decelerationRate="fast"
        style={{ flexGrow: 0 }}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={onScroll}
        renderItem={renderItem}
      />
      <Spacer.Column numberOfSpaces={5} />
      <SwipperTicketsControls
        numberOfSteps={booking.length}
        currentStep={currentIndex}
        prevTitle={t`Revenir au ticket précédent`}
        nextTitle={t`Voir le ticket suivant`}
        onPressPrev={moveToPrevTicket}
        onPressNext={moveToNextTicket}
      />
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width,
}))

const Separator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} />
