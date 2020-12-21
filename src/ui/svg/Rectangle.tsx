import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'

import { ColorsEnum, getSpacing } from '../theme'

import { IconInterface } from './icons/types'

export const Rectangle: React.FC<Omit<IconInterface, 'color'> & { height?: number }> = ({
  size = 32,
  height = getSpacing(2),
  testID,
}) => {
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 375 8"
      preserveAspectRatio="none"
      testID={testID}>
      <Defs>
        <LinearGradient id="prefix__a" x1="0%" x2="100%" y1="49.977%" y2="50.023%">
          <Stop offset="0%" stopColor={ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none">
        <G stroke="url(#prefix__a)" strokeWidth={getSpacing(2)} transform="translate(0 -309)">
          <Path d="M4 313H371V314H4z" />
        </G>
      </G>
    </Svg>
  )
}
