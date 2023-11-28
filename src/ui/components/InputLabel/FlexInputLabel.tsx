import React from 'react'
import { View } from 'react-native'

export const FlexInputLabel = ({
  children,
}: {
  id?: string
  htmlFor: string
  children: React.ReactNode
}) => <View>{children}</View>
