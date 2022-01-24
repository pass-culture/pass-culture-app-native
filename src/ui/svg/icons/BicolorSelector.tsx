import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg'

import { svgIdentifier } from 'ui/svg/utils'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { RectangleIconInterface } from './types'

// To compensate for some weird blank margin above the "bar"
const OWN_STYLE = { marginTop: -getSpacing(1 / 4) }

export const BicolorSelector: React.FC<RectangleIconInterface> = ({
  color,
  width,
  height,
  testID,
  style,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const primaryColor = color || ColorsEnum.PRIMARY
  const secondaryColor = color || ColorsEnum.SECONDARY
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 44 3"
      preserveAspectRatio="none"
      style={{ ...style, ...OWN_STYLE }}
      testID={testID}
      aria-hidden>
      <Defs>
        <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </LinearGradient>
      </Defs>
      <Path
        d="M310 0h44v1a2 2 0 01-2 2h-40a2 2 0 01-2-2V0z"
        transform="translate(-310)"
        fill={gradientFill}
        fillRule="nonzero"
      />
    </Svg>
  )
}
