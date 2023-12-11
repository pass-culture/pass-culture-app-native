import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ArrowUpSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={color}
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path d="M4.28844 31.6748C4.67728 32.07 5.31266 32.075 5.70759 31.6858L23.22 14.3334C23.6627 13.8973 24.3848 13.9038 24.8107 14.3289L24.812 14.3302L42.2892 31.7078C42.6823 32.0988 43.3177 32.0967 43.7084 31.7033C44.099 31.3098 44.0969 30.674 43.7038 30.2831L26.228 12.9068C25.0137 11.6954 23.0305 11.7016 21.8119 12.9022L4.29946 30.2546C3.90452 30.6438 3.89959 31.2796 4.28844 31.6748Z" />
  </AccessibleSvg>
)

export const ArrowUp = styled(ArrowUpSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
