import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ParametersSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    testID={testID}
    fill={color}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40.229 20.119c-1.429.799-2.3 2.272-2.3 3.858V24h.012c0 1.598.883 3.06 2.3 3.859l1.172.663c.558.316.755 1.002.43 1.542l-3.484 5.85a1.183 1.183 0 0 1-1.59.416l-1.197-.675a4.703 4.703 0 0 0-4.564 0l-.07.045c-1.416.787-2.287 2.25-2.287 3.825v1.35c0 .619-.523 1.125-1.161 1.125h-6.968c-.639 0-1.161-.506-1.161-1.125v-1.328c0-1.575-.871-3.037-2.288-3.825l-.058-.033a4.712 4.712 0 0 0-4.599 0l-1.184.663a1.194 1.194 0 0 1-1.591-.416l-3.484-5.85a1.117 1.117 0 0 1 .43-1.541l1.173-.653c1.428-.798 2.299-2.272 2.299-3.858v-.045c0-1.598-.883-3.06-2.3-3.859l-1.172-.664c-.558-.315-.755-1.001-.43-1.541l3.484-5.85a1.18 1.18 0 0 1 1.59-.405l1.185.664c1.429.787 3.182.799 4.599 0l.046-.034c1.417-.788 2.288-2.25 2.288-3.825v-1.35c0-.619.523-1.125 1.161-1.125h6.968c.639 0 1.161.506 1.161 1.125v1.35c0 1.575.871 3.037 2.288 3.825l.046.011a4.713 4.713 0 0 0 4.6 0l1.184-.663c.557-.304 1.265-.124 1.59.416l3.484 5.85c.314.54.128 1.226-.43 1.541l-1.172.664ZM32.123 24c0 4.35-3.64 7.875-8.129 7.875-4.49 0-8.129-3.526-8.129-7.875 0-4.35 3.64-7.875 8.129-7.875 4.49 0 8.129 3.526 8.129 7.875Z"
    />
  </AccessibleSvg>
)

export const Parameters = styled(ParametersSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
