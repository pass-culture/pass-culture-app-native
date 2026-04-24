import React, { useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { QrCodeWithSeat } from 'features/bookings/components/Ticket/QrCodeWithSeat/QrCodeWithSeat'
import { TicketSwiperControls } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/TicketSwiperControls'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { getSpacing } from 'ui/theme'

const SEPARATOR_VALUE = 0
const INTERVAL = getSpacing(SEPARATOR_VALUE)
const MAX_TICKETS_COUNT_ON_SCREEN = 2

const renderTicket = ({ seat, barcode }: ExternalBookingDataResponseV2) => {
  return (
    <React.Fragment key={barcode}>
      <QrCodeWithSeat seat={seat || undefined} barcode={barcode} />
      <TicketText>{`RÉF ${barcode}`}</TicketText>
    </React.Fragment>
  )
}

type TicketSwiperProps = {
  data?: ExternalBookingDataResponseV2[]
}

export const TicketSwiper = ({ data }: TicketSwiperProps) => {
  const { isTouch, appContentWidth, ticket } = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(1)

  const NUMBER_OF_TICKETS = data?.length ?? 0
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

  return data?.length === 1 && data[0] ? (
    renderTicket(data[0])
  ) : (
    <React.Fragment>
      <FlatList
        ref={flatListRef}
        data={(data || []).slice(0, MAX_TICKETS_COUNT_ON_SCREEN).map(renderTicket)}
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

const TicketsContainer = styled.View<{ width: number }>(({ width, theme }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingTop: theme.designSystem.size.spacing.s,
  paddingBottom: theme.designSystem.size.spacing.xl,
  width,
}))

const SwiperTicketsControlsContainer = styled.View({
  alignItems: 'center',
})
