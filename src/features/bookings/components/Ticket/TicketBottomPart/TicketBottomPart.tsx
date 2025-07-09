import React from 'react'

import { TicketResponse, UserProfileResponse } from 'api/gen'
import { TicketCode } from 'features/bookings/components/OldBookingDetails/TicketCode'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'

export const TicketBottomPart = ({
  isDuo,
  isDigital,
  isEvent,
  userEmail,
  ticket,
  expirationDate,
  beginningDateTime,
}: {
  isDuo: boolean
  isDigital: boolean
  isEvent: boolean
  userEmail: UserProfileResponse['email']
  ticket: TicketResponse
  expirationDate?: string
  beginningDateTime: string | undefined
}) => {
  if (ticket.noTicket) return <NoTicket />

  if (ticket.email)
    return (
      <EmailWithdrawal
        isDuo={isDuo}
        withdrawalDelay={ticket.withdrawal.delay}
        hasEmailBeenSent={ticket.email.hasTicketEmailBeenSent}
        userEmail={userEmail}
      />
    )
  if (ticket.activationCode) return <TicketCode code={ticket.activationCode.code} />

  if (ticket.externalBooking)
    return (
      <ExternalBookingTicket
        data={ticket.externalBooking.data ?? undefined}
        beginningDatetime={beginningDateTime}
      />
    )

  if (ticket.voucher?.data) {
    if (isEvent) {
      return <CinemaBookingTicket voucher={ticket.voucher.data} token={ticket.token?.data} />
    }
    if (ticket.token?.data)
      return (
        <PhysicalGoodBookingTicket
          voucherData={ticket.voucher.data}
          tokenData={ticket.token.data}
          expirationDate={expirationDate}
        />
      )
  }

  if (ticket.token?.data && isDigital) return <TicketCode code={ticket.token?.data} />

  if (ticket.token?.data) return <OnSiteWithdrawal token={ticket.token.data} isDuo={isDuo} />

  return null
}
