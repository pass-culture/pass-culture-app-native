import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
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
  const bookingsCountLabel =
    `${onGoingBookingsCount}\u00a0` + getBookingsCountLabel(onGoingBookingsCount > 1)

  const endedBookings = props?.endedBookings || emptyBookings
  const endedBookingsLabel = getEndedBookingsCountLabel(endedBookings.length > 1)

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

  return (
    <Container flex={hasBookings ? 1 : undefined}>
      <FlatList
        keyExtractor={extractKey}
        data={bookings}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        scrollEnabled={hasBookings}
      />
    </Container>
  )
}

const getBookingsCountLabel = (plural: boolean) =>
  plural ? _(t`réservations en cours`) : _(t`réservation en cours`)

const getEndedBookingsCountLabel = (plural: boolean) =>
  plural ? _(t`Réservations terminées`) : _(t`Réservation terminée`)

const Container = styled.View<{ flex?: number }>(({ flex }) => ({
  flex,
  height: '100%',
}))

const extractKey: ((item: Booking, index: number) => string) | undefined = (item) =>
  item.id.toString()

const renderItem: ListRenderItem<Booking> | null | undefined = ({ item }) => (
  <OnGoingBookingItem booking={item} />
)

const contentContainerStyle = {
  flexGrow: 1,
  paddingHorizontal: getSpacing(4),
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(2),
}

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
