import React from 'react'

import { SubcategoryIdEnum, TicketDisplayEnum, TicketResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { DigitalTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTicket'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { HiddenExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/HiddenExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { UserProfile } from 'features/share/types'

type TicketBottomPartProps = {
  isDuo: boolean
  userEmail: UserProfile['email']
  ticket: TicketResponse
  expirationDate?: string
  beginningDateTime?: string
  completedUrl?: string
  offerId: number
  subcategoryId: SubcategoryIdEnum
  onBeforeNavigate: VoidFunction
}

export const TicketBottomPart = ({
  isDuo,
  userEmail,
  ticket,
  expirationDate,
  beginningDateTime,
  completedUrl,
  offerId,
  subcategoryId,
  onBeforeNavigate,
}: TicketBottomPartProps) => {
  switch (ticket.display) {
    // Ticket sent by email
    case TicketDisplayEnum.email_sent:
      return (
        <EmailWithdrawal
          isDuo={isDuo}
          withdrawalDelay={ticket.withdrawal.delay}
          hasEmailBeenSent
          userEmail={userEmail}
        />
      )
    // Ticket to be sent by email with a sending delay
    case TicketDisplayEnum.email_will_be_sent:
      return (
        <EmailWithdrawal
          isDuo={isDuo}
          withdrawalDelay={ticket.withdrawal.delay}
          hasEmailBeenSent={false}
          userEmail={userEmail}
        />
      )
    // Online activation link with or without activation code
    case TicketDisplayEnum.online_code:
      return (
        <DigitalTicket
          code={ticket.activationCode?.code ?? ticket.token?.data ?? ''}
          completedUrl={completedUrl ?? ''}
          offerId={offerId}
          subcategoryId={subcategoryId}
          onBeforeNavigate={onBeforeNavigate}
        />
      )
    // External ticket with visible or hidden QR code
    case TicketDisplayEnum.external_ticket:
      return (
        <ExternalBookingTicket data={ticket.externalBooking?.data ?? undefined} isDuo={isDuo} />
      )
    // External ticket with hidden QR code
    case TicketDisplayEnum.hidden_external_ticket:
      return <HiddenExternalBookingTicket beginningDatetime={beginningDateTime} isDuo={isDuo} />
    // Voucher for a physical good
    case TicketDisplayEnum.voucher:
      return (
        <PhysicalGoodBookingTicket
          voucherData={ticket.voucher?.data ?? ''}
          tokenData={ticket.token?.data ?? ''}
          expirationDate={expirationDate}
        />
      )
    // Voucher for a cinema ticket
    case TicketDisplayEnum.cinema_voucher:
      return (
        <CinemaBookingTicket
          voucher={ticket.voucher?.data ?? ''}
          token={ticket.token?.data ?? undefined}
        />
      )
    // On-site withdrawal for a physical event ticket
    case TicketDisplayEnum.ticket:
      return <OnSiteWithdrawal token={ticket.token?.data ?? ''} isDuo={isDuo} />
    // No ticket required to access the event (Live Music only)
    case TicketDisplayEnum.no_ticket:
      return <NoTicket />
    default:
      return null
  }
}
