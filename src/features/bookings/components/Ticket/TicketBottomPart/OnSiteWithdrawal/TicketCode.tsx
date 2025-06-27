import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'

export const TicketCode = ({ code }: { code: string }) => <TicketCodeTitle>{code}</TicketCodeTitle>
