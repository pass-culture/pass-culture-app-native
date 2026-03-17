import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

const Navigator: React.FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>
}
const Screen = () => null

export const createStackNavigator = (config?: unknown) => {
  if (config) return config
  return { Navigator, Screen }
}

export const TransitionPresets = {}
export const TransitionSpecs = { TransitionIOSSpec: { config: {} } }
