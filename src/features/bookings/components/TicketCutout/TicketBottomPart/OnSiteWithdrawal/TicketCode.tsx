import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketBottomPart/TicketCodeTitle'

export function TicketCode({ code }: { code: string }) {
  return <TicketCodeTitle>{code}</TicketCodeTitle>
}
