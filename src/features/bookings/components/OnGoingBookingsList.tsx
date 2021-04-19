import { plural } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { Badge } from 'ui/components/Badge'
import { SectionRow } from 'ui/components/SectionRow'
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
  const { navigate } = useNavigation<UseNavigationType>()

  const { bottom } = useSafeAreaInsets()

  const bookings = props.bookings || emptyBookings
  const onGoingBookingsCount = bookings.length
  const hasBookings = onGoingBookingsCount > 0
  const bookingsCountLabel = plural(onGoingBookingsCount, {
    one: '# réservation en cours',
    other: '# réservations en cours',
  })

  const endedBookings = props?.endedBookings || emptyBookings
  const endedBookingsLabel = plural(endedBookings.length, {
    one: 'Réservation terminée',
    other: 'Réservations terminées',
  })

  const ListEmptyComponent = useCallback(() => <NoBookingsView />, [])
  const ListHeaderComponent = useCallback(
    () => (hasBookings ? <BookingsCount>{bookingsCountLabel}</BookingsCount> : null),
    [hasBookings, bookingsCountLabel]
  )
  const ListFooterComponent = useCallback(
    () =>
      endedBookings.length > 0 ? (
        <EndedBookingsSection safeBottom={bottom}>
          <View>
            <SectionRow
              type="navigable"
              title={endedBookingsLabel}
              icon={() => <Badge label={endedBookings.length} />}
              onPress={() => navigate('EndedBookings')}
              testID="row-ended-bookings"
            />
          </View>
        </EndedBookingsSection>
      ) : (
        <React.Fragment />
      ),
    [endedBookings, bottom, endedBookingsLabel]
  )

  const logBookingsScrolledToBottom = useFunctionOnce(analytics.logBookingsScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logBookingsScrolledToBottom()
    }
  }

  return (
    <Container flex={hasBookings ? 1 : undefined}>
      <FlatList
        testID="OnGoingBookingsList"
        keyExtractor={keyExtractor}
        data={bookings}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
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

const EndedBookingsSection = styled.View<{ safeBottom: number }>(({ safeBottom }) => ({
  width: '100%',
  marginBottom: safeBottom ? safeBottom / 2 : 0,
  justifyContent: 'center',
  paddingVertical: getSpacing(4),
}))
