import React from 'react'
import { Defs, LinearGradient, Stop, Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleRectangleIconInterface } from './icons/types'

const NotMemoizedBackgroundPlaceholder: React.FC<AccessibleRectangleIconInterface> = ({
  height = 32,
  width = 38,
  accessibilityLabel,
  testID,
}) => {
  const { id, fill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={width}
      height={height}
      viewBox="0 0 375 317"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={id} x1="50%" x2="50%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor="#ECF0F1" />
          <Stop offset="100%" stopColor="#C7C7CC" />
        </LinearGradient>
      </Defs>
      <Path d="M0 0h375v317H0z" fill={fill} fillRule="evenodd" />
    </AccessibleSvg>
  )
}

export const BackgroundPlaceholder = React.memo(NotMemoizedBackgroundPlaceholder)
