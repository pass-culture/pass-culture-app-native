import React from 'react'
import styled from 'styled-components/native'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { Ticket } from 'features/bookings/components/SwiperTickets/Ticket'

const activationCodeFeatureEnabled = true
const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]

export function SwipperTicketPageTest() {
  return (
    <Container>
      <Ticket booking={booking} activationCodeFeatureEnabled={activationCodeFeatureEnabled} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
