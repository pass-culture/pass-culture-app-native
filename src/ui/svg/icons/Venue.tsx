import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const VenueSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fill={color}
        d="M22 4c-.548 0-1 .452-1 1v18h7c2.212 0 4 1.788 4 4v18a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-8c0-.548-.452-1-1-1h-2c-.548 0-1 .452-1 1v8a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h2V27c0-2.212 1.788-4 4-4h1a1 1 0 1 1 0 2h-1c-1.108 0-2 .892-2 2v17h7v-7c0-1.652 1.348-3 3-3h2c1.652 0 3 1.348 3 3v7h7V27c0-1.108-.892-2-2-2H16a1 1 0 1 1 0-2h3V5c0-1.652 1.348-3 3-3h18c1.652 0 3 1.348 3 3v7a1 1 0 1 1-2 0V5c0-.548-.452-1-1-1H22Z"
      />
      <Path
        fill={color}
        d="M42 16.1a1 1 0 0 1 1 1V44h1a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2h5V17.1a1 1 0 0 1 1-1ZM37 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM38 25a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
      />
      <Path
        fill={color}
        d="M37 33a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM38 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9ZM31 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM32 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9ZM25 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM26 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9Z"
      />
    </AccessibleSvg>
  )
}

export const Venue = styled(VenueSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
