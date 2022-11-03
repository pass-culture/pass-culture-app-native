import * as React from 'react'
import { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleBicolorIconInterface } from './types'

const NotMemoizedBicolorWarning: React.FC<AccessibleBicolorIconInterface> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="16.056%" x2="83.944%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.3957 9.0123C22.5472 6.9959 25.4545 6.9959 26.606 9.0123L28.8527 12.9467C29.1266 13.4263 29.7374 13.593 30.217 13.3191C30.6966 13.0453 30.8634 12.4345 30.5895 11.9549L28.3427 8.0205C26.4236 4.65983 21.5781 4.65984 19.6589 8.0205L3.66829 36.022C1.76478 39.3553 4.17169 43.5015 8.01019 43.5015H39.9914C43.83 43.5015 46.2369 39.3553 44.3333 36.022L36.3098 21.9718C36.0359 21.4922 35.4251 21.3254 34.9455 21.5993C34.4659 21.8732 34.2991 22.484 34.573 22.9636L42.5966 37.0138C43.7387 39.0138 42.2945 41.5015 39.9914 41.5015H8.01019C5.70709 41.5015 4.26295 39.0138 5.40505 37.0138L21.3957 9.0123Z"
      />
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.0099 16.5072C24.5624 16.5072 25.0104 16.9329 25.0104 17.4581V29.5511C25.0104 30.0762 24.5624 30.502 24.0099 30.502C23.4574 30.502 23.0094 30.0762 23.0094 29.5511V17.4581C23.0094 16.9329 23.4574 16.5072 24.0099 16.5072Z"
      />
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.7593 35.2502C22.7593 34.5601 23.3192 34.0007 24.0099 34.0007C24.7006 34.0007 25.2605 34.5601 25.2605 35.2502C25.2605 35.9403 24.7006 36.4997 24.0099 36.4997C23.3192 36.4997 22.7593 35.9403 22.7593 35.2502Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorWarning = React.memo(
  styled(NotMemoizedBicolorWarning).attrs(({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  }))``
)

export const Warning = React.memo(
  styled(NotMemoizedBicolorWarning).attrs(({ color, size, theme }) => ({
    color: color ?? theme.colors.black,
    color2: color ?? theme.colors.black,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
