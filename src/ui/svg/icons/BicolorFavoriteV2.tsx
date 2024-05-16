import * as React from 'react'
import { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIcon } from './types'

const NotMemoizedBicolorFavoriteV2: React.FC<AccessibleBicolorIcon> = ({
  size,
  color,
  color2,
  opacity,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 27 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G opacity={opacity}>
        <Defs>
          <LinearGradient id={gradientId} x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color2} />
          </LinearGradient>
        </Defs>
        <Path
          d="M13.8988 22.75C-9.06616 10.2087 7.00959 -3.40574 13.8988 5.2032C20.7888 -3.40574 36.8646 10.2087 13.8988 22.75Z"
          fill={gradientFill}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </G>
    </AccessibleSvg>
  )
}

export const BicolorFavoriteV2 = React.memo(
  styled(NotMemoizedBicolorFavoriteV2).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
