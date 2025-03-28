import React from 'react'
import { View } from 'react-native'

import { BookingOfferResponse, WithdrawalTypeEnum } from 'api/gen'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'

export const TicketCutoutBottom = ({ offer }: { offer: BookingOfferResponse }) => {
  switch (offer.withdrawalType) {
    case WithdrawalTypeEnum.no_ticket:
      return <NoTicket />
    case WithdrawalTypeEnum.by_email:
      return <View />
    case WithdrawalTypeEnum.in_app:
      return <View />
    case WithdrawalTypeEnum.on_site:
      return <View />
    default:
      return <View />
  }
}
