import React from 'react'
import { View } from 'react-native'

import { BookingOfferResponse, BookingReponse, WithdrawalTypeEnum } from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/TicketBody/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'

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
      return <View />
    default:
      return null
  }
}
