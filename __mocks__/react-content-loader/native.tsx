import React, { ReactNode } from 'react'
import { Svg } from 'react-native-svg'

const MockContentLoader = ({ children }: { children: ReactNode }) => {
  return <Svg>{children}</Svg>
}
export default MockContentLoader
