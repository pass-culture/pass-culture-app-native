import React from 'react'

import { TicketDisplayEnum, TicketResponse, UserProfileResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { DigitalTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTicket'
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
  if (ticket.display === TicketDisplayEnum.no_ticket) return <NoTicket />

  if (
    ticket.display === TicketDisplayEnum.email_sent ||
    ticket.display === TicketDisplayEnum.email_will_be_sent
  )
    return (
      <EmailWithdrawal
        isDuo={isDuo}
        withdrawalDelay={ticket.withdrawal.delay}
        hasEmailBeenSent={ticket.display === TicketDisplayEnum.email_sent}
        userEmail={userEmail}
      />
    )
  if (ticket.activationCode) return <DigitalTicket code={ticket.activationCode.code} />

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

  if (ticket.token?.data && isDigital) return <DigitalTicket code={ticket.token?.data} />

  if (ticket.token?.data) return <OnSiteWithdrawal token={ticket.token.data} isDuo={isDuo} />

  return null
}
