import React, { useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { QrCodeWithSeat } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import {
  getTickets,
  TicketsProps,
} from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/getTickets'
import { TicketSwiperControls } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/TicketSwiperControls'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { getSpacing } from 'ui/theme'

const SEPARATOR_VALUE = 0
const INTERVAL = getSpacing(SEPARATOR_VALUE)

export const TicketSwiper = ({ data }: TicketsProps) => {
  const { isTouch, appContentWidth, ticket } = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const { tickets } = getTickets({ data })
  const [currentIndex, setCurrentIndex] = useState(1)

  const NUMBER_OF_TICKETS = tickets.length ?? 0
  const TICKET_WIDTH = isTouch ? appContentWidth * ticket.sizeRatio : ticket.maxWidth
  const TICKET_SPACING = (appContentWidth - TICKET_WIDTH) / 2

  const renderItem = ({ item }) => (
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

  const displaySideBySideTickets = false
  const showControls = !displaySideBySideTickets && NUMBER_OF_TICKETS > 1
  const contentContainerStyle: StyleProp<ViewStyle> = {
    ...(displaySideBySideTickets ? { flex: 1, justifyContent: 'center' } : {}),
  }

  return data && data.length === 1 && data[0] ? (
    <React.Fragment key={data[0].barcode}>
      <QrCodeWithSeat seat={data[0].seat ?? undefined} barcode={data[0].barcode} />
      <TicketText>{`RÉF ${data[0].barcode}`}</TicketText>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <FlatList
        ref={flatListRef}
        data={tickets}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={TICKET_WIDTH + INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        renderItem={renderItem}
        scrollEnabled
      />
      {showControls ? (
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
      ) : null}
    </React.Fragment>
  )
}

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingTop: getSpacing(2),
  paddingBottom: getSpacing(6),
  width,
}))

const SwiperTicketsControlsContainer = styled.View({
  alignItems: 'center',
})
