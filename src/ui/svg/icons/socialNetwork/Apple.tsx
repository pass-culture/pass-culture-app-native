import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const AppleSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M14.1168 5.11401C14.0313 5.18152 12.5219 6.0471 12.5219 7.9718C12.5219 10.198 14.4425 10.9856 14.5 11.0051C14.4912 11.0531 14.1949 12.0837 13.4873 13.1338C12.8565 14.0579 12.1976 14.9805 11.1952 14.9805C10.1929 14.9805 9.93496 14.3879 8.77785 14.3879C7.65023 14.3879 7.24929 15 6.33245 15C5.41561 15 4.77589 14.1449 4.04035 13.0948C3.18837 11.8617 2.5 9.94599 2.5 8.12781C2.5 5.21152 4.36316 3.66487 6.19684 3.66487C7.17117 3.66487 7.98336 4.31593 8.59507 4.31593C9.17731 4.31593 10.0853 3.62586 11.1938 3.62586C11.6139 3.62586 13.1233 3.66487 14.1168 5.11401ZM10.6675 2.39124C11.126 1.83768 11.4503 1.06961 11.4503 0.30153C11.4503 0.19502 11.4414 0.0870087 11.4222 0C10.6764 0.0285028 9.78903 0.505551 9.25396 1.13711C8.83387 1.62316 8.44178 2.39124 8.44178 3.16982C8.44178 3.28683 8.46094 3.40384 8.46978 3.44134C8.51695 3.45034 8.5936 3.46085 8.67025 3.46085C9.33945 3.46085 10.1811 3.0048 10.6675 2.39124Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const Apple = styled(AppleSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
