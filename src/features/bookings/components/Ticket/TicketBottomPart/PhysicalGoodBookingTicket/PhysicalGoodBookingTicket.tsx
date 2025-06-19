import React from 'react'
import { View } from 'react-native'

import { VoucherResponse, TokenResponse } from 'api/gen'

type props = {
  voucher: VoucherResponse | null
  token: TokenResponse | null | undefined
  ean: string | null
}
export const PhysicalGoodBookingTicket = ({ voucher, token, ean }: props) => {
  if (voucher && token && ean) return <View testID="physical-good-booking-ticket-container" />
  return null
}
