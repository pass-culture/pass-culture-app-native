import React from 'react'

import { SubcategoryIdEnum, TicketDisplayEnum, TicketResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { DigitalTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTicket'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type TicketBottomPartProps = {
  isDuo: boolean
  isDigital: boolean
  isEvent: boolean
  userEmail: UserProfileResponseWithoutSurvey['email']
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
  isDigital,
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
  if (ticket.activationCode && completedUrl)
    return (
      <DigitalTicket
        code={ticket.activationCode.code}
        completedUrl={completedUrl}
        offerId={offerId}
        subcategoryId={subcategoryId}
        onBeforeNavigate={onBeforeNavigate}
      />
    )

  if (ticket.externalBooking)
    return (
      <ExternalBookingTicket
        data={ticket.externalBooking.data ?? undefined}
        beginningDatetime={beginningDateTime}
        isDuo={isDuo}
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

  if (ticket.token?.data && isDigital && completedUrl)
    return (
      <DigitalTicket
        code={ticket.token?.data}
        completedUrl={completedUrl}
        offerId={offerId}
        subcategoryId={subcategoryId}
        onBeforeNavigate={onBeforeNavigate}
      />
    )

  if (ticket.token?.data) return <OnSiteWithdrawal token={ticket.token.data} isDuo={isDuo} />

  return null
}
