import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const CheckFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M18.9999 42C18.1599 42 17.3599 41.65 16.7999 41.04L4.79993 28.04C3.67993 26.82 3.74993 24.92 4.96993 23.8C6.18993 22.68 8.08993 22.75 9.20993 23.97L18.8599 34.43L38.6799 10.11C39.7299 8.83001 41.6099 8.63001 42.8999 9.68001C44.1799 10.73 44.3799 12.62 43.3299 13.9L21.3299 40.9C20.7799 41.57 19.9699 41.98 19.0999 42C19.0699 42 19.0399 42 19.0099 42H18.9999Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const CheckFilled = styled(CheckFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
