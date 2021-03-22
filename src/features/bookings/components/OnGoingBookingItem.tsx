import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

import { Booking } from './types'

interface OnGoingBookingItemProps {
  booking: Booking
}

export const OnGoingBookingItem = ({ booking }: OnGoingBookingItemProps) => {
  return (
    <ItemContainer>
      <Typo.ButtonText>{booking.stock.offer.name}</Typo.ButtonText>
      <Typo.ButtonText>{booking.stock.offer.image?.url}</Typo.ButtonText>
      <Text>is Duo: {isDuo(booking).toString()}</Text>
      <Text>Begin: {booking.stock.beginningDatetime}</Text>
      <Text>Expire: {booking.expirationDate}</Text>
      <Text>is Permanent: {booking.stock.offer.isPermanent.toString()}</Text>
    </ItemContainer>
  )
}

const ItemContainer = styled.View({
  paddingVertical: getSpacing(4),
})

function isDuo(booking: Booking) {
  return booking.quantity === 2
}
