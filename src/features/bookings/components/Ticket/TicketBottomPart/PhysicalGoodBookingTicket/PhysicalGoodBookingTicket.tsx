import React from 'react'
import { View } from 'react-native'

import { VoucherResponse, TokenResponse } from 'api/gen'

type props = {
  voucher: VoucherResponse | null
  token: TokenResponse | null | undefined
  ean: string | null
}
export const PhysicalGoodBookingTicket = ({ voucher, token, ean }: props) => {
  if (voucher && token && ean) return <View />
  return null
}
