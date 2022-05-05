import React from 'react'

import { TicketsProps } from 'features/bookings/components/SwiperTickets/getMultipleTickets'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'

export function Ticket({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  return booking.externalBookingsInfos ? (
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
  )
}
