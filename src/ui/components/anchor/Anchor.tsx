import React, { useRef, useEffect } from 'react'
import { View, ViewStyle } from 'react-native'

import { AnchorName } from 'ui/components/anchor/anchor-name'

import { useRegisterAnchor } from './AnchorContext'

type AnchorWrapperProps = {
  name: AnchorName
  children: React.ReactNode
  style?: ViewStyle
}

export const Anchor = ({ name, children, style }: AnchorWrapperProps) => {
  const ref = useRef<View>(null)
  const registerAnchor = useRegisterAnchor()

  useEffect(() => {
    if (ref.current) {
      registerAnchor(name, ref)
    }
  }, [name, registerAnchor])

  return (
    <View
      ref={ref}
      onLayout={() => {
        if (ref.current) {
          registerAnchor(name, ref)
        }
      }}
      style={style}>
      {children}
    </View>
  )
}
