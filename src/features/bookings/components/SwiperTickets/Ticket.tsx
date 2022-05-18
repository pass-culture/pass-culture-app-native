import { t } from '@lingui/macro'
import React, { useState, useRef, ReactElement } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BookingDetailsTicketContentProps } from 'features/bookings/components/BookingDetailsTicketContent'
import {
  getMultipleTickets,
  TicketsProps,
} from 'features/bookings/components/SwiperTickets/getMultipleTickets'
import { SwiperTicketsControls } from 'features/bookings/components/SwiperTickets/SwiperTicketsControls'
import { getSpacing, Spacer } from 'ui/theme'

const SEPARATOR_VALUE = 4
const INTERVAL = getSpacing(SEPARATOR_VALUE)
const TICKET_SIZE_RATIO = 0.755 // 0.05 is a hack to fit header and footer ThreeShapesTicket shadow

const keyExtractor = (item: ReactElement<TicketsProps>, index: number) =>
  `${item.props.booking.stock.offer.name}-${index}`

export function Ticket({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  const flatListRef = useRef<FlatList>(null)
  const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
  const { appContentWidth } = useTheme()

  const NUMBER_OF_TICKETS = booking.externalBookings?.length ?? 0
  const TICKET_WIDTH = appContentWidth * TICKET_SIZE_RATIO
  const TICKET_SPACING = (appContentWidth - TICKET_WIDTH) / 2

  const [currentIndex, setCurrentIndex] = useState(1)

  const renderItem: ListRenderItem<ReactElement<BookingDetailsTicketContentProps>> = ({
    item: ticket,
  }) => (
    <TicketsContainer key={ticket.key} width={TICKET_WIDTH}>
      {ticket}
    </TicketsContainer>
  )

  const TOTAL_ITEM_SIZE_WITH_INTERVAL = (TICKET_WIDTH + INTERVAL) * currentIndex

  const nextItemPosition = TOTAL_ITEM_SIZE_WITH_INTERVAL
  const prevItemPosition =
    TOTAL_ITEM_SIZE_WITH_INTERVAL - TICKET_SPACING + INTERVAL - TICKET_WIDTH * 2
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

  const showControls = NUMBER_OF_TICKETS > 1

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
        contentContainerStyle={{ paddingHorizontal: TICKET_SPACING }}
        onScroll={onScroll}
        renderItem={renderItem}
      />
      {!!showControls && (
        <SwiperTicketsControlsContainer>
          <SwiperTicketsControls
            numberOfSteps={NUMBER_OF_TICKETS}
            currentStep={currentIndex}
            prevTitle={t`Revenir au ticket précédent`}
            nextTitle={t`Voir le ticket suivant`}
            onPressPrev={() => moveTo('prev')}
            onPressNext={() => moveTo('next')}
          />
        </SwiperTicketsControlsContainer>
      )}
    </React.Fragment>
  )
}

const SwiperTicketsControlsContainer = styled.View({
  alignItems: 'center',
})

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  width,
  paddingVertical: getSpacing(2),
}))

const Separator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} />
