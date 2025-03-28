import React from 'react'
import { View } from 'react-native'

type Props = {
  testID?: string
}

export function TicketSent({ testID }: Readonly<Props>) {
  return <View testID={testID} />
}
