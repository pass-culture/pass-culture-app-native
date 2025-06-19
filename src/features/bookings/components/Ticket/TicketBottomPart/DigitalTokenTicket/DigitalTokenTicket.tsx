import React from 'react'
import { View } from 'react-native'

import { TokenResponse } from 'api/gen'

type props = {
  token: TokenResponse | null
}
export const DigitalTokenTicket = ({ token }: props) => {
  if (token) return <View testID="digital-token-container" />
  return null
}
