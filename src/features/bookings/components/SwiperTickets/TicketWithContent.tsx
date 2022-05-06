import React from 'react'

import {
  BookingDetailsTicketContent,
  BookingDetailsTicketContentProps,
} from 'features/bookings/components/BookingDetailsTicketContent'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'

export function TicketWithContent({
  booking,
  activationCodeFeatureEnabled,
  externalBookingsInfos,
  testID,
}: BookingDetailsTicketContentProps) {
  return (
    <ThreeShapesTicket testID={testID}>
      <BookingDetailsTicketContent
        booking={booking}
        activationCodeFeatureEnabled={activationCodeFeatureEnabled}
        externalBookingsInfos={externalBookingsInfos}
      />
    </ThreeShapesTicket>
  )
}
