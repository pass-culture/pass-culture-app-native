import React from 'react'

import { TicketCodeTitle } from 'features/bookings/atoms/TicketCodeTitle'

export function TicketCode({ code }: { code: string }) {
  return <TicketCodeTitle>{code}</TicketCodeTitle>
}
