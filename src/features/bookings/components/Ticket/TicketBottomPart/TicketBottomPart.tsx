import React from 'react'

import { SubcategoryIdEnum, TicketDisplayEnum, TicketResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { DigitalTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTicket'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { UserProfile } from 'features/share/types'

type TicketBottomPartProps = {
  isDuo: boolean
  isEvent: boolean
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
  isEvent,
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
    // Billet envoyé par email
    case TicketDisplayEnum.email_sent:
      return (
        <EmailWithdrawal
          isDuo={isDuo}
          withdrawalDelay={ticket.withdrawal.delay}
          hasEmailBeenSent
          userEmail={userEmail}
        />
      )
    // Billet envoyé par email à venir avec délai d'envoi
    case TicketDisplayEnum.email_will_be_sent:
      return (
        <EmailWithdrawal
          isDuo={isDuo}
          withdrawalDelay={ticket.withdrawal.delay}
          hasEmailBeenSent={false}
          userEmail={userEmail}
        />
      )
    // Lien d'activation en ligne avec ou sans code d'activation
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
    // Billet externe avec QR code visible
    case TicketDisplayEnum.external_ticket:
      return (
        <ExternalBookingTicket
          data={ticket.externalBooking?.data ?? undefined}
          beginningDatetime={beginningDateTime}
          isDuo={isDuo}
          hideTicket={false}
        />
      )
    // Billet externe avec QR code non visible
    case TicketDisplayEnum.hidden_external_ticket:
      return (
        <ExternalBookingTicket
          data={ticket.externalBooking?.data ?? undefined}
          beginningDatetime={beginningDateTime}
          isDuo={isDuo}
          hideTicket
        />
      )
    // Contremarque de retrait pour un bien physique
    case TicketDisplayEnum.voucher:
      return (
        <PhysicalGoodBookingTicket
          voucherData={ticket.voucher?.data ?? ''}
          tokenData={ticket.token?.data ?? ''}
          expirationDate={expirationDate}
        />
      )
    // Contremarque de retrait pour un billet de cinéma
    case TicketDisplayEnum.cinema_voucher:
      return (
        <CinemaBookingTicket
          voucher={ticket.voucher?.data ?? ''}
          token={ticket.token?.data ?? undefined}
        />
      )
    // Contremarque de retrait pour un billet d'événement physique sur place
    case TicketDisplayEnum.ticket:
      return (
        <OnSiteWithdrawal
          token={ticket.token?.data ?? ''}
          isDuo={isDuo}
          shouldShowExchangeMessage={isEvent}
        />
      )
    // Pas de billet nécessaire à présenter pour accéder à l'événement (Musique Live uniquement)
    case TicketDisplayEnum.no_ticket:
      return <NoTicket />
    default:
      return null
  }
}
