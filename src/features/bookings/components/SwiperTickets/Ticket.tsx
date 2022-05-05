import React from 'react'

import { TicketsProps } from 'features/bookings/components/SwiperTickets/getMultipleTickets'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'

export function Ticket({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  const ticketsWithExternalBookingsInfos =
    booking.externalBookingsInfos?.length === 1 ? (
      <TicketWithContent
        booking={booking}
        activationCodeFeatureEnabled={activationCodeFeatureEnabled}
        externalBookingsInfos={booking.externalBookingsInfos[0]}
        testID="single-ticket-with-one-external-bookings-information"
      />
    ) : (
      <SwiperTickets
        booking={booking}
        activationCodeFeatureEnabled={activationCodeFeatureEnabled}
      />
    )

  return booking.externalBookingsInfos ? (
    ticketsWithExternalBookingsInfos
  ) : (
    <TicketWithContent
      booking={booking}
      activationCodeFeatureEnabled={activationCodeFeatureEnabled}
      testID="single-ticket-without-external-bookings-information"
    />
  )
}
