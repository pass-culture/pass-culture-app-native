import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const RightFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
  style,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    style={style}>
    <Path
      fill={color}
      d="M16.66 42.3374C15.784 41.4504 15.7794 40.0078 16.6498 39.1151L31.3703 24.015L16.6671 8.88036L16.6647 8.87782C15.7983 7.98103 15.809 6.53826 16.689 5.65527C17.5688 4.7724 18.9842 4.78309 19.851 5.67874L19.852 5.67971L34.8251 21.0923L34.8278 21.0951C36.3846 22.7066 36.3998 25.3278 34.8188 26.9452L34.818 26.9461L19.8236 42.3271C18.9529 43.2202 17.5363 43.2249 16.66 42.3374Z"
    />
  </AccessibleSvg>
)

export const RightFilled = styled(RightFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
