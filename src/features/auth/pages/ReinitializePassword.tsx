import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'

import { Route } from 'features/navigation/RootNavigator'

export const ReinitializePassword = () => {
  const {
    params: { token, expiration_date },
  } = useRoute<Route<'ReinitializePassword'>>()
  return (
    <View>
      <Text>{token}</Text>
      <Text>{expiration_date}</Text>
    </View>
  )
}
