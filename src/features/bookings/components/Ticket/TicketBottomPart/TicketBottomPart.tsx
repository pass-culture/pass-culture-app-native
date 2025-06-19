import React from 'react'

import { TicketResponse, UserProfileResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { DigitalTokenTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTokenTicket/DigitalTokenTicket'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import {
  ExternalBookingTicket,
  HiddenExternalBookingTicket,
} from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'

export const TicketBottomPart = ({
  isDuo,
  isDigital,
  isEvent,
  userEmail,
  ticket,
  ean,
}: {
  isDuo: boolean
  isDigital: boolean
  isEvent: boolean
  userEmail: UserProfileResponse['email']
  ticket: TicketResponse | null
  ean: string | null
}) => {
  if (ticket?.noTicket) return <NoTicket />

  if (ticket?.email)
    return (
      <EmailWithdrawal
        isDuo={isDuo}
        withdrawalDelay={ticket.withdrawal.delay}
        hasEmailBeenSent={ticket.email.hasTicketEmailBeenSent}
        userEmail={userEmail}
      />
    )

  if (ticket?.activationCode) return <TicketCodeTitle>{ticket.activationCode.code}</TicketCodeTitle>

  if (ticket?.externalBooking)
    return ticket?.externalBooking.data ? (
      <ExternalBookingTicket data={ticket?.externalBooking.data} />
    ) : (
      <HiddenExternalBookingTicket />
    )

  if (ticket?.voucher) {
    return isEvent ? (
      <CinemaBookingTicket voucher={ticket.voucher} token={ticket.token ?? null} />
    ) : (
      <PhysicalGoodBookingTicket voucher={ticket.voucher} token={ticket.token} ean={ean} />
    )
  }

  if (ticket?.token?.data) {
    return isDigital ? (
      <DigitalTokenTicket token={ticket.token ?? null} />
    ) : (
      <OnSiteWithdrawal token={ticket.token.data} isDuo={isDuo} />
    )
  }
  return null
}
