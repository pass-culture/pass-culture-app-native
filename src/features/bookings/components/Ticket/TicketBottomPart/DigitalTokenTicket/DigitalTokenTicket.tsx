import React from 'react'
import { View } from 'react-native'

import { TokenResponse } from 'api/gen'

type props = {
  token: TokenResponse | null | undefined
}
export const DigitalTokenTicket = ({ token }: props) => {
  if (token) return <View />
  return null
}
