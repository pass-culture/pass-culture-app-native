import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const CircledClockSvg: React.FC<AccessibleIcon> = ({ size, color, accessibilityLabel, testID }) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        d="M56.456 54.53a3.545 3.545 0 0 0-6.246-3.357C45.915 59.164 43.5 68.318 43.5 78c0 31.485 25.515 57 57 57s57-25.515 57-57-25.515-57-57-57a56.736 56.736 0 0 0-27.173 6.896 3.545 3.545 0 0 0 3.386 6.23A49.646 49.646 0 0 1 100.5 28.09c27.569 0 49.909 22.34 49.909 49.909s-22.34 49.909-49.909 49.909c-27.57 0-49.91-22.34-49.91-49.909 0-8.493 2.117-16.495 5.866-23.47Z"
        fill={color}
      />
      <Path
        d="M104.045 42.67a3.545 3.545 0 1 0-7.09 0V78c0 .94.373 1.842 1.038 2.507l15.273 15.273a3.545 3.545 0 1 0 5.014-5.014L104.045 76.53V42.67Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const CircledClock = styled(CircledClockSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.illustrations.sizes.medium,
}))``
