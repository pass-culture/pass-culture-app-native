import React from 'react'

import { SubcategoryIdEnum, TicketResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { DigitalTicket } from 'features/bookings/components/Ticket/TicketBottomPart/DigitalTicket'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { getTicketVariant } from 'features/bookings/helpers/getTicketVariant'
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
  const result = getTicketVariant(ticket, isDigital, isEvent, completedUrl)

  switch (result.variant) {
    case 'no_ticket':
      return <NoTicket />
    case 'email_withdrawal':
      return (
        <EmailWithdrawal
          isDuo={isDuo}
          withdrawalDelay={result.withdrawalDelay}
          hasEmailBeenSent={result.hasEmailBeenSent}
          userEmail={userEmail}
        />
      )
    case 'digital_activation':
    case 'digital_token':
      return (
        <DigitalTicket
          code={result.code}
          completedUrl={result.completedUrl}
          offerId={offerId}
          subcategoryId={subcategoryId}
          onBeforeNavigate={onBeforeNavigate}
        />
      )
    case 'external_booking':
      return (
        <ExternalBookingTicket
          data={result.data}
          beginningDatetime={beginningDateTime}
          isDuo={isDuo}
        />
      )
    case 'cinema':
      return <CinemaBookingTicket voucher={result.voucher} token={result.token} />
    case 'physical_good':
      return (
        <PhysicalGoodBookingTicket
          voucherData={result.voucherData}
          tokenData={result.tokenData}
          expirationDate={expirationDate}
        />
      )
    case 'on_site_withdrawal':
      return (
        <OnSiteWithdrawal token={result.token} isDuo={isDuo} shouldShowExchangeMessage={isEvent} />
      )
    default:
      return null
  }
}
