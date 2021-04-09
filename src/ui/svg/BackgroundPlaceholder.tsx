import React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'

import { RectangleIconInterface } from './icons/types'

export const BackgroundPlaceholder: React.FC<RectangleIconInterface> = ({
  height = 32,
  width = 38,
  testID,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 375 317"
      testID={testID}
      preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="prefix__a" x1="50%" x2="50%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor="#ECF0F1" />
          <Stop offset="100%" stopColor="#C7C7CC" />
        </LinearGradient>
      </Defs>
      <Path d="M0 0h375v317H0z" fill="url(#prefix__a)" fillRule="evenodd" />
    </Svg>
  )
}
