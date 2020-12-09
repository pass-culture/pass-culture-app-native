import React from 'react'
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'

import { RectangleIconInterface } from './icons/types'

export const OfferPlaceholder: React.FC<RectangleIconInterface> = ({
  height = 32,
  width = 20,
  testID,
}) => {
  return (
    <Svg width={width} height={height} testID={testID} viewBox="0 0 210 316">
      <Defs>
        <LinearGradient id="prefix__a" x1="50%" x2="50%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor="#F5F5F5" />
          <Stop offset="100%" stopColor="#C7C7CC" />
        </LinearGradient>
      </Defs>
      <Rect
        width={210}
        height={316}
        x={83}
        y={80}
        rx={8}
        fill="url(#prefix__a)"
        transform="translate(-83 -80)"
        fillRule="evenodd"
      />
    </Svg>
  )
}
