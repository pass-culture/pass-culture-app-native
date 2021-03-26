import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import { EndedBookingItem } from './EndedBookingItem'
import { Booking } from './types'

interface EndedBookingsListProps {
  bookings?: Booking[]
}

const emptyBookings: Booking[] = []

export function EndedBookingsList(props: EndedBookingsListProps) {
  return (
    <FlatList
      keyExtractor={extractKey}
      data={props.bookings || emptyBookings}
      renderItem={renderItem}
    />
  )
}

const extractKey: ((item: Booking, index: number) => string) | undefined = (item) =>
  item.id.toString()

const renderItem: ListRenderItem<Booking> | null | undefined = ({ item }) => (
  <EndedBookingItem booking={item} />
)
