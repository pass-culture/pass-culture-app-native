import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const LockSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
  ...props
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      fill={color}
      d="M11 19H12V17C12 10.3726 17.3726 5 24 5C30.6274 5 36 10.3726 36 17V19H37C38.6569 19 40 20.3431 40 22V40C40 41.6569 38.6569 43 37 43H11C9.34315 43 8 41.6569 8 40V22C8 20.3431 9.34315 19 11 19ZM32 17V19H16V17C16 12.5817 19.5817 9 24 9C28.4183 9 32 12.5817 32 17ZM28 29C28 30.4806 27.1956 31.7733 26 32.4649V35C26 36.1046 25.1046 37 24 37C22.8954 37 22 36.1046 22 35V32.4649C20.8044 31.7733 20 30.4806 20 29C20 26.7909 21.7909 25 24 25C26.2091 25 28 26.7909 28 29Z"
    />
  </AccessibleSvg>
)

export const Lock = styled(LockSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
