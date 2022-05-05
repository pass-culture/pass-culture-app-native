import React from 'react'
import styled from 'styled-components/native'

import { bookingsSnapDouble } from 'features/bookings/api/bookingsSnapDouble'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'

const activationCodeFeatureEnabled = true
const booking = bookingsSnapDouble.ongoing_bookings[0]

export function SwipperTicketPageTest() {
  return (
    <Container>
      {booking.externalBookingsInfos ? (
        booking.externalBookingsInfos.length === 1 ? (
          <TicketWithContent
            booking={booking}
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
            externalBookingsInfos={booking.externalBookingsInfos[0]}
          />
        ) : (
          <SwiperTickets
            booking={booking}
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
          />
        )
      ) : (
        <TicketWithContent
          booking={booking}
          activationCodeFeatureEnabled={activationCodeFeatureEnabled}
        />
      )}
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
