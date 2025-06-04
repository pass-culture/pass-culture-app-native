import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const MicroSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11V6Z"
      fill="#161617"
    />
    <Path
      d="M5 11C5 12.8565 5.7375 14.637 7.05025 15.9497C8.36301 17.2625 10.1435 18 12 18C13.8565 18 15.637 17.2625 16.9497 15.9497C18.2625 14.637 19 12.8565 19 11"
      stroke="#161617"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 21V19"
      stroke="#161617"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </AccessibleSvg>
)

export const Micro2 = styled(MicroSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
