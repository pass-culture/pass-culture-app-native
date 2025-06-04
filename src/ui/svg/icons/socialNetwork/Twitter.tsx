import React from 'react'
import { Path, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const TwitterSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color: _color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Rect width="48" height="48" rx="8" fill="#161617" />
    <Path
      d="M32.8851 10H37.6379L27.2025 21.8819L39.3943 38H29.8268L22.336 28.2052L13.7604 38H9.00762L20.063 25.2915L8.3877 10H18.1929L24.9604 18.9476L32.8851 10ZM31.2216 35.2103H33.8563L16.8084 12.6863H13.9774L31.2216 35.2103Z"
      fill="white"
    />
  </AccessibleSvg>
)

export const Twitter = styled(TwitterSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.icons.sizes.standard,
}))``
