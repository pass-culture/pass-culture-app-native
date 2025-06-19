import React from 'react'
import { View } from 'react-native'

import { ExternalBookingDataResponseV2 } from 'api/gen'

type props = {
  data: ExternalBookingDataResponseV2[]
}

export const ExternalBookingTicket = ({ data }: props) => {
  if (data.length) return <View testID="external-booking-ticket-container" />
  return null
}
