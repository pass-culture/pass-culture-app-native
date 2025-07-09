import React from 'react'
import { G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const GridSvg = ({ size, color, accessibilityLabel, testID }: AccessibleIcon) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G fill={color}>
        <Path d="M13 3.00004V5.33337H10.6667V3.00004H13ZM14 1.33337H9.66667C9.3 1.33337 9 1.63337 9 2.00004V6.33337C9 6.70004 9.3 7.00004 9.66667 7.00004H14C14.3667 7.00004 14.6667 6.70004 14.6667 6.33337V2.00004C14.6667 1.63337 14.3667 1.33337 14 1.33337Z" />
        <Path d="M5.3335 3.00004V5.33337H3.00016V3.00004H5.3335ZM6.3335 1.33337H2.00016C1.6335 1.33337 1.3335 1.63337 1.3335 2.00004V6.33337C1.3335 6.70004 1.6335 7.00004 2.00016 7.00004H6.3335C6.70016 7.00004 7.00016 6.70004 7.00016 6.33337V2.00004C7.00016 1.63337 6.70016 1.33337 6.3335 1.33337Z" />
        <Path d="M13 10.6667V13H10.6667V10.6667H13ZM14 9H9.66667C9.3 9 9 9.3 9 9.66667V14C9 14.3667 9.3 14.6667 9.66667 14.6667H14C14.3667 14.6667 14.6667 14.3667 14.6667 14V9.66667C14.6667 9.3 14.3667 9 14 9Z" />
        <Path d="M5.3335 10.6667V13H3.00016V10.6667H5.3335ZM6.3335 9H2.00016C1.6335 9 1.3335 9.3 1.3335 9.66667V14C1.3335 14.3667 1.6335 14.6667 2.00016 14.6667H6.3335C6.70016 14.6667 7.00016 14.3667 7.00016 14V9.66667C7.00016 9.3 6.70016 9 6.3335 9Z" />
      </G>
    </AccessibleSvg>
  )
}

export const Grid = styled(GridSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
