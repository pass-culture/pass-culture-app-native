import React from 'react'
import { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './icons/types'

const NotMemoizedRectangle: React.FC<Omit<AccessibleIcon, 'color'> & { height?: number }> = ({
  size = 32,
  height = 8,
  accessibilityLabel,
  testID,
}) => {
  const { designSystem } = useTheme()
  const { id, fill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 375 8"
      preserveAspectRatio="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={id} x1="0%" x2="100%" y1="49.977%" y2="50.023%">
          <Stop offset="0%" stopColor={designSystem.color.background.brandPrimary} />
          <Stop offset="100%" stopColor={designSystem.color.background.brandPrimary} />
        </LinearGradient>
      </Defs>
      <G fill="none">
        <G stroke={fill} strokeWidth={designSystem.size.spacing.s} transform="translate(0 -309)">
          <Path d="M4 313H371V314H4z" />
        </G>
      </G>
    </AccessibleSvg>
  )
}

export const Rectangle = React.memo(NotMemoizedRectangle)
