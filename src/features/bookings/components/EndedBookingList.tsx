import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing } from 'ui/theme'

import { EndedBookingItem } from './EndedBookingItem'
import { Booking } from './types'

interface EndedBookingsListProps {
  bookings?: Booking[]
}

const emptyBookings: Booking[] = []

export function EndedBookingsList(props: EndedBookingsListProps) {
  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={props.bookings || emptyBookings}
      ItemSeparatorComponent={StyledSeparator}
      keyExtractor={extractKey}
      renderItem={renderItem}
    />
  )
}

const contentContainerStyle = { paddingHorizontal: getSpacing(5) }

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(4),
})

const extractKey: ((item: Booking, index: number) => string) | undefined = (item) =>
  item.id.toString()

const renderItem: ListRenderItem<Booking> | null | undefined = ({ item }) => (
  <EndedBookingItem booking={item} />
)
