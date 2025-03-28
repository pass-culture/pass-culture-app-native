import React from 'react'

import { BookingOfferResponse, BookingReponse, WithdrawalTypeEnum } from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/TicketBody/EmailWithdrawal'
import { InAppWithdrawal } from 'features/bookings/components/TicketBody/InAppWithdrawal'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/TicketBody/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/TicketCodeTitle'
import { useCategoryId } from 'libs/subcategories'

export const TicketCutoutBottom = ({
  offer,
  booking,
}: {
  offer: BookingOfferResponse
  booking: BookingReponse
}) => {
  const categoryId = useCategoryId(offer.subcategoryId)

  switch (offer.withdrawalType) {
    case WithdrawalTypeEnum.no_ticket:
      return <NoTicket />
    case WithdrawalTypeEnum.by_email:
      return (
        <EmailWithdrawal
          beginningDatetime={booking.stock.beginningDatetime}
          withdrawalDelay={offer.withdrawalDelay}
        />
      )
    case WithdrawalTypeEnum.in_app:
      return (
        <InAppWithdrawal
          categoryId={categoryId}
          booking={booking}
          subcategoryId={offer.subcategoryId}
        />
      )
    case WithdrawalTypeEnum.on_site:
      return <OnSiteWithdrawal booking={booking} />
    default:
      return booking.activationCode ? (
        <TicketCodeTitle>{booking.activationCode.code}</TicketCodeTitle>
      ) : null
  }
}
