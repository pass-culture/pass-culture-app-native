import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const LocationPointerAppV2Svg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    testID={testID}
    accessibilityLabel={accessibilityLabel}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 23C12.5 23 21.5 17.75 21.5 11C21.5 6.02944 17.4706 2 12.5 2C7.52944 2 3.5 6.02944 3.5 11C3.5 17.75 12.5 23 12.5 23ZM12.5 14C14.1569 14 15.5 12.6569 15.5 11C15.5 9.34315 14.1569 8 12.5 8C10.8431 8 9.5 9.34315 9.5 11C9.5 12.6569 10.8431 14 12.5 14Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const LocationPointerAppV2 = styled(LocationPointerAppV2Svg).attrs(
  ({ color, size, theme }) => ({
    color: color ?? theme.designSystem.color.icon.default,
    size: size ?? theme.icons.sizes.smaller,
  })
)``
