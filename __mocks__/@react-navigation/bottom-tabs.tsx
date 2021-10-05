import React from 'react'
import { View } from 'react-native'

const Navigator: React.FC = ({ children }) => {
  return <View>{children}</View>
}
const Screen = () => null

export const createBottomTabNavigator = () => ({ Navigator, Screen })
