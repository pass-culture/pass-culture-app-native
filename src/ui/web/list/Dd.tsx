import React from 'react'
import { Text, View, TextProps } from 'react-native'

type Props = {
  children: React.ReactNode | string
} & TextProps

export function Dd(props: Props) {
  if (typeof props.children === 'string') return <Text {...props}>{props.children}</Text>
  return <View {...props}>{props.children}</View>
}
