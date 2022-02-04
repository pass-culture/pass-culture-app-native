import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import { useTheme } from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { getSpacing } from '../theme'

import { IconInterface } from './icons/types'

const NotMemoizedRectangle: React.FC<Omit<IconInterface, 'color'> & { height?: number }> = ({
  size = 32,
  height = getSpacing(2),
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const LINEAR_GRADIENT_ID = uuidv1()
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 375 8"
      preserveAspectRatio="none"
      testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_ID} x1="0%" x2="100%" y1="49.977%" y2="50.023%">
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={secondary} />
        </LinearGradient>
      </Defs>
      <G fill="none">
        <G
          stroke={`url(#${LINEAR_GRADIENT_ID})`}
          strokeWidth={getSpacing(2)}
          transform="translate(0 -309)">
          <Path d="M4 313H371V314H4z" />
        </G>
      </G>
    </Svg>
  )
}

export const Rectangle = React.memo(NotMemoizedRectangle)
