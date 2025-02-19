import React, { PropsWithChildren, createContext } from 'react'
import { View } from 'react-native'

const Navigator: React.FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>
}
const Screen = () => null

export const createBottomTabNavigator = () => ({ Navigator, Screen })
export const BottomTabBarHeightContext = createContext({ height: 0 })
