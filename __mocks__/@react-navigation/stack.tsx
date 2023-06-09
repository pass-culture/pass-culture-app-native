import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

const Navigator: React.FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>
}
const Screen = () => null

export const createStackNavigator = () => ({ Navigator, Screen })
