import * as React from 'react'
import { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { getSpacing } from '../theme'

import { AccessibleIcon } from './icons/types'

const NotMemoizedRectangle: React.FC<Omit<AccessibleIcon, 'color'> & { height?: number }> = ({
  size = 32,
  height = getSpacing(2),
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
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
          <Stop offset="0%" stopColor={primary} />
          <Stop offset="100%" stopColor={secondary} />
        </LinearGradient>
      </Defs>
      <G fill="none">
        <G stroke={fill} strokeWidth={getSpacing(2)} transform="translate(0 -309)">
          <Path d="M4 313H371V314H4z" />
        </G>
      </G>
    </AccessibleSvg>
  )
}

export const Rectangle = React.memo(NotMemoizedRectangle)
