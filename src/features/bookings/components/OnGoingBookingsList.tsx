import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import { i18n, _ } from 'libs/i18n'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { OnGoingBookingItem } from './OnGoingBookingItem'
import { Booking } from './types'

interface OnGoingBookingsListProps {
  bookings?: Booking[]
}

const emptyBookings: Booking[] = []

export function OnGoingBookingsList(props: OnGoingBookingsListProps) {
  const onGoingBookingsCount = props.bookings?.length || 0
  const bookingsCountLabel =
    `${onGoingBookingsCount}\u00a0` +
    i18n.plural({
      value: onGoingBookingsCount,
      one: 'réservation en cours',
      other: 'réservations en cours',
    })
  return (
    <FlatList
      keyExtractor={extractKey}
      data={props.bookings || emptyBookings}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={() => <BookingsCount>{bookingsCountLabel}</BookingsCount>}
    />
  )
}

const extractKey: ((item: Booking, index: number) => string) | undefined = (item) =>
  item.id.toString()

const renderItem: ListRenderItem<Booking> | null | undefined = ({ item }) => (
  <OnGoingBookingItem booking={item} />
)

const contentContainerStyle = { flexGrow: 1, paddingBottom: TAB_BAR_COMP_HEIGHT }

const BookingsCount = styled(Typo.Body).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  fontSize: 15,
  paddingVertical: getSpacing(2),
})
