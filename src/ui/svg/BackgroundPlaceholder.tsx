import React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'

import { svgIdentifier } from 'ui/svg/utils'

import { RectangleIconInterface } from './icons/types'

const NotMemoizedBackgroundPlaceholder: React.FC<RectangleIconInterface> = ({
  height = 32,
  width = 38,
  testID,
}) => {
  const { id, fill } = svgIdentifier()
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 375 317"
      testID={testID}
      preserveAspectRatio="none"
      aria-hidden>
      <Defs>
        <LinearGradient id={id} x1="50%" x2="50%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor="#ECF0F1" />
          <Stop offset="100%" stopColor="#C7C7CC" />
        </LinearGradient>
      </Defs>
      <Path d="M0 0h375v317H0z" fill={fill} fillRule="evenodd" />
    </Svg>
  )
}

export const BackgroundPlaceholder = React.memo(NotMemoizedBackgroundPlaceholder)
