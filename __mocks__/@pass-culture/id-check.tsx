import React from 'react'
import { View } from 'react-native'

export const initialRouteName = 'IdCheckV2'

export const routes = []

export const theme = {}

export const IdCheckContextProvider: React.FC = (props) => {
  return <View>{props.children}</View>
}
