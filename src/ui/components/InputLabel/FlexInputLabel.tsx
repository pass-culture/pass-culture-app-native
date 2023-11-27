import React from 'react'
import { View } from 'react-native'

export const FlexInputLabel = ({
  children,
}: {
  id?: string // NOSONAR the prop is only used on the web
  htmlFor: string // NOSONAR the prop is only used on the web
  children: React.ReactNode
}) => <View>{children}</View>
