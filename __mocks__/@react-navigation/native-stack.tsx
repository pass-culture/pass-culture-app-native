import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

const Navigator: React.FC<PropsWithChildren> = ({ children }) => {
  return <View>{children}</View>
}
const Screen = () => null
const Group: React.FC<PropsWithChildren> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
)

export const createNativeStackNavigator = (config?: unknown) => {
  if (config) return { Navigator, Screen, Group, config, getComponent: () => Navigator }
  return { Navigator, Screen }
}

export const NativeStackView = () => null
