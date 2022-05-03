import React from 'react'

import { BookingReponseBis } from 'features/bookings/api/bookingsSnapDouble'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'

export type TicketsProps = {
  booking: BookingReponseBis
  activationCodeFeatureEnabled?: boolean
}

export function getMultipleTickets({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  return {
    tickets: [booking].map((ticket) => {
      if (ticket.externalBookingsInfos) {
        return ticket.externalBookingsInfos.map((infos, index) => (
          <TicketWithContent
            key={index}
            booking={ticket}
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
            externalBookingsInfos={infos}
          />
        ))
      }
      return []
    }),
  }
}
