import { t } from '@lingui/macro'
import React, { useState, useRef, ReactElement } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native'
import styled from 'styled-components/native'

import { BookingDetailsTicketContentProps } from 'features/bookings/components/BookingDetailsTicketContent'
import {
  getMultipleTickets,
  TicketsProps,
} from 'features/bookings/components/SwiperTickets/getMultipleTickets'
import { SwiperTicketsControls } from 'features/bookings/components/SwiperTickets/SwiperTicketsControls'
import { getSpacing, Spacer } from 'ui/theme'

const SEPARATOR_VALUE = 4
const INTERVAL = getSpacing(SEPARATOR_VALUE)

const keyExtractor = (item: ReactElement<TicketsProps>, index: number) =>
  `${item.props.booking.stock.offer.name}-${index}`

export function SwiperTickets({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  const flatListRef = useRef<FlatList>(null)
  const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
  const windowWidth = useWindowDimensions().width

  const NUMBER_OF_TICKETS = booking.externalBookingsInfos?.length ?? 0
  const ITEM_SIZE = windowWidth * 0.75
  const ITEM_SPACING = (windowWidth - ITEM_SIZE) / 2

  const [currentIndex, setCurrentIndex] = useState(1)

  const renderItem: ListRenderItem<ReactElement<BookingDetailsTicketContentProps>> = ({
    item: ticket,
  }) => (
    <TicketsContainer key={ticket.key} width={ITEM_SIZE}>
      {ticket}
    </TicketsContainer>
  )

  const TOTAL_ITEM_SIZE_WITH_INTERVAL = (ITEM_SIZE + INTERVAL) * currentIndex

  const showControls = NUMBER_OF_TICKETS > 1

  const nextItemPosition = TOTAL_ITEM_SIZE_WITH_INTERVAL
  const prevItemPosition = TOTAL_ITEM_SIZE_WITH_INTERVAL - ITEM_SPACING + INTERVAL - ITEM_SIZE * 2
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
    const xPosWithSpacing = xPos + ITEM_SPACING
    const index = Math.floor(xPosWithSpacing / ITEM_SIZE) + 1
    setCurrentIndex(index)
  }

  return (
    <Container>
      <FlatList
        ref={flatListRef}
        data={tickets[0]}
        keyExtractor={keyExtractor}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE + INTERVAL}
        decelerationRate="fast"
        // TODO(LucasBeneston): remove this eslint disabled
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flexGrow: 0 }}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={onScroll}
        renderItem={renderItem}
      />
      {!!showControls && (
        <SwiperTicketsControls
          numberOfSteps={NUMBER_OF_TICKETS}
          currentStep={currentIndex}
          prevTitle={t`Revenir au ticket précédent`}
          nextTitle={t`Voir le ticket suivant`}
          onPressPrev={() => moveTo('prev')}
          onPressNext={() => moveTo('next')}
        />
      )}
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'flex-end',
  width,
}))

const Separator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} />
