import React from 'react'

import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCode'

export const DigitalTicket = ({ code }: { code: string }) => (
  <TicketCode
    code={code}
    text="Utilises le code ci-dessus pour accéder à ton offre sur le site du partenaire."
  />
)
