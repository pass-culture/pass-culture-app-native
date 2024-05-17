import * as React from 'react'
import { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIcon } from './types'

const NotMemoizedBicolorSearchV2: React.FC<AccessibleBicolorIcon> = ({
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
      viewBox="0 0 25 24"
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
          d="M11.0996 1C16.6225 1 21.0996 5.47715 21.0996 11C21.0996 13.4009 20.2535 15.6042 18.8432 17.3279L22.8067 21.2929C23.1972 21.6834 23.1972 22.3166 22.8067 22.7071C22.4462 23.0676 21.879 23.0953 21.4867 22.7903L21.3925 22.7071L17.4275 18.7436C15.7038 20.1539 13.5005 21 11.0996 21C5.57676 21 1.09961 16.5228 1.09961 11C1.09961 5.47715 5.57676 1 11.0996 1ZM11.0996 3C6.68133 3 3.09961 6.58172 3.09961 11C3.09961 15.4183 6.68133 19 11.0996 19C15.5179 19 19.0996 15.4183 19.0996 11C19.0996 6.58172 15.5179 3 11.0996 3Z"
          fill={gradientFill}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </G>
    </AccessibleSvg>
  )
}

export const BicolorSearchV2 = React.memo(
  styled(NotMemoizedBicolorSearchV2).attrs(({ color, color2, size, thin, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? color ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
    thin: thin ?? false,
  }))``
)
