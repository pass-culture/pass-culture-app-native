import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const PositionFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    accessibilityLabel={accessibilityLabel}
    fill="none"
    testID={testID}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.2552 2.34492L2.92518 9.46492C2.05018 9.82492 2.03518 11.0649 2.90518 11.4449L9.24018 14.2099C9.49018 14.3199 9.68518 14.5149 9.79518 14.7649L12.5602 21.0949C12.9402 21.9649 14.1752 21.9499 14.5402 21.0749L21.6552 3.74492C22.0202 2.85992 21.1352 1.97992 20.2552 2.34492Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const PositionFilled = styled(PositionFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
