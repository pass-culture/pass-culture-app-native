import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ClockFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  testID,
  accessibilityLabel,
  color,
}: AccessibleIcon) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM24 9.79639C25.0794 9.79639 25.9545 10.6715 25.9545 11.7509V23.1904L31.1093 28.3452C31.8726 29.1085 31.8726 30.3461 31.1093 31.1094C30.346 31.8727 29.1085 31.8727 28.3452 31.1094L22.6179 25.3821C22.2513 25.0155 22.0454 24.5184 22.0454 24V11.7509C22.0454 10.6715 22.9205 9.79639 24 9.79639Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const ClockFilled = styled(ClockFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
