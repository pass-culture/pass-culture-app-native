import React from 'react'
import { Dimensions, Text } from 'react-native'
import styled from 'styled-components/native'

import { Separator } from 'features/profile/components/reusables'
import { getSpacing, Typo } from 'ui/theme'

import { OnGoingTicket, onGoingTicketWidth } from './OnGoingTicket'
import { Booking } from './types'

interface OnGoingBookingItemProps {
  booking: Booking
}

export const OnGoingBookingItem = ({ booking }: OnGoingBookingItemProps) => {
  return (
    <React.Fragment>
      <ItemContainer>
        <OnGoingTicket image={booking.stock.offer.image?.url} />
        <AttributesView>
          <TitleContainer>
            <Title numberOfLines={2}>{booking.stock.offer.name}</Title>
          </TitleContainer>
          <Text>is Duo: {isDuo(booking).toString()}</Text>
          <Text>Begin: {booking.stock.beginningDatetime}</Text>
          <Text>Expire: {booking.expirationDate}</Text>
          <Text>is Permanent: {booking.stock.offer.isPermanent.toString()}</Text>
        </AttributesView>
      </ItemContainer>
      <Separator />
    </React.Fragment>
  )
}
const viewWidth = Dimensions.get('screen').width - onGoingTicketWidth - 40

const ItemContainer = styled.View({
  flexDirection: 'row',
  paddingVertical: getSpacing(4),
})

const AttributesView = styled.View({
  paddingLeft: 8,
  paddingRight: 4,
})

const TitleContainer = styled.View({
  flexDirection: 'row',
  width: viewWidth,
})

const Title = styled(Typo.ButtonText)({
  flexShrink: 1,
})

function isDuo(booking: Booking) {
  return booking.quantity === 2
}
