import React, { useState, useRef, ReactElement } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BookingDetailsTicketContentProps } from 'features/bookings/components/BookingDetailsTicketContent'
import { getTickets, TicketsProps } from 'features/bookings/components/Ticket/getTickets'
import { TicketSwiperControls } from 'features/bookings/components/Ticket/TicketSwiperControls'
import { getSpacing, Spacer } from 'ui/theme'

const SEPARATOR_VALUE = 4
const INTERVAL = getSpacing(SEPARATOR_VALUE)

const keyExtractor = (item: ReactElement<TicketsProps>, index: number) =>
  `${item.props.booking.stock.offer.name}-${index}`

export function TicketSwiper({ booking }: TicketsProps) {
  const { isTouch, appContentWidth, ticket } = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const { tickets } = getTickets({ booking })
  const [currentIndex, setCurrentIndex] = useState(1)

  const NUMBER_OF_TICKETS = tickets.length ?? 0
  const TICKET_WIDTH = isTouch ? appContentWidth * ticket.sizeRatio : ticket.maxWidth
  const TICKET_SPACING = (appContentWidth - TICKET_WIDTH) / 2
  const TOTAL_TICKETS_WIDTH = TICKET_WIDTH * NUMBER_OF_TICKETS
  const APP_COMPONENT_WIDTH_WITH_MARGIN = appContentWidth * 0.9

  const renderItem: ListRenderItem<ReactElement<BookingDetailsTicketContentProps>> = ({ item }) => (
    <TicketsContainer key={item.key} width={TICKET_WIDTH}>
      {item}
    </TicketsContainer>
  )

  const nextItemPosition = (TICKET_WIDTH + INTERVAL) * currentIndex
  const prevItemPosition = nextItemPosition - TICKET_SPACING + INTERVAL - TICKET_WIDTH * 2
  const moveTo = (direction: 'prev' | 'next') => {
    if (flatListRef.current) {
      if (direction === 'prev') {
        flatListRef.current.scrollToOffset({
          offset: prevItemPosition,
          animated: true,
        })
      } else {
        flatListRef.current.scrollToOffset({
          offset: nextItemPosition,
          animated: true,
        })
      }
    }
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x
    const xPosWithSpacing = xPos + TICKET_SPACING
    const index = Math.floor(xPosWithSpacing / TICKET_WIDTH) + 1
    setCurrentIndex(index)
  }

  const displaySideBySideTickets = APP_COMPONENT_WIDTH_WITH_MARGIN > TOTAL_TICKETS_WIDTH
  const showControls = !displaySideBySideTickets && NUMBER_OF_TICKETS > 1
  const contentContainerStyle: StyleProp<ViewStyle> = {
    paddingHorizontal: TICKET_SPACING,
    ...(displaySideBySideTickets ? { flex: 1, justifyContent: 'center' } : {}),
  }

  return (
    <React.Fragment>
      <FlatList
        ref={flatListRef}
        data={tickets}
        keyExtractor={keyExtractor}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={TICKET_WIDTH + INTERVAL}
        decelerationRate="fast"
        ItemSeparatorComponent={Separator}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        renderItem={renderItem}
        scrollEnabled={isTouch}
      />
      {!!showControls && (
        <SwiperTicketsControlsContainer>
          <TicketSwiperControls
            numberOfSteps={NUMBER_OF_TICKETS}
            currentStep={currentIndex}
            prevTitle="Revenir au ticket précédent"
            nextTitle="Voir le ticket suivant"
            onPressPrev={() => moveTo('prev')}
            onPressNext={() => moveTo('next')}
          />
        </SwiperTicketsControlsContainer>
      )}
    </React.Fragment>
  )
}

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingVertical: getSpacing(2),
  width,
}))

const SwiperTicketsControlsContainer = styled.View({
  alignItems: 'center',
})

const Separator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} />
