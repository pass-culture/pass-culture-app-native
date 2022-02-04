import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import styled from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { getSpacing } from '../theme'

import { IconInterface } from './icons/types'

const NotMemoizedRectangle: React.FC<Omit<IconInterface, 'color'> & { height?: number }> = ({
  size = 32,
  height = getSpacing(2),
  testID,
}) => {
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
          <PrimaryStop />
          <SecondaryStop />
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

const PrimaryStop = styled(Stop).attrs(({ theme }) => ({
  stopColor: theme.colors.primary,
  offset: '0%',
}))``

const SecondaryStop = styled(Stop).attrs(({ theme }) => ({
  stopColor: theme.colors.secondary,
  offset: '100%',
}))``

export const Rectangle = React.memo(NotMemoizedRectangle)
