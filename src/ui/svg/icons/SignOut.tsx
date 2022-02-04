import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const SignOutSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID} aria-hidden>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25 3.5C25 2.94772 24.5523 2.5 24 2.5C23.4477 2.5 23 2.94772 23 3.5V24.5C23 25.0523 23.4477 25.5 24 25.5C24.5523 25.5 25 25.0523 25 24.5V3.5ZM15.7069 7.39948C16.2037 7.15816 16.4108 6.55982 16.1695 6.06305C15.9282 5.56627 15.3298 5.35918 14.8331 5.60049C7.83179 9.00141 3 16.1827 3 24.5C3 36.1023 12.3977 45.5 24 45.5C35.6023 45.5 45 36.1023 45 24.5C45 16.1827 40.1682 9.00141 33.1669 5.60049C32.6702 5.35918 32.0718 5.56627 31.8305 6.06305C31.5892 6.55982 31.7963 7.15816 32.2931 7.39948C38.6318 10.4786 43 16.9773 43 24.5C43 34.9977 34.4977 43.5 24 43.5C13.5023 43.5 5 34.9977 5 24.5C5 16.9773 9.36822 10.4786 15.7069 7.39948Z"
      fill={color}
    />
  </Svg>
)

export const SignOut = styled(SignOutSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
