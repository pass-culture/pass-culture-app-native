import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import { OnGoingBookingItem } from './OnGoingBookingItem'
import { Booking } from './types'

interface OnGoingBookingsListProps {
  bookings?: Booking[]
}

const emptyBookings: Booking[] = []

export function OnGoingBookingsList(props: OnGoingBookingsListProps) {
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
  <OnGoingBookingItem booking={item} />
)
