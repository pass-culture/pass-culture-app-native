import * as React from 'react'
import { Defs, LinearGradient, Stop, Path } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'
import { getSpacing } from 'ui/theme'

import { AccessibleRectangleIconInterface } from './types'

// To compensate for some weird blank margin above the "bar"
const OWN_STYLE = { marginTop: -getSpacing(1 / 4) }

export const BicolorSelector: React.FC<AccessibleRectangleIconInterface> = ({
  color,
  width,
  height,
  accessibilityLabel,
  testID,
  style,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={width}
      height={height}
      viewBox="0 0 44 3"
      preserveAspectRatio="none"
      style={{ ...style, ...OWN_STYLE }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color || primary} />
          <Stop offset="100%" stopColor={color || secondary} />
        </LinearGradient>
      </Defs>
      <Path
        d="M310 0h44v1a2 2 0 01-2 2h-40a2 2 0 01-2-2V0z"
        transform="translate(-310)"
        fill={gradientFill}
        fillRule="nonzero"
      />
    </AccessibleSvg>
  )
}
