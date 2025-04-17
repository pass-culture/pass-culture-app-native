import React from 'react'
import { View } from 'react-native'

import { BookingOfferResponse, BookingReponse, WithdrawalTypeEnum } from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCodeTitle'

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
          isDuo={booking.quantity === 2}
          beginningDatetime={booking.stock.beginningDatetime}
          withdrawalDelay={offer.withdrawalDelay}
        />
      )
    case WithdrawalTypeEnum.in_app:
      return <View />
    case WithdrawalTypeEnum.on_site:
      return booking.token ? <OnSiteWithdrawal token={booking.token} /> : null
    default:
      return booking.activationCode ? (
        <TicketCodeTitle>{booking.activationCode.code}</TicketCodeTitle>
      ) : null
  }
}
