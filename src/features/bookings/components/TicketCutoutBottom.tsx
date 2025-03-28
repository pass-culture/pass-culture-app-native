import React from 'react'
import { View } from 'react-native'

import { BookingOfferResponse, BookingReponse, WithdrawalTypeEnum } from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/TicketBody/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/TicketBody/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/TicketCodeTitle'

export const TicketCutoutBottom = ({
  offer,
  booking,
}: {
  offer: BookingOfferResponse
  booking: BookingReponse
}) => {
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
      return <View />
    case WithdrawalTypeEnum.on_site:
      return <OnSiteWithdrawal booking={booking} />
    default:
      return booking.activationCode ? (
        <TicketCodeTitle>{booking.activationCode.code}</TicketCodeTitle>
      ) : null
  }
}
