import React from 'react'
import { View } from 'react-native'

import { VoucherResponse, TokenResponse } from 'api/gen'

type props = {
  voucher: VoucherResponse | null
  token: TokenResponse | null
}
export const CinemaBookingTicket = ({ voucher, token }: props) => {
  if (voucher && token) return <View testID="cinema-booking-ticket-container" />
  return null
}
