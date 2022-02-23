import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface Props extends TouchableOpacityProps {
  type?: string
}

export const Touchable: React.FC<Props> = (props) => {
  return <TouchableOpacity {...props}>{props.children}</TouchableOpacity>
}
