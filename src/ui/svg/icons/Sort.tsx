import React from 'react'
import { G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function SortSvg({ size, color, accessibilityLabel, testID }: AccessibleIcon) {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G fill="none" fillRule="evenodd">
        <G fill={color}>
          <Path d="M4.00006 11C4.00006 9.89543 4.89549 9 6.00006 9L42.0001 9C43.1046 9 44.0001 9.89543 44.0001 11C44.0001 12.1046 43.1046 13 42.0001 13L6.00006 13C4.89549 13 4.00006 12.1046 4.00006 11ZM4.00006 24C4.00006 22.8954 4.89549 22 6.00006 22L34 22C35.1046 22 36 22.8954 36 24C36 25.1046 35.1046 26 34 26L6.00006 26C4.89549 26 4.00006 25.1046 4.00006 24ZM5.99988 35C4.89531 35 3.99988 35.8954 3.99988 37C3.99988 38.1046 4.89531 39 5.99988 39H22C23.1046 39 24 38.1046 24 37C24 35.8954 23.1046 35 22 35H5.99988Z" />
        </G>
      </G>
    </AccessibleSvg>
  )
}

export const Sort = styled(SortSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
