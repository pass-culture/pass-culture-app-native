import React from 'react'

import { TicketResponse, UserProfileResponse } from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'

export const TicketBottomPart = ({
  isDuo,
  userEmail,
  ticket,
}: {
  isDuo: boolean
  userEmail: UserProfileResponse['email']
  ticket: TicketResponse | null | undefined
}) => {
  if (ticket?.noTicket) {
    return <NoTicket />
  }
  if (ticket?.email) {
    return (
      <EmailWithdrawal
        isDuo={isDuo}
        withdrawalDelay={ticket.withdrawal.delay}
        hasEmailBeenSent={ticket.email.hasTicketEmailBeenSent}
        userEmail={userEmail}
      />
    )
  }
  if (ticket?.token?.data) {
    return <OnSiteWithdrawal token={ticket.token.data} isDuo={isDuo} />
  }
  if (ticket?.activationCode) return <TicketCodeTitle>{ticket.activationCode.code}</TicketCodeTitle>
  return null
}
