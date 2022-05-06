import React from 'react'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { Ticket } from 'features/bookings/components/SwiperTickets/Ticket'
import { Spacer } from 'ui/theme'

const activationCodeFeatureEnabled = true
const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]

export function SwipperTicketPageTest() {
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={5} />
      <Ticket booking={booking} activationCodeFeatureEnabled={activationCodeFeatureEnabled} />
      <Spacer.Column numberOfSpaces={5} />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}
