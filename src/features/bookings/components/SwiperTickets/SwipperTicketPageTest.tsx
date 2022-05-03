import React from 'react'
import styled from 'styled-components/native'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'

const activationCodeFeatureEnabled = true
const booking = [
  bookingsSnap.ongoing_bookings[1],
  bookingsSnap.ongoing_bookings[1],
  bookingsSnap.ongoing_bookings[1],
  bookingsSnap.ongoing_bookings[1],
]

export function SwipperTicketPageTest() {
  return (
    <Container>
      <SwiperTickets
        booking={booking}
        activationCodeFeatureEnabled={activationCodeFeatureEnabled}
      />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
