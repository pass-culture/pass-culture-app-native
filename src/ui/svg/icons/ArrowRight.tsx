import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ArrowRightSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  style,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    style={style}
    height={size}
    viewBox="0 0 22 22"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M19.25 11H2.75M19.25 11L13.75 5.5M19.25 11L13.75 16.5"
      stroke={color}
      strokeWidth={2.0625}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </AccessibleSvg>
)

export const ArrowRight = styled(ArrowRightSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
