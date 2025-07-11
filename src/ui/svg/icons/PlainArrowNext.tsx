import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const PlainArrowNextSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM24.7527 32.5965C24.108 31.9518 24.108 30.9065 24.7527 30.2618L29.3786 25.6359L14.9458 25.6359C14.0341 25.6359 13.2949 24.8968 13.2949 23.985C13.2949 23.0733 14.0341 22.3341 14.9458 22.3341L29.3485 22.3341L24.7527 17.7383C24.108 17.0936 24.108 16.0483 24.7527 15.4036C25.3975 14.7589 26.4427 14.7589 27.0875 15.4036L34.5166 22.8327C35.1613 23.4774 35.1613 24.5227 34.5166 25.1674L27.0875 32.5965C26.4428 33.2412 25.3975 33.2412 24.7527 32.5965Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const PlainArrowNext = styled(PlainArrowNextSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
