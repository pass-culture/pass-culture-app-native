import { plural } from '@lingui/macro'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { EndedBookingsSection } from 'features/bookings/pages/EndedBookingsSection'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Separator } from 'ui/components/Separator'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { NoBookingsView } from './NoBookingsView'
import { OnGoingBookingItem } from './OnGoingBookingItem'
import { Booking } from './types'

interface OnGoingBookingsListProps {
  bookings?: Booking[]
  endedBookings?: Booking[]
}

const emptyBookings: Booking[] = []

export function OnGoingBookingsList(props: OnGoingBookingsListProps) {
  const { bottom } = useSafeAreaInsets()

  const bookings = props.bookings || emptyBookings
  const onGoingBookingsCount = bookings.length
  const hasBookings = onGoingBookingsCount > 0
  const hasEndedBookings = (props.endedBookings || []).length > 0
  const bookingsCountLabel = plural(onGoingBookingsCount, {
    one: '# réservation en cours',
    other: '# réservations en cours',
  })

  const ListEmptyComponent = useCallback(() => <NoBookingsView />, [])
  const ListHeaderComponent = useCallback(
    () => (hasBookings ? <BookingsCount>{bookingsCountLabel}</BookingsCount> : null),
    [hasBookings, bookingsCountLabel]
  )
  const ListFooterComponent = useCallback(
    () => (
      <FooterContainer safeBottom={bottom}>
        <EndedBookingsSection endedBookings={props.endedBookings} />
      </FooterContainer>
    ),
    [hasBookings, bookingsCountLabel, props.endedBookings]
  )

  const logBookingsScrolledToBottom = useFunctionOnce(analytics.logBookingsScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logBookingsScrolledToBottom()
    }
  }

  return (
    <Container flex={hasBookings || hasEndedBookings ? 1 : undefined}>
      <FlatList
        testID="OnGoingBookingsList"
        keyExtractor={keyExtractor}
        data={bookings}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={Separator}
        scrollEnabled={hasBookings}
        onScroll={onScroll}
        scrollEventThrottle={400}
      />
    </Container>
  )
}

const keyExtractor = (item: Booking) => item.id.toString()

const renderItem: ListRenderItem<Booking> = ({ item }) => <OnGoingBookingItem booking={item} />

const contentContainerStyle = {
  flexGrow: 1,
  paddingHorizontal: getSpacing(4),
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(2),
}

const Container = styled.View<{ flex?: number }>(({ flex }) => ({
  flex,
  height: '100%',
}))

const BookingsCount = styled(Typo.Body).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  fontSize: 15,
  paddingTop: getSpacing(4),
  paddingBottom: getSpacing(2),
})

const FooterContainer = styled.View<{ safeBottom: number }>(({ safeBottom }) => ({
  marginBottom: safeBottom ? safeBottom / 2 : 0,
  paddingVertical: getSpacing(4),
}))
